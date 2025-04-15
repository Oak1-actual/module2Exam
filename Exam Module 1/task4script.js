// Global data
let listings = [];
let storedCardId = "";
const embeddedMaps = {
  "All locations":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14800157.88254064!2d-2.919178642816199!3d63.07539848433741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x461268458f4de5bf%3A0xa1b03b9db864d02b!2sNorway!5e0!3m2!1sen!2sno!4v1744707255410!5m2!1sen!2sno",
  "Bergen":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252524.79954690175!2d5.099529003450097!3d60.36511752106688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46390d4966767d77%3A0x9e42a03eb4de0a08!2sBergen!5e0!3m2!1sen!2sno!4v1744707406111!5m2!1sen!2sno",
  "Trondheim":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57099.445684021164!2d10.315431949935626!3d63.434038772974716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x466d319747037e53%3A0xbf7c8288f3cf3d4!2sTrondheim!5e0!3m2!1sen!2sno!4v1744707465169!5m2!1sen!2sno",
  "Oslo":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d128083.37577341287!2d10.62030818335675!3d59.89392431918946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46416e61f267f039%3A0x7e92605fd3231e9a!2sOslo!5e0!3m2!1sen!2sno!4v1744707519539!5m2!1sen!2sno",
  "Stavanger":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d131710.8392007914!2d5.385003419676898!3d58.94849413347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x463a3549dd29f795%3A0xad7aeb21b80a9259!2sStavanger!5e0!3m2!1sen!2sno!4v1744707577057!5m2!1sen!2sno"
}

console.log("Embedded maps: ",embeddedMaps);

// Global selected filters
let locationFiltered = document.getElementById("locFiltDropDown").value;
let priceFiltered = document.getElementById("price").value;
let privacyFilteredKitchen = document.getElementById("kitchenCheckbox").checked;// false = shared
let privacyFilteredBathroom = document.getElementById("bathroomCheckbox").checked; // false = shared

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

// Creates and displays listing cards w/API data
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
    listingCard.dataset.id = listing.id;


    // Attach event listener. Calls function to store card id in global variable for later use.
    listingCard.addEventListener("click", function() {
      storeCardId(listing.id);
      loadDetailPage();
    });

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

// Stores selected location in global variable
function storeSelectedLocation() {
  const inputElement = document.getElementById("locFiltDropDown");
  inputElement.addEventListener("change", function() {
    locationFiltered = this.value;
    console.log(`Location filtered: ${locationFiltered}`);
  })
}

// stores selected price in global variable
function storeSelectedPrice() {
  const inputElement = document.getElementById("price"); // range input
  inputElement.addEventListener("change", function() {
    priceFiltered = this.value;
    console.log(`max price: ${priceFiltered}`);
    displayMaxPrice(); // updates displayed price
  })
}

// Displays price input
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

// Stores selected privacy in global variables // Can remove this?? obselete function?
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


// Is called when search button is clicked. Filters cards in flexbox and displays active filters.
function applyFilters() {
  const sidebarSearchButton = document.getElementById("submitBtn");

  sidebarSearchButton.addEventListener("click", function () {
    storeSelectedLocation();
    storeSelectedPrice();
    storeSelectedPrivacy();
    renderActiveFilters();
    filterListings();
    updateEmbeddedMap(locationFiltered);
    document.getElementById("active-filters").scrollIntoView({ behavior: "smooth" }); // scrolls to filters
  });
}

// Is call when user crosses out active filter. Resets filter and removes display.
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
  updateEmbeddedMap(locationFiltered); // updates map location
}

// Strutures logic for filtering which cards to show in flexbox.
function filterListings() {
  const cards = document.querySelectorAll(".listing-card");

  cards.forEach(card => {
    // data for card
    const cardLocation = card.dataset.location;
    const cardPrice = Number(card.dataset.price);
    const cardKitchen = card.dataset.kitchen;
    const cardBathroom = card.dataset.bathroom;
    
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
  })
}

// Is called when card is clicked. Stores card ID in global variable for later use.
function storeCardId(divId) {
  const encodedId = encodeURIComponent(divId);
  storedCardId = encodedId;
  console.log(`this.id = ${divId}. Card ID stored in global variable = ${storedCardId}`)
}

// sends user to detail page. Card ID is stored in url.
function loadDetailPage() {
  window.location.href = `details.html?id=${storedCardId}`;
}

// Updates map in sidebar. Gets input data from global var "locationFiltered".
function updateEmbeddedMap(locationFiltered) {
  const embeddedMap = document.getElementById("embeddedMap");
  embeddedMap.src = embeddedMaps[locationFiltered];
}