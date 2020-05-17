const fs = require('fs');

const saveFile = async (destFile, data) => {
    return fs.promises.writeFile(destFile, data);
};

const getFile = async (filePath) => {
    return fs.promises.readFile(filePath);
};

const readImage = async (filePath) => {
    return fs.promises.readFile(filePath);
};

exports.saveFile = saveFile;
exports.getFile = getFile;
exports.readImage = readImage;
