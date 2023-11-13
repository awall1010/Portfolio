const playerSearchForm = document.getElementById("player-search-form");
const playerNameInput = document.getElementById("player-name");
const autocompleteDropdown = document.getElementById("autocomplete-dropdown");
const searchResults = document.getElementById("player-details");

let playerData; // To store the parsed CSV data

// Parse the CSV data using PapaParse
Papa.parse("players_players-statistics_get-players-statistics-for-current-seasons.csv", {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (result) => {
        playerData = result.data;
    },
});

playerSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const playerName = playerNameInput.value.trim();

    if (playerName === "") {
        searchResults.innerHTML = '<p>Please enter a player name.</p>';
        return;
    }

    const filteredPlayers = searchPlayersByName(playerName);

    if (filteredPlayers.length === 0) {
        searchResults.innerHTML = '<p>No players found.</p>';
    } else {
        searchResults.innerHTML = generatePlayerDetails(filteredPlayers[0]);
    }
});

playerNameInput.addEventListener("input", () => {
    const inputText = playerNameInput.value.trim().toLowerCase();
    const matchedPlayers = playerData.filter((player) => {
        const fullName = `${player["Firstname"]} ${player["Lastname"]}`.toLowerCase();
        return fullName.includes(inputText);
    });

    displayAutocompleteDropdown(matchedPlayers);
});

// Function to search players by name
function searchPlayersByName(playerName) {
    const searchName = playerName.toLowerCase();
    return playerData.filter((player) => {
        const fullName = `${player["Firstname"]} ${player["Lastname"]}`.toLowerCase();
        return fullName.includes(searchName);
    });
}

// Function to display autocomplete suggestions
function displayAutocompleteDropdown(players) {
    if (players.length === 0) {
        autocompleteDropdown.style.display = "none";
        return;
    }

    const suggestions = players
        .map((player) => `${player["Firstname"]} ${player["Lastname"]}`)
        .join("</div><div>");

    autocompleteDropdown.innerHTML = `<div>${suggestions}</div>`;
    autocompleteDropdown.style.display = "block";

    autocompleteDropdown.querySelectorAll("div").forEach((div) => {
        div.addEventListener("click", (e) => {
            playerNameInput.value = e.target.textContent;
            autocompleteDropdown.style.display = "none";
        });
    });
}

// Function to generate player details
function generatePlayerDetails(player) {
    const details = `
        <p><strong>Name:</strong> ${player["Firstname"]} ${player["Lastname"]}</p>
        <p><strong>Team:</strong> ${player["Team"]}</p>
        <p><strong>Goals Scored:</strong> ${player["Goals Scored"]}</p>
        <!-- Add more player details as needed -->
    `;
    return details;
}

// Add event listener for the "Show All Players" button
const showAllPlayersButton = document.getElementById("show-all-players-button");
showAllPlayersButton.addEventListener("click", () => {
    displayAllPlayerNames();
});

// Function to display all player names
function displayAllPlayerNames() {
    const playerList = document.getElementById("player-list");
    playerList.innerHTML = ""; // Clear the existing list

    playerData.forEach((player) => {
        const fullName = `${player["Firstname"]} ${player["Lastname"]}`;
        const listItem = document.createElement("li");
        listItem.textContent = fullName;
        playerList.appendChild(listItem);
    });
}
