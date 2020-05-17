const puppeteer = require('puppeteer');
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
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();

    await page.goto(url, { timeout: 60000 });
    await page.setViewport({
        width: 1200,
        height: 800
    });
    await autoScroll(page);

    const thumbnailUrls = await fetchDriverThumbnailUrls(page);
    const urls = await fetchDriverUrls(page);
    const drivers = await fetchAllDriversData(browser, urls);
    
    await browser.close();
    
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
 * @param {browser} browser 
 * @param {Array<string>} urls 
 */
const fetchAllDriversData = async (browser, urls) => {
    return Promise.all(urls.map(url => fetchDriverData(browser, url)))
        .catch(err => console.log(err));
};

/**
 * Navigate to single driver's url and scrapes its data
 * @param {broser} browser 
 * @param {string} url 
 */
const fetchDriverData = async (browser, url) => {
    console.log('Getting driver data');

    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    await closeBanner();

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
 * Close banner randomly opened on formula1.com pages
 * @param {page} page 
 */
const closeBanner = async (page) => {
    try {
        await page.click('.sailthru-overlay-close');
    } catch (error) { }
};

/**
 * Auto scroll a page to its bottom (used in main drivers page due to thumbnail lazy load)
 * @param {page} page 
 */
const autoScroll = async (page) => {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
};

/**
 * Main driver scrapping execution
 */
(async () => {
    scrapeDrivers();
})();
