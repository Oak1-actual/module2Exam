// Global data
let listings = [];

// Global selected filters
let locationFiltered = document.getElementById("locFiltDropDown").value;
let priceFiltered = document.getElementById("price").value;
let privacyFilteredKitchen = false; // false = shared
let privacyFilteredBathroom = false; // false = shared

const activeFilters = [locationFiltered, priceFiltered, priceFiltered, privacyFilteredBathroom, privacyFilteredKitchen];

// Load page
window.onload = function () {
  listingsFromAPI();
  displayMaxPrice();
  applyFilters();
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
      storeSelectedPrice();
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
    console.log(`Location filtered: ${locationFiltered}`);
  })
}

function storeSelectedPrice() {
  const inputElement = document.getElementById("price"); // range input
  inputElement.addEventListener("change", function() {
    priceFiltered = this.value;
    console.log(`max price: ${priceFiltered}`);
    displayMaxPrice(); // updates displayed price
  })
}

function displayMaxPrice() {
  const slider = document.getElementById("price"); // range input
  const displayElement = document.getElementById("priceLabel"); // label/h2

  // displays default slider value
  displayElement.textContent = `${slider.value} kr /month`;

  // Updates when slider glides
  slider.addEventListener("input", function () {
    displayElement.textContent = `${this.value} kr /month`;
  });
}

function storeSelectedPrivacy() {
  const kitchenPrivacyCheckbox = document.getElementById("kitchenCheckbox");
  const bathroomPrivacyCheckbox = document.getElementById("bathroomCheckbox");

  privacyFilteredKitchen = kitchenPrivacyCheckbox.checked;
  privacyFilteredBathroom = bathroomPrivacyCheckbox.checked;

  console.log("kitchen private?", privacyFilteredKitchen);
  console.log("Bathroom private?", privacyFilteredBathroom);
}

// adds event listeners to privacy checkboxes.
document.getElementById("kitchenCheckbox").addEventListener("change", storeSelectedPrivacy);
document.getElementById("bathroomCheckbox").addEventListener("change", storeSelectedPrivacy);

function renderActiveFilters() {
  const activeFiltersContainer = document.getElementById("active-filters");
  activeFiltersContainer.innerHTML = "";

  const activeFilters = [locationFiltered, priceFiltered, privacyFilteredBathroom, privacyFilteredKitchen];
  activeFilters.forEach(filter => {
    // create div
    let activeFilterDiv = document.createElement("div");
    // Create h3
    let activeFilterText = document.createElement("h3");
    if (filter === locationFiltered) { // Location
      activeFilterText.textContent = locationFiltered;
    } else if ( filter === priceFiltered) { // Price
      activeFilterText.textContent = `${priceFiltered},-/month`
    } else if (filter === privacyFilteredBathroom && privacyFilteredBathroom == true) { // Privacy Bathroom
      activeFilterText.textContent = `private bathroom`
    } else if (filter === privacyFilteredKitchen && privacyFilteredKitchen == true) { // Privacy Kitchen
      activeFilterText.textContent = `private kitchen`
    }
    // create img (cross icon)
    let activeFilterIcon = document.createElement("img");
    activeFilterIcon.src = "Icons/filter cross.png";
    activeFilterIcon.alt = "Cross icon";
    // append to div => container, if privacy is selected and location is selected.
    if (activeFilterText.textContent.trim() !== "" && activeFilterText.textContent.trim() !== "All locations") {
      activeFilterDiv.appendChild(activeFilterText);
      activeFilterDiv.appendChild(activeFilterIcon);
      activeFiltersContainer.appendChild(activeFilterDiv);
    }
  })
}

function applyFilters() {
  const sidebarSearchButton = document.getElementById("submitBtn");

  sidebarSearchButton.addEventListener("click", function () {
    storeSelectedLocation();
    storeSelectedPrice();
    storeSelectedPrivacy();
    renderActiveFilters();
    console.log("Search button clicked!");
  });
}
