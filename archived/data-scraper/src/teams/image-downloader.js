const https = require('https');
const fs = require('fs');
const config = require('../config.json');

const imageOutputPath = process.cwd() + "/" + config.teams["output-path"] + config.teams["image-output-path"];

/**
 * Download all teams' small logo images
 * @param {Array<Team>} teams 
 */
const downloadSmallLogoImages = async (teams) => {
    await createTempDirIfNeeded();
    await Promise.all(teams.map(team => downloadSmallLogoImage(team)));
};

/**
 * Download single team's small logo image
 * @param {Team} team 
 */
const downloadSmallLogoImage = async (team) => {
    const file = fs.createWriteStream(imageOutputPath + team.getSmallLogoImageFileName());
    https.get(team.smallLogoUrl, response => {
        response.pipe(file);
        file.on('finish', function () {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) {
        fs.unlink(file);
    });
};

/**
 * Download all teams' big logo images
 * @param {Array<Team>} teams 
 */
const downloadBigLogoImages = async (teams) => {
    await createTempDirIfNeeded();
    await Promise.all(teams.map(team => downloadBigLogoImage(team)));
};

/**
 * Download single team's big logo images
 * @param {Team} team 
 */
const downloadBigLogoImage = async (team) => {
    const file = fs.createWriteStream(imageOutputPath + team.getBigLogoImageFileName());
    https.get(team.bigLogoUrl, response => {
        response.pipe(file);
        file.on('finish', function () {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) {
        fs.unlink(file);
    });
};

/**
 * Download all teams' car images
 * @param {Array<Team>} teams 
 */
const downloadCarImages = async (teams) => {
    await createTempDirIfNeeded();
    await Promise.all(teams.map(team => downloadCarImage(team)));
};

/**
 * Download single team's car image
 * @param {Team} team 
 */
const downloadCarImage = async (team) => {
    const file = fs.createWriteStream(imageOutputPath + team.getCarImageFileName());
    https.get(team.carImageUrl, response => {
        response.pipe(file);
        file.on('finish', function () {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) {
        fs.unlink(file);
    });
};

/**
 * Create temp directory to store teams' data if it doesn't exist
 */
const createTempDirIfNeeded = async () => {
    return fs.promises.mkdir(imageOutputPath, { recursive: true });
};

exports.downloadBigLogoImages = downloadBigLogoImages;
exports.downloadSmallLogoImages = downloadSmallLogoImages;
exports.downloadCarImages = downloadCarImages;
