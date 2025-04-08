let listings = [];

function listingsFromAPI() {
  fetch("https://api.npoint.io/eb3c116538e7dcbfc7bf")
    .then(response => response.json())
    .then(data => {
      listings = data; // Stores data in global variable.
    });
}

window.onload = function () {
    listingsFromAPI();
  };