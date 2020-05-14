const https = require('https');
const fs = require('fs');
const config = require('../config.json');

const imageOutputPath = process.cwd() + "/" + config.drivers["output-path"] + config.drivers["image-output-path"];

const downloadProfilePictures = async (drivers) => {
    await createTempDirIfNeeded();
    await Promise.all(drivers.map(driver => downloadProfilePicture(driver)));
};

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

const downloadThumbnailPictures = async (drivers) => {
    await createTempDirIfNeeded();
    await Promise.all(drivers.map(driver => downloadThumbnailPicture(driver)));
};

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

const downloadHelmetPictures = async (drivers) => {
    await createTempDirIfNeeded();
    await Promise.all(drivers.map(driver => downloadHelmetPicture(driver)));
};

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

const createTempDirIfNeeded = async () => {
    return fs.promises.mkdir(imageOutputPath, { recursive: true });
};

exports.downloadThumbnailPictures = downloadThumbnailPictures;
exports.downloadProfilePictures = downloadProfilePictures;
exports.downloadHelmetPictures = downloadHelmetPictures;