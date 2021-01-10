const https = require('https');
const fs = require('fs');
const config = require('../config.json');

const imageOutputPath = process.cwd() + "/" + config.tracks["output-path"] + config.tracks["image-output-path"];

/**
 * Download all tracks' circuit images
 * @param {Array<Track>} tracks 
 */
const downloadCircuitImages = async (tracks) => {
    await createTempDirIfNeeded();
    await Promise.all(tracks.map(tracks => downloadCircuitImage(tracks)));
};

/**
 * Download single track's circuit image
 * @param {Track} track 
 */
const downloadCircuitImage = async (track) => {
    const file = fs.createWriteStream(imageOutputPath + track.getCircuitImageFileName());
    https.get(track.circuitImageUrl, response => {
        response.pipe(file);
        file.on('finish', function () {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) {
        fs.unlink(file);
    });
};

/**
 * Download all tracks' aerial images
 * @param {Array<Track>} tracks 
 */
const downloadAerialImages = async (tracks) => {
    await createTempDirIfNeeded();
    await Promise.all(tracks.map(track => downloadAerialImage(track)));
};

/**
 * Download single track's aerial images
 * @param {Track} track 
 */
const downloadAerialImage = async (track) => {
    const file = fs.createWriteStream(imageOutputPath + track.getAerialImageFileName());
    https.get(track.aerialImageUrl, response => {
        response.pipe(file);
        file.on('finish', function () {
            file.close();  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) {
        fs.unlink(file);
    });
};

/**
 * Create temp directory to store tracks' data if it doesn't exist
 */
const createTempDirIfNeeded = async () => {
    return fs.promises.mkdir(imageOutputPath, { recursive: true });
};

exports.downloadCircuitImages = downloadCircuitImages;
exports.downloadAerialImages = downloadAerialImages;
