const browserHelper = require('../browser-helper');
const config = require('../config.json');
const imageDownloader = require('./image-downloader');
const fileHelper = require('../file-helper');
const Driver = require('./Driver').Driver;

const url = config.baseUrl + config.drivers.path;
const {
    "main-link-selector": mainLinkSelector,
    "thumbnail-selector": thumbnailSelector,
    ...selectors
} = config.drivers.selectors;

/**
 * Main Function - navigate to drivers' main page and scraps drivers data 
 * from formula1.com
 */
const scrapeDrivers = async () => {
    const page = await browserHelper.openPage(url, true);

    const thumbnailUrls = await fetchDriverThumbnailUrls(page);
    const urls = await fetchDriverUrls(page);
    const drivers = await fetchAllDriversData(urls);
    
    await browserHelper.close();
    
    merge(drivers, thumbnailUrls);
    await imageDownloader.downloadProfilePictures(drivers);
    await imageDownloader.downloadThumbnailPictures(drivers);
    await imageDownloader.downloadHelmetPictures(drivers);
    await imageDownloader.downloadFlagImages(drivers);

    const driversJson = JSON.stringify(drivers, Driver.replacer, 2);
    await fileHelper.saveFile(Driver.jsonFilePath, driversJson);
};

/**
 * Scraps all drivers' urls from main driver's page
 * @param {page} page 
 */
const fetchDriverUrls = async (page) => {
    return await page.evaluate((selector) => Array.from(document.querySelectorAll(selector)).map(anchor => anchor.href), mainLinkSelector);
};

/**
 * Navigates and scraps data from multiple drivers given the main drivers page
 * @param {Array<string>} urls 
 */
const fetchAllDriversData = async (urls) => {
    return Promise.all(urls.map(url => fetchDriverData(url)))
        .catch(err => console.log(err));
};

/**
 * Navigate to single driver's url and scrapes its data
 * @param {string} url 
 */
const fetchDriverData = async (url) => {
    console.log('Getting driver data');

    const page = await browserHelper.openPage(url);
    const data = await fetchDriverDataAsObject(page);
    await page.close();

    return Driver.fromDownload(data);
};

/**
 * Scraps driver's data from given page
 * @param {page} page 
 */
const fetchDriverDataAsObject = async (page) => {
    return await page.evaluate((selectors) => {
        var driver = Array.from(document.querySelectorAll('tr')).map(tr => {
            var obj = {};
            const key = tr.querySelector('th').textContent.trim().toLowerCase().split(' ').join('-');
            const value = tr.querySelector('td').textContent.trim();

            obj[key] = value;
            return obj;
        }).reduce((obj, item) => {
            const key = Object.keys(item)[0];
            obj[key] = item[key];

            return obj;
        }, {});

        driver.name = document.querySelector(selectors.name).textContent;
        driver.number = document.querySelector(selectors.number).textContent.trim();
        driver.flag = document.querySelector(selectors.flag).src;
        driver['profile-picture'] = document.querySelector(selectors.profilePicture).src;
        driver['helmet-picture'] = document.querySelector(selectors.helmetPicture).src;

        return driver;
    }, selectors);
};

/**
 * Scraps all drivers' thumbnail images links
 * @param {page} page 
 */
const fetchDriverThumbnailUrls = async (page) => {
    return page.evaluate((selector) => Array.from(document.querySelectorAll(selector)).map(image => image.src), thumbnailSelector);
};

/**
 * Merge thumbnail urls to the specific driver
 * @param {Array<Driver>} drivers 
 * @param {Array<string} thumbnailUrls 
 */
const merge = (drivers, thumbnailUrls) => {
    drivers.forEach(driver => {
        const lastName = driver.lastName.toLowerCase();
        const thumbnailUrl = thumbnailUrls.find(url => url.lastIndexOf(lastName));

        driver.thumbnailPicture = thumbnailUrl;
    });

    return drivers;
}

/**
 * Main driver scrapping execution
 */
(async () => {
    scrapeDrivers();
})();
