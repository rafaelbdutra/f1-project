const https = require('https');
const fs = require('fs');
const config = require('../config.json');

const imageOutputPath = process.cwd() + "/" + config.drivers["output-path"] + config.drivers["image-output-path"];

/**
 * Download all drivers' profile pictures
 * @param {Array<Driver>} drivers 
 */
const downloadProfilePictures = async (drivers) => {
    await createTempDirIfNeeded();
    await Promise.all(drivers.map(driver => downloadProfilePicture(driver)));
};

/**
 * Download single driver's profile picture
 * @param {Driver} driver 
 */
const downloadProfilePicture = async (driver) => {
    const file = fs.createWriteStream(imageOutputPath + driver.getProfilePictureFileName());
    https.get(driver.profilePicture, response => {
        response.pipe(file);
        file.on('finish', function () {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) {
        fs.unlink(file);
    });
};

/**
 * Download all drivers' thumbnail pictures
 * @param {Array<Driver>} drivers 
 */
const downloadThumbnailPictures = async (drivers) => {
    await createTempDirIfNeeded();
    await Promise.all(drivers.map(driver => downloadThumbnailPicture(driver)));
};

/**
 * Download single driver's thumbnail picture
 * @param {Driver} driver 
 */
const downloadThumbnailPicture = async (driver) => {
    const file = fs.createWriteStream(imageOutputPath + driver.getThumbnailPictureFileName());
    https.get(driver.thumbnailPicture, response => {
        response.pipe(file);
        file.on('finish', function () {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) {
        fs.unlink(file);
    });
};

/**
 * Download all drivers' helmet pictures
 * @param {Array<Driver>} drivers 
 */
const downloadHelmetPictures = async (drivers) => {
    await createTempDirIfNeeded();
    await Promise.all(drivers.map(driver => downloadHelmetPicture(driver)));
};

/**
 * Download single driver's helmet picture
 * @param {Driver} driver 
 */
const downloadHelmetPicture = async (driver) => {
    const file = fs.createWriteStream(imageOutputPath + driver.getHelmetPictureFileName());
    https.get(driver.helmetPicture, response => {
        response.pipe(file);
        file.on('finish', function () {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) {
        fs.unlink(file);
    });
};

/**
 * Download all drivers' flag images
 * @param {Array<Driver>} drivers 
 */
const downloadFlagImages = async (drivers) => {
    await createTempDirIfNeeded();
    await Promise.all(drivers.map(driver => downloadFlagImage(driver)));
};

/**
 * Download single driver's flag image
 * @param {Driver} driver 
 */
const downloadFlagImage = async (driver) => {
    const file = fs.createWriteStream(imageOutputPath + driver.getFlagImageFileName());
    https.get(driver.flag, response => {
        response.pipe(file);
        file.on('finish', function () {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) {
        fs.unlink(file);
    });
};

/**
 * Create temp directory to store drivers' data if it doesn't exist
 */
const createTempDirIfNeeded = async () => {
    return fs.promises.mkdir(imageOutputPath, { recursive: true });
};

exports.downloadThumbnailPictures = downloadThumbnailPictures;
exports.downloadProfilePictures = downloadProfilePictures;
exports.downloadHelmetPictures = downloadHelmetPictures;
exports.downloadFlagImages = downloadFlagImages;