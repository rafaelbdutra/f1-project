const config = require('../config.json');

class Team {

    static jsonFilePath = process.cwd() + "/" + config.teams["output-path"] + config.teams.jsonOutputFile;
    static imagesOutputPath = process.cwd() + "/" + config.teams["output-path"] + config.teams["image-output-path"];

    static Image = {
        SMALL_LOGO: '-small-logo',
        BIG_LOGO: '-big-logo',
        CAR: '-car'
    }
    
    static fromDownload(data) {
        const team = new Team();

        team.fullName = data['full-team-name'];
        team.name = data.name;
        team.base = data.base;
        team.teamChief = data['team-chief'];
        team.technicalChief = data['technical-chief'];
        team.chassis = data.chassis;
        team.powerUnit = data['power-unit'];
        team.firstTeamEntry = data['first-team-entry'];
        team.worldChampionships = data['world-championships'];
        team.highestRaceFinish = data['highest-race-finish'];
        team.polePositions = data['pole-positions'];
        team.fastestLaps = data['fastest-laps'];
        team.driver1 = data.driver1;
        team.driver2 = data.driver2;
        team.bigLogoUrl = data.bigLogoUrl;
        team.carImageUrl = '';
        team.smallLogoUrl = '';

        return team;
    }

    getSmallLogoImageFileName() {
        return this.getNormalisedName() + Team.Image.SMALL_LOGO + this.smallLogoUrl.slice(this.smallLogoUrl.lastIndexOf('.'));
    }

    getBigLogoImageFileName() {
        return this.getNormalisedName() + Team.Image.BIG_LOGO + this.bigLogoUrl.slice(this.bigLogoUrl.lastIndexOf('.'));
    }

    getCarImageFileName() {
        return this.getNormalisedName() + Team.Image.CAR + this.carImageUrl.slice(this.carImageUrl.lastIndexOf('.'));
    }

    getNormalisedName() {
        return this.name.toLowerCase().split(' ').join('-');
    }

    /**
     * json strigify helpers
     */

    static propertiesToExclude = ['none'];

    static replacer(key, value) {
        if (Team.propertiesToExclude.includes(key))
            return undefined;

        return value;
    }
}

exports.Team = Team;