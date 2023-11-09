let teamsData = [];

document.addEventListener('DOMContentLoaded', function() {
    Papa.parse('stats.csv', {
        download: true,
        header: true,
        complete: function(results) {
            teamsData = results.data;
            initSeasonSelect(teamsData);
        },
        error: function(err) {
            console.error('Error while parsing:', err);
        }
    });
});

function initSeasonSelect(teamsData) {
    const seasonSelectElement = document.getElementById('season-select');
    let seasons = [...new Set(teamsData.map(data => data.season))].sort();
    seasons.forEach(season => {
        let option = document.createElement('option');
        option.value = season;
        option.textContent = season;
        seasonSelectElement.appendChild(option);
    });

    // Trigger change to update team select dropdown based on the first season
    seasonSelectElement.dispatchEvent(new Event('change'));
}

function updateTeamSelect(teamsData, selectedSeason) {
    const teamSelectElement = document.getElementById('team-select');
    teamSelectElement.innerHTML = '';  // Clear the team select

    let seasonTeams = teamsData.filter(data => data.season === selectedSeason);
    let teams = [...new Set(seasonTeams.map(data => data.team))].sort();
    teams.forEach(team => {
        let option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamSelectElement.appendChild(option);
    });

    // Manually trigger change to display stats for the first team in the selected season
    if (teams.length > 0) {
        teamSelectElement.value = teams[0];
        displayTeamStats(selectedSeason, teams[0]);
    }
}

function displayTeamStats(selectedSeason, selectedTeam) {
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = '';  // Clear existing stats

    let teamData = teamsData.find(data => data.season === selectedSeason && data.team === selectedTeam);
    if (teamData) { // Check if teamData is found
        Object.keys(teamData).forEach(stat => {
            if (stat !== 'team' && stat !== 'season') {  // Exclude the team and season from stats
                let statElement = document.createElement('p');
                statElement.textContent = `${stat}: ${teamData[stat]}`;
                statsContainer.appendChild(statElement);
            }
        });
    }
}

document.getElementById('season-select').addEventListener('change', function(event) {
    let selectedSeason = event.target.value;
    updateTeamSelect(teamsData, selectedSeason);
});

document.getElementById('team-select').addEventListener('change', function(event) {
    let selectedSeason = document.getElementById('season-select').value;
    let selectedTeam = event.target.value;
    displayTeamStats(selectedSeason, selectedTeam);
});
