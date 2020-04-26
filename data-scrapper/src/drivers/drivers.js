const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('../config.json');
const imageDownloader = require('./image-downloader');

const url = config.baseUrl + config.drivers.path;
const {
    "main-link-selector": mainLinkSelector,
    "thumbnail-selector": thumbnailSelector,
    ...selectors
} = config.drivers.selectors;
const driversJsonFile = process.cwd() + "/" + config.drivers["output-path"] + config.drivers.jsonOutputFile;

const scrapeDrivers = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.setViewport({
        width: 1200,
        height: 800
    });
    await autoScroll(page);

    const thumbnailUrls = await fetchDriverThumbnailUrls(page);
    const urls = await fetchDriverUrls(page);
    const drivers = await fetchAllDriversData(browser, urls);

    await browser.close();

    await imageDownloader.downloadProfilePictures(drivers);
    await imageDownloader.downloadThumbnailPictures(thumbnailUrls, drivers);
    await imageDownloader.downloadHelmetPictures(drivers);
    await saveDriversAsJson(drivers);
};

const fetchDriverUrls = async (page) => {
    return await page.evaluate((selector) => Array.from(document.querySelectorAll(selector)).map(anchor => anchor.href), mainLinkSelector);
};

const fetchAllDriversData = async (browser, urls) => {
    return Promise.all(urls.map(url => fetchDriverData(browser, url)))
        .catch(err => console.log(err));
};

const fetchDriverData = async (browser, url) => {
    console.log('Getting driver data');

    const page = await browser.newPage();
    await page.goto(url);

    await closeBanner();
    const driverData = await fetchDriverDataAsObject(page);

    await page.close();

    return driverData;
};

const fetchDriverDataAsObject = async (page) => {
    return await page.evaluate((selectors) => {
        var driver = Array.from(document.querySelectorAll("tr")).map(tr => {
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

const closeBanner = async (page) => {
    try {
        await page.click('.sailthru-overlay-close');
    } catch (error) { }
};

const fetchDriverThumbnailUrls = async (page) => {
    return page.evaluate((selector) => Array.from(document.querySelectorAll(selector)).map(image => image.src), thumbnailSelector);
};

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

const saveDriversAsJson = async (drivers) => {
    const json = JSON.stringify(drivers, null, 2);
    return fs.promises.writeFile(driversJsonFile, json);
};

exports.scrapeDrivers = scrapeDrivers;