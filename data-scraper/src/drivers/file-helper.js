const fs = require('fs');
const config = require('../config.json');
const Driver = require('./Driver').Driver;

const driversJsonFile = process.cwd() + "/" + config.drivers["output-path"] + config.drivers.jsonOutputFile;
const driversImageOutputPath = process.cwd() + "/" + config.drivers["output-path"] + config.drivers["image-output-path"];

const saveFile = async (destFile, data) => {
    return fs.promises.writeFile(destFile, data);
};

const saveDriversAsJson = async (drivers) => {
    const json = JSON.stringify(drivers, Driver.replacer, 2);
    return fs.promises.writeFile(driversJsonFile, json);
};

const getDriversAsJson = async () => {
    return fs.promises.readFile(driversJsonFile);
};

const getDriversImages = async () => {
    const files = await fs.promises.readdir(driversImageOutputPath);
    return Promise.all(files.map(file => [file, readImage(file)]));
};

const readImage = async (fileName) => {
    return fs.promises.readFile(driversImageOutputPath + fileName);
};

const getDriverImagePath = () => {
    return driversImageOutputPath;
}

exports.saveFile = saveFile;
exports.saveDriversAsJson = saveDriversAsJson;
exports.getDriversAsJson = getDriversAsJson;
exports.getDriversImages = getDriversImages;
exports.getDriverImagePath = getDriverImagePath;
exports.readImage = readImage;