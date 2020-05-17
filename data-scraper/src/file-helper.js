const fs = require('fs');

const saveFile = async (destFilePath, data) => {
    return fs.promises.writeFile(destFilePath, data);
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
