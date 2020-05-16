

class Team {
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
}

exports.Team = Team;