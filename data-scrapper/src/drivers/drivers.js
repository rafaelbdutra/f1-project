const puppeteer = require('puppeteer');
const https = require('https');
const fs = require('fs');
const config = require('../config.json');

const url = config.baseUrl + config.drivers.path;
const mainLinkSelector = config.drivers["main-link-selector"];
const imageOutputPath = config.drivers["image-output-path"];

const scrapeDrivers = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.setViewport({
        width: 1200,
        height: 800
    });
    await autoScroll(page);

    const thumbnails = await fetchDriverThumbnailPictures(page);
    const urls = await fetchDriverUrls(page);
    const drivers = await fetchAllDriversData(browser, urls);

    console.dir(drivers);
    await browser.close();

    await downloadProfilePictures(drivers);
    await downloadThumbnailPictures(thumbnails, drivers);
    await downloadHelmetPictures(drivers);
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
    return await page.evaluate(() => {
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

        driver.name = document.querySelector('h1').textContent;
        driver.number = document.querySelector('.driver-number').textContent.trim();
        driver.flag = document.querySelector('.icn-flag img').src;
        driver['profile-picture'] = document.querySelector('.driver-image-crop-inner img').src;
        driver['helmet-picture'] = document.querySelector('.brand-logo img').src;

        return driver;
    });
};

const closeBanner = async (page) => {
    try {
        await page.click('.sailthru-overlay-close');
        console.log('Clicked');
    } catch (error) {
        console.log("Banner didn't appear");
    }
}

const fetchDriverThumbnailPictures = async (page) => {
    page.scro
    return page.evaluate((selector) => Array.from(document.querySelectorAll(selector)).map(image => image.src), '.listing-item--photo img');
};

const downloadProfilePictures = async (drivers) => {
    await Promise.all(drivers.map(driver => downloadProfilePicture(driver)));
};

const downloadProfilePicture = async (driver) => {
    const url = driver['profile-picture'];
    const fileName = driver.name.toLowerCase().split(' ').join('-');
    const fileExtension = url.slice(url.lastIndexOf('.'));

    const file = fs.createWriteStream(imageOutputPath + fileName + fileExtension);
    https.get(url, response => {
        response.pipe(file);
        file.on('finish', function() {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function(err) {
        fs.unlink(file);
    });
};

const downloadThumbnailPictures = async (thumbnails, drivers) => {
    await Promise.all(thumbnails.map(thumbnail => downloadThumbnailPicture(thumbnail, drivers)));
};

const downloadThumbnailPicture = async (thumbnail, drivers) => {
    const filteredDriver = drivers.find(driver => {
        const driverName = driver.name.toLowerCase().split(' ')[0];
        const lowerThumbail = thumbnail.toLowerCase();

        return lowerThumbail.lastIndexOf(driverName) > -1;
    });

    const fileName = filteredDriver.name.toLowerCase().split(' ').join('-') + '-thumbnail';
    const fileExtension = thumbnail.slice(thumbnail.lastIndexOf('.'));

    const file = fs.createWriteStream(imageOutputPath + fileName + fileExtension);
    https.get(thumbnail, response => {
        response.pipe(file);
        file.on('finish', function() {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function(err) {
        fs.unlink(file);
    });
};

const downloadHelmetPictures = async (drivers) => {
    await Promise.all(drivers.map(driver => downloadHelmetPicture(driver)));
};

const downloadHelmetPicture = async (driver) => {
    const url = driver['helmet-picture'];
    const fileName = driver.name.toLowerCase().split(' ').join('-') + '-helmet';
    const fileExtension = url.slice(url.lastIndexOf('.'));

    const file = fs.createWriteStream(imageOutputPath + fileName + fileExtension);
    https.get(url, response => {
        response.pipe(file);
        file.on('finish', function() {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function(err) {
        fs.unlink(file);
    });
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

exports.scrapeDrivers = scrapeDrivers;