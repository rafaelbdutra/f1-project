const drivers = require('./drivers');

(async () => {
    await drivers.scrapeDrivers();
    await drivers.uploadDrivers();
})();
