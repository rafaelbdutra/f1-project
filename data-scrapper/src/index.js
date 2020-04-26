const drivers = require('./drivers');

(async () => {
    // drivers.scrapeDrivers();
    const driversJson = await drivers.getDriversAsJson();
    const driversImages = await drivers.getDriversImages();

    await drivers.uploadDrivers(driversJson, driversImages);
})();
