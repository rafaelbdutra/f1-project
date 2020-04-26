const https = require('https');
const fs = require('fs');
const config = require('../config.json');

const imageOutputPath = process.cwd() + "/" + config.drivers["output-path"] + config.drivers["image-output-path"];

const downloadProfilePictures = async (drivers) => {
    await createTempDirIfNeeded();
    await Promise.all(drivers.map(driver => downloadProfilePicture(driver)));
};

const downloadProfilePicture = async (driver) => {
    const url = driver['profile-picture'];
    const fileName = driver.name.toLowerCase().split(' ').join('-');
    const fileExtension = url.slice(url.lastIndexOf('.'));

    const file = fs.createWriteStream(imageOutputPath + fileName + fileExtension);
    https.get(url, response => {
        response.pipe(file);
        file.on('finish', function () {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) {
        fs.unlink(file);
    });
};

const downloadThumbnailPictures = async (thumbnailLinks, drivers) => {
    await createTempDirIfNeeded();
    await Promise.all(thumbnailLinks.map(thumbnail => downloadThumbnailPicture(thumbnail, drivers)));
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
    const url = driver['helmet-picture'];
    const fileName = driver.name.toLowerCase().split(' ').join('-') + '-helmet';
    const fileExtension = url.slice(url.lastIndexOf('.'));

    const file = fs.createWriteStream(imageOutputPath + fileName + fileExtension);
    https.get(url, response => {
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