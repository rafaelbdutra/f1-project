const puppeteer = require('puppeteer');

let browser;

const openPage = async (url, scroll = false) => {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.goto(url, { timeout: 60000 });
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await closeBanner();
    if (scroll) {
        await autoScroll(page);
    }

    return page;
};

const getBrowser = async () => {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: false
        });
    }

    return browser;
};

const close = async () => {
    if (browser) {
        browser.close();
    }
};

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

exports.openPage = openPage;
exports.close = close;
