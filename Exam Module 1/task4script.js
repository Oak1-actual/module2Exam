// Global data
let listings = [];

// Global selected filters
let locationFiltered = "allLocations";
let priceFiltered = "";
let privacyFiltered = false; // false = shared
const activeFilters = [locationFiltered, priceFiltered, priceFiltered];

// Load page
window.onload = function () {
  listingsFromAPI();
};

// fetch listing data, call functions.
function listingsFromAPI() {
  fetch("https://api.npoint.io/eb3c116538e7dcbfc7bf")
    .then(response => response.json())
    .then(data => {
      listings = Object.values(data.listings);; // Stores data in global variable as array.
      renderListingCards();
      populateLocationDropdown(listings);
      storeSelectedLocation();
    });
}

// Display listing cards w/API data
function renderListingCards() {
  let flexbox = document.getElementById("flexbox-w-cards");
  flexbox.innerHTML = "";

  listings.forEach(listing => {
    // create card
    let listingCard = document.createElement("div");
    listingCard.className = "listing-card";

    // create text content div container
    let listingCardContentDiv = document.createElement("div");

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
    listingCardContentDiv.appendChild(listingCardTitle);
    listingCardContentDiv.appendChild(listingCardText);
    listingCard.appendChild(listingCardImage);
    listingCard.appendChild(listingCardContentDiv);


    // Append to Flexbox
    flexbox.appendChild(listingCard);
  })
}

// Inputs listings and outputs all locations as options in <select> (sidebar location filter).
function populateLocationDropdown(listings) {
  const locationFilterDropdown = document.getElementById("locFiltDropDown");
  const locationsOptions = []

  listings.forEach(listing => {
    // Create option element
    let locationOption = document.createElement("option");
    // add value and text to option
    locationOption.value = listing.address.city;
    locationOption.textContent = listing.address.city;
    // append option to select element
    if (!locationsOptions.includes(locationOption.value)) { // Checks array does not include the value.
      locationsOptions.push(locationOption.value);
      locationFilterDropdown.appendChild(locationOption);
    }
  })
}

function storeSelectedLocation() {
  const inputElement = document.getElementById("locFiltDropDown");
  inputElement.addEventListener("change", function() {
    locationFiltered = this.value;
    console.log(locationFiltered);
  })
}