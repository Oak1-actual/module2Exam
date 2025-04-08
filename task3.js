// Global data
var userData = [] // Stores user data as objects from API

// 1. When page loads:
window.onload = function () {
    fetchUsers();
};

// Function for fetching user data from API and populating the select list by calling populateUserSelect() function.
function fetchUsers() {
    return fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((data) => {
        userData = data
        populateUserSelect()
    });
}

// Function for creating select options with usernames from API
function populateUserSelect() {
    const selectElement = document.getElementById("selector");
    for (let i = 0; i < userData.length; i++) {
        let newOption = document.createElement("option");
        newOption.value = userData[i].id; // Attaches hidden user ID to select option.
        newOption.textContent = userData[i].name; // Name that user sees.
        selectElement.appendChild(newOption);
    }
}

function handleUserSelection(userId) {
    // Hent info om valgt bruker
    // Hent brukerens innlegg og vis de 2 nyeste
    // For hvert innlegg, hent og vis kommentarer
}
