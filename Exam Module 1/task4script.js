// Global data
let listings = [];

// Load page
window.onload = function () {
  listingsFromAPI();
};

// fetch listing data
function listingsFromAPI() {
  fetch("https://api.npoint.io/eb3c116538e7dcbfc7bf")
    .then(response => response.json())
    .then(data => {
      listings = data; // Stores data in global variable.
      renderListingCards();
    });
}

// Display listing cards w/API data
function renderListingCards() {
  const flexbox = document.getElementById("flexbox-w-cards");
  // create card
  let listingCard = document.createElement("div");
  listingCard.id = "listing-card";
  // Add content to card
  console.log("this is listings:", listings);
}