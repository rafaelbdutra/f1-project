const browserHelper = require('../browser-helper');
const config = require('../config.json');
const imageDownloader = require('./image-downloader');
const fileHelper = require('../file-helper');
const Track = require('./Track').Track;

const url = config.baseUrl + config.tracks.path;
const {
    "main-link-selector": mainLinkSelector,
    ...selectors
} = config.tracks.selectors;

/**
 * Main Function - navigate to tracks' main page and scraps track's data 
 * from formula1.com
 */
const scrapeTracks = async () => {
    const page = await browserHelper.openPage(url);

    const urls = await fetchTrackUrls(page);
    const tracks = await fetchAllTracksData(urls);

    await browserHelper.close();

    console.dir(tracks);

    await imageDownloader.downloadCircuitImages(tracks);
    await imageDownloader.downloadAerialImages(tracks);

    const tracksJson = JSON.stringify(tracks, Track.replacer, 2);
    await fileHelper.saveFile(Track.jsonFilePath, tracksJson);
};

/**
 * Scraps all track' urls from main team's page
 * @param {page} page 
 */
const fetchTrackUrls = async (page) => {
    return await page.evaluate((selector) => Array.from(document.querySelectorAll(selector)).map(anchor => anchor.href), mainLinkSelector);
};

/**
 * Navigates and scraps data from multiple tracks given the main track's page
 * @param {Array<string>} urls 
 */
const fetchAllTracksData = async (urls) => {
    return Promise.all(urls.map(url => fetchTrackData(url)))
        .catch(err => console.log(err));
};

/**
 * Navigate to single track's url and scrapes its data
 * @param {string} url 
 */
const fetchTrackData = async (url) => {
    console.log('Getting track data');

    const page = await browserHelper.openPage(url, true);
    const data = await fetchTrackDataAsObject(page);
    await page.close();

    return Track.fromDownload(data);
};

/**
 * Scraps track's data from given page
 * @param {page} page 
 */
const fetchTrackDataAsObject = async (page) => {
    return await page.evaluate((selectors) => {
        var track = Array.from(document.querySelectorAll('tr')).map(tr => {
            let obj = {};

            let line = tr.querySelectorAll('th');
            if (line.length === 0) {
                line = tr.querySelectorAll('td');
            }

            const key = line[0].textContent.trim().toLowerCase().split(' ').join('-');
            let value = line[1].textContent.trim();

            obj[key] = value;
            return obj;
        }).reduce((obj, item) => {
            const key = Object.keys(item)[0];
            obj[key] = item[key];

            return obj;
        }, {});

        track.name = document.querySelector(selectors.name).textContent;

        const trackImages = Array.from(document.querySelectorAll(selectors['track-images-selector']))
                .map(img => img.src);
        track.circuitImageUrl = trackImages[0];
        track.aerialImageUrl = trackImages[1];

        return track;
    }, selectors);
};

/**
 * Main team scrapping execution
 */
(async () => {
    scrapeTracks();
})();
