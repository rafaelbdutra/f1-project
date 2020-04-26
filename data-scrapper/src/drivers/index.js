const drivers = require('./drivers');
const dataUploader = require('./data-uploader');

exports.scrapeDrivers = drivers.scrapeDrivers;
exports.getDriversAsJson = drivers.getDriversAsJson;
exports.getDriversImages = drivers.getDriversImages;
exports.uploadDrivers = dataUploader.uploadDrivers;