const config = require('../config.json');

class Track {

    static jsonFilePath = process.cwd() + "/" + config.tracks["output-path"] + config.tracks.jsonOutputFile;
    static imagesOutputPath = process.cwd() + "/" + config.tracks["output-path"] + config.tracks["image-output-path"];

    static Image = {
        CIRCUIT: '-circuit',
        AERIAL: '-aerial'
    }
    
    static fromDownload(data) {
        const track = new Track();

        track.name = data.name;
        track.firstGrandPrix = data['first-grand-prix'];
        track.circuitLength = data['circuit-length'];
        track.numberOfLaps = data['number-of-laps'];
        track.raceDistance = data['race-distance'];
        track.lapRecord = data['lap-record'];
        track.circuitImageUrl = data.circuitImageUrl;
        track.aerialImageUrl = data.aerialImageUrl;

        return track;
    }

    getCircuitImageFileName() {
        return this.getNormalisedName() + Track.Image.CIRCUIT + this.circuitImageUrl.slice(this.circuitImageUrl.lastIndexOf('.'));
    }

    getAerialImageFileName() {
        return this.getNormalisedName() + Track.Image.AERIAL + this.aerialImageUrl.slice(this.aerialImageUrl.lastIndexOf('.'));
    }

    getNormalisedName() {
        return this.name.toLowerCase().split(' ').join('-');
    }

    /**
     * json strigify helpers
     */

    static propertiesToExclude = ['none'];

    static replacer(key, value) {
        if (Track.propertiesToExclude.includes(key))
            return undefined;

        return value;
    }
}

exports.Track = Track;