const AWS = require('aws-sdk');
const config = require('../config.json');
const fs = require('fs');

const s3client = new AWS.S3({
    endpoint: 'http://localhost:4572',
    s3ForcePathStyle: true,
});

// const listBuckets = async (s3client) => {
//     return new Promise(resolve => {
//         s3client.listBuckets((err, data) => {
//             if (err) {
//                 console.error(err);
//                 throw err;
//             } else {
//                 console.log('Success: ' + data.Buckets);
//                 resolve(data);
//             }
//         });
//     });
// };

const uploadDrivers = async (driversJson, driversImages) => {
    const imageUploadPromises = driversImages.map(imageNameAndFile => uploadDriversImages(imageNameAndFile[0], imageNameAndFile[1]));
    const dataUploadPromise = uploadDriversData(driversJson);

    return Promise.all([
        imageUploadPromises,
        dataUploadPromise
    ]);
};

const uploadDriversData = async (driversJson) => {
    const data = {
        Bucket: config.aws.bucket,
        Key: config.aws.drivers["json-file-path"],
        Body: driversJson
    };

    return s3client.upload(data).promise();
};

const uploadDriversImages = async (fileName, fileData) => {
    return new AWS.S3.ManagedUpload({
        service: s3client,
        params: {
            Bucket: config.aws.bucket,
            Key: config.aws.drivers["image-path"] + fileName,
            Body: await fileData,
            ACL: 'public-read'
        }
    }).promise()
    .catch(err => {
        console.log('Error uploading image: ' + err);
    })
}

exports.uploadDrivers = uploadDrivers;