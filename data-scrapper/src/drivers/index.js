const scraper = require('./scraper');
const uploader = require('./uploader');

exports.scrapeDrivers = scraper.scrapeDrivers;
exports.uploadDrivers = uploader.uploadDrivers;