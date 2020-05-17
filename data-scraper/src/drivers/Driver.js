const fileHelper = require('./file-helper');
const config = require('../config.json');

class Driver {

    static jsonFilePath = process.cwd() + "/" + config.drivers["output-path"] + config.drivers.jsonOutputFile;
    static imageOutputPath = process.cwd() + "/" + config.drivers["output-path"] + config.drivers["image-output-path"];

    static Picture = {
        MAIN: '-main',
        HELMET: '-helmet',
        THUMBNAIL: '-thumbnail',
        FLAG: '-flag'
    }

    static fromDownload(data) {
        const driver = new Driver();

        driver.fullName = data.name;
        driver.firstName = driver.fullName.split(' ')[0];
        driver.lastName = driver.fullName.split(' ')[1];
        driver.number = data.number;
        driver.flag = data.flag;
        driver.team = data.team;
        driver.country = data.country;
        driver.podiums = data.podiums;
        driver.points = data.points;
        driver.grandsPrixEntered = data['grands-prix-entered'];
        driver.worldChampionships = data['world-championships'];
        driver.highestRaceFinish = data['highest-race-finish'];
        driver.highestGridPosition = data['highest-grid-position'];
        driver.dateOfBirth = data['date-of-birth'];
        driver.placeOfBirth = data['place-of-birth'];
        driver.profilePicture = data['profile-picture'];
        driver.helmetPicture = data['helmet-picture'];
        driver.thumbnailPicture = '';

        return driver;
    }

    static fromJson(json) {
        const driver = new Driver();

        driver.fullName = json.fullName;
        driver.firstName = json.firstName;
        driver.lastName = json.lastName;
        driver.number = json.number;
        driver.flag = json.flag;
        driver.team = json.team;
        driver.country = json.country;
        driver.podiums = json.podiums;
        driver.points = json.points;
        driver.grandsPrixEntered = json.grandsPrixEntered;
        driver.worldChampionships = json.worldChampionships;
        driver.highestRaceFinish = json.highestRaceFinish;
        driver.highestGridPosition = json.highestGridPosition;
        driver.dateOfBirth = json.dateOfBirth;
        driver.placeOfBirth = json.placeOfBirth;
        driver.profilePicture = json.profilePicture;
        driver.helmetPicture = json.helmetPicture;
        driver.thumbnailPicture = json.thumbnailPicture;

        driver.localProfilePicture = Driver.imageOutputPath + driver.getProfilePictureFileName();
        driver.localThumbnailPicture = Driver.imageOutputPath + driver.getThumbnailPictureFileName();
        driver.localHelmetPicture = Driver.imageOutputPath + driver.getHelmetPictureFileName();
        driver.localFlagImage = Driver.imageOutputPath + driver.getFlagImageFileName();

        return driver;
    }

    toJson() {
        return JSON.stringify(this, Driver.replacer, 2);
    }

    getProfilePictureFileName() {
        return this.getNormalisedName() + Driver.Picture.MAIN + this.profilePicture.slice(this.profilePicture.lastIndexOf('.'));
    }

    getThumbnailPictureFileName() {
        return this.getNormalisedName() + Driver.Picture.THUMBNAIL + this.thumbnailPicture.slice(this.thumbnailPicture.lastIndexOf('.'));
    }

    getHelmetPictureFileName() {
        return this.getNormalisedName() + Driver.Picture.HELMET + this.helmetPicture.slice(this.helmetPicture.lastIndexOf('.'));
    }

    getFlagImageFileName() {
        return this.getNormalisedName() + Driver.Picture.FLAG + this.flag.slice(this.flag.lastIndexOf('.'));
    }

    getNormalisedName() {
        return this.fullName.toLowerCase().split(' ').join('-');
    }

    async loadImages() {
        this.profilePictureImage = await fileHelper.readImage(Driver.imageOutputPath + this.getProfilePictureFileName());
        this.thumbnailPictureImage = await fileHelper.readImage(Driver.imageOutputPath + this.getThumbnailPictureFileName());
        this.helmetPictureImage = await fileHelper.readImage(Driver.imageOutputPath + this.getHelmetPictureFileName());
        this.flagImage = await fileHelper.readImage(Driver.imageOutputPath + this.getFlagImageFileName());
    }

    /**
     * json strigify helpers
     */

    static propertiesToExclude = ['profilePictureImage', 'thumbnailPictureImage', 'helmetPictureImage'
            , 'localProfilePicture', 'localThumbnailPicture', 'localHelmetPicture'];

    static replacer(key, value) {
        if (Driver.propertiesToExclude.includes(key))
            return undefined;

        return value;
    }

};

exports.Driver = Driver;