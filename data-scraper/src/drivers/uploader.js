const AWS = require('aws-sdk');
const config = require('../config.json');
const fileUploader = require('./file-helper');
const Driver = require('./Driver').Driver;

const s3client = new AWS.S3({
    endpoint: config.aws.endpoint,
    s3ForcePathStyle: true,
});

const uploadDrivers = async () => {
    const drivers = await getDriversFromFileSystem();

    const profilePictureUploadPromises = drivers.map(driver => uploadDriversImages(driver.getProfilePictureFileName(), driver.profilePictureImage));
    const thumbnailPictureUploadPromises = drivers.map(driver => uploadDriversImages(driver.getThumbnailPictureFileName(), driver.thumbnailPictureImage));
    const helmetPictureUploadPromises = drivers.map(driver => uploadDriversImages(driver.getHelmetPictureFileName(), driver.helmetPictureImage));
    const dataUploadPromise = uploadDriversData(drivers);

    return Promise.all([
        profilePictureUploadPromises,
        thumbnailPictureUploadPromises,
        helmetPictureUploadPromises,
        dataUploadPromise
    ]);
};

const getDriversFromFileSystem = async () => {
    const driversJson = await fileUploader.getFile(Driver.jsonFilePath);
    const drivers = JSON.parse(driversJson).map(driver => Driver.fromJson(driver));

    await Promise.all(drivers.map(driver => driver.loadImages()));

    return drivers;
}

(async () => {
    await uploadDrivers();
})();

const uploadDriversData = async (drivers) => {
    const body = JSON.stringify(drivers, Driver.replacer, 2);

    const data = {
        Bucket: config.aws.bucket,
        Key: config.aws.drivers["json-file-path"],
        Body: body
    };

    return s3client.upload(data).promise();
};

const uploadDriversImages = async (fileName, fileData) => {
    return new AWS.S3.ManagedUpload({
        service: s3client,
        params: {
            Bucket: config.aws.bucket,
            Key: config.aws.drivers["image-path"] + fileName,
            Body: fileData,
            ACL: 'public-read'
        }
    }).promise()
    .catch(err => {
        console.log('Error uploading image: ' + err);
    })
}

exports.uploadDrivers = uploadDrivers;