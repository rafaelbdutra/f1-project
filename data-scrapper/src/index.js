const drivers = require('./drivers/drivers');
const AWS = require('aws-sdk');

(async () => {
    drivers.scrapeDrivers();
    // const ep = new AWS.Endpoint('http://localhost:4572');
    // const s3 = new AWS.S3({ endpoint: s3 });

    // s3.listBuckets(function(err, data) {
    //     if (err) {
    //       console.log("Error", err);
    //     } else {
    //       console.log("Success", data.Buckets);
    //     }
    //   });
})();
