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
  listings.forEach(listing => {
    const flexbox = document.getElementById("flexbox-w-cards");
    // create card
    let listingCard = document.createElement("div");
    listingCard.id = "listing-card";
    // Add Title to card
    let listingCardTitle = document.createElement("h3");
    listingCardTitle.textContent = listing.title;
    // Add Image to card
    let listingCardImage = document.createElement("img");
    listingCardImage.src = listing.media.images[0];
    // Add Text to card
    let listingCardText = document.createElement("p");
    listingCardText.textContent = `housing type: ${listing.type}`;
    // Append to card
    listingCard.appendChild(listingCardImage);
    listingCard.appendChild(listingCardTitle);
    listingCard.appendChild(listingCardText);
    // Append to Flexbox
    flexbox.appendChild(listingCard);
  })
}