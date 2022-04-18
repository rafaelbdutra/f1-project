const browserHelper = require('../browser-helper');
const config = require('../config.json');
const imageDownloader = require('./image-downloader');
const fileHelper = require('../file-helper');
const Team = require('./Team').Team;

const url = config.baseUrl + config.teams.path;
const {
    "main-link-selector": mainLinkSelector,
    "car-image-selector": carImageSelector,
    "small-logo-selector": smallLogoSelector,
    ...selectors
} = config.teams.selectors;

/**
 * Main Function - navigate to teams' main page and scraps team's data 
 * from formula1.com
 */
const scrapeTeams = async () => {
    const page = await browserHelper.openPage(url);

    const carImageUrls = await fetchTeamImageUrls(page, carImageSelector);
    const smallLogoUrls = await fetchTeamImageUrls(page, smallLogoSelector);
    const urls = await fetchTeamUrls(page);
    const teams = await fetchAllTeamsData(urls);

    await browserHelper.close();
    
    merge(teams, 'carImageUrl', carImageUrls);
    merge(teams, 'smallLogoUrl', smallLogoUrls);
    await imageDownloader.downloadSmallLogoImages(teams);
    await imageDownloader.downloadBigLogoImages(teams);
    await imageDownloader.downloadCarImages(teams);

    const teamsJson = JSON.stringify(teams, Team.replacer, 2);
    await fileHelper.saveFile(Team.jsonFilePath, teamsJson);
};

/**
 * Scraps all teams' urls from main team's page
 * @param {page} page 
 */
const fetchTeamUrls = async (page) => {
    return await page.evaluate((selector) => Array.from(document.querySelectorAll(selector)).map(anchor => anchor.href), mainLinkSelector);
};

/**
 * Navigates and scraps data from multiple teams given the main team's page
 * @param {Array<string>} urls 
 */
const fetchAllTeamsData = async (urls) => {
    return Promise.all(urls.map(url => fetchTeamData(url)))
        .catch(err => console.log(err));
};

/**
 * Navigate to single team's url and scrapes its data
 * @param {string} url 
 */
const fetchTeamData = async (url) => {
    console.log('Getting team data');

    const page = await browserHelper.openPage(url);
    const data = await fetchTeamDataAsObject(page);
    await page.close();

    return Team.fromDownload(data);
};

/**
 * Scraps team's data from given page
 * @param {page} page 
 */
const fetchTeamDataAsObject = async (page) => {
    return await page.evaluate((selectors) => {
        var team = Array.from(document.querySelectorAll('tr')).map(tr => {
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

        team.name = document.querySelector(selectors.name).textContent;
        team.bigLogoUrl = document.querySelector(selectors.bigLogo).src;

        const drivers = document.querySelectorAll(selectors.drivers);

        team.driver1 = drivers[0].textContent;
        team.driver2 = drivers[1].textContent;

        return team;
    }, selectors);
};

/**
 * Scraps all teams' images links
 * @param {page} page 
 */
const fetchTeamImageUrls = async (page, selector) => {
    return page.evaluate((selector) => Array.from(document.querySelectorAll(selector)).map(image => image.src), selector);
};

/**
 * Merge image urls to the specific team
 * @param {Array<Team>} teams 
 * @param {Array<string} imageUrls 
 */
const merge = (teams, property, imageUrls) => {
    teams.forEach(team => {
        const name = team.name.toLowerCase();
        const imageUrl = imageUrls.find(url => url.lastIndexOf(name));

        team[property] = imageUrl;
    });

    return teams;
}

/**
 * Main team scrapping execution
 */
(async () => {
    scrapeTeams();
})();
