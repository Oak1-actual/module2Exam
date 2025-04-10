// Global data
let listings = [];

// Global selected filters
let locationFiltered = document.getElementById("locFiltDropDown").value;
let priceFiltered = document.getElementById("price").value;
let privacyFilteredKitchen = document.getElementById("kitchenCheckbox").checked;// false = shared
let privacyFilteredBathroom = document.getElementById("bathroomCheckbox").checked; // false = shared

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

    // attach data for filtering functionality
    listingCard.dataset.location = listing.address.city;
    listingCard.dataset.price = listing.pricePerMonth; // will store as string, convert to number later.
    listingCard.dataset.kitchen = listing.housingConditions.privateKitchen; // true/false, as string.
    listingCard.dataset.bathroom = listing.housingConditions.privateBathroom; // true/false, as string.

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
    listingCardText.textContent = `Housing type: ${listing.type}`;

    // Add price to card
    let listingCardPrice = document.createElement("p");
    listingCardPrice.textContent = `Price: ${listing.pricePerMonth},-/month`;

    // Add location to card
    let listingCardLocation = document.createElement("p");
    listingCardLocation.textContent = `Location: ${listing.address.city}`;

    // Add kitchen privacy
    let listingCardKitchen = document.createElement("p");
    if (listing.housingConditions.privateKitchen == true) {
      listingCardKitchen.textContent = `Private kitchen: Yes`
    } else {
      listingCardKitchen.textContent = `Private kitchen: No`
    }

    // Add bathroom privacy
    let listingCardBathroom = document.createElement("p");
    if (listing.housingConditions.privateBathroom == true) {
      listingCardBathroom.textContent = `Private bathroom: Yes`
    } else {
      listingCardBathroom.textContent = `Private bathroom: No`
    }

    // Append to card
    listingCardContentDiv.appendChild(listingCardTitle);
    listingCardContentDiv.appendChild(listingCardText);
    listingCardContentDiv.appendChild(listingCardPrice);
    listingCardContentDiv.appendChild(listingCardLocation);
    listingCardContentDiv.appendChild(listingCardKitchen);
    listingCardContentDiv.appendChild(listingCardBathroom);
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
  displayElement.textContent = `${slider.value},-/month`;

  // Updates when slider glides
  slider.addEventListener("input", function () {
    displayElement.textContent = `${this.value},-/month`;
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

// Renders the active filters, based on input from the sidebar.
function renderActiveFilters() {
  const activeFiltersContainer = document.getElementById("active-filters");
  activeFiltersContainer.innerHTML = "";

  // Location
  if (locationFiltered && locationFiltered !== "All locations") {
    const filterDiv = createFilterDiv(locationFiltered);
    activeFiltersContainer.appendChild(filterDiv);
  }
  // Price
  if (priceFiltered && priceFiltered != 10000) {
    const filterDiv = createFilterDiv(`${priceFiltered},-/month`);
    activeFiltersContainer.appendChild(filterDiv);
  } else if (priceFiltered == 10000) {
    const filterDiv = createFilterDiv(`All prices`);
    activeFiltersContainer.appendChild(filterDiv);
  }
  // Privacy bathroom
  if (privacyFilteredBathroom) {
    const filterDiv = createFilterDiv("private bathroom");
    activeFiltersContainer.appendChild(filterDiv);
  }
  // Privacy kitchen
  if (privacyFilteredKitchen) {
    const filterDiv = createFilterDiv("private kitchen");
    activeFiltersContainer.appendChild(filterDiv);
  }
}

// Resuable function for creating filter-div
function createFilterDiv(text) {
  const div = document.createElement("div");
  const h3 = document.createElement("h3");
  const img = document.createElement("img");

  h3.textContent = text;
  img.src = "Icons/filter cross.png";
  img.alt = "Cross icon";

  // Removes filter if cross icon is clicked.
  img.addEventListener("click", function () {
    removeActiveFilter(text); // Uses the text to identify corret div (filter).
  });

  // append content to div
  div.appendChild(h3);
  div.appendChild(img);
  return div;
}



function applyFilters() {
  const sidebarSearchButton = document.getElementById("submitBtn");

  sidebarSearchButton.addEventListener("click", function () {
    storeSelectedLocation();
    storeSelectedPrice();
    storeSelectedPrivacy();
    renderActiveFilters();
    filterListings();
    document.getElementById("active-filters").scrollIntoView({ behavior: "smooth" }); // scrolls to filters

  });
}

function removeActiveFilter(text) {
  // Checks which filter was clicked
  if (text === locationFiltered) {
    locationFiltered = "All locations";
    document.getElementById("locFiltDropDown").value = "All locations";
  } else if (text.includes(",-/month")) {
    priceFiltered = 10000;
    document.getElementById("price").value = 10000;
    displayMaxPrice(); // Updates price display in sidebar
  } else if (text === "private bathroom") {
    privacyFilteredBathroom = false;
    document.getElementById("bathroomCheckbox").checked = false;
  } else if (text === "private kitchen") {
    privacyFilteredKitchen = false;
    document.getElementById("kitchenCheckbox").checked = false;
  }

  renderActiveFilters(); // updates active filters that are displayed
  filterListings(); // updates flexbox with filtered cards
}

function filterListings() {
  const cards = document.querySelectorAll(".listing-card");

  console.log(`price filtered: ${priceFiltered}, datatype: ${typeof priceFiltered}`);

  cards.forEach(card => {
    // data for card
    const cardLocation = card.dataset.location;
    const cardPrice = Number(card.dataset.price);
    const cardKitchen = card.dataset.kitchen;
    const cardBathroom = card.dataset.bathroom;
    console.log(`cardBathroom datatype = ${typeof cardBathroom}`)
    
    let show = true;

    //location
    if (cardLocation != locationFiltered && locationFiltered != "All locations") {
      show = false;
    };
    // price 
    if (cardPrice > Number(priceFiltered)) {
      show = false;
    }
    // private kitchen
    if (cardKitchen == "false" && privacyFilteredKitchen == true) {
      show = false;
    }
    // private bathroom
    if (cardBathroom == "false" && privacyFilteredBathroom == true) {
      show = false;
    }
    // Adjust display
    if (show === false) {
      card.style.display = "none";
    } else {
      card.style.display = "flex";
    }

    console.log(`cardPrice: ${cardPrice}. priceFiltered: ${priceFiltered}. show = ${show}`)
  })
}

