// global data
let listings = {}; // stores the listings when promise is resolved.
let housingObjectSelected = {} // stores object that is selected i dropdown.

// load page
window.onload = function () {
    listingsFromAPI();
  };

// Returns the housing id from url
function getIdFromUrl() {
const params = new URLSearchParams(window.location.search);
return params.get("id");
}

// fetch all listing data. Render elements.
function listingsFromAPI() {
    fetch("https://api.npoint.io/eb3c116538e7dcbfc7bf")
      .then(response => response.json())
      .then(data => {
        listings = data.listings;
        console.log("This is listings variable: ",listings)
        renderHTMLelements(data);
      });
}

function renderHTMLelements(data) {
    populateAllDropdowns(data);
    sortDropdown("HousingNumberCompared-left-col");
    renderComparedApartment(data,getIdFromUrl())
}

function populateAllDropdowns(data) {
  const listingsArray = Object.values(data.listings);

  populateDropdown(listingsArray, "HousingNumberCompared-left-col", "title");
  populateDropdown(listingsArray, "HousingNumberCompared-right-col", "title");
}

// Populates a dropdown menu (<select> element) with options from API. Attribute is what you want to be displayed:
function populateDropdown(listings, containerId, attribute) {
  const dropdown = document.getElementById(containerId);
  dropdown.innerHTML = ""; // resets list

  // Adds a placeholder option as default.
  const placeholder = document.createElement("option");
  placeholder.textContent = "Choose housing to compare";
  placeholder.disabled = true;
  placeholder.selected = true;
  dropdown.appendChild(placeholder);

  const addedValues = []; // stores added option values, used for duplicate check.

  listings.forEach(listing => {
    let value;

    // Gets correct value based on attribute
    if (attribute === "city") {
      value = listing.address.city;
    } else if (attribute === "title") {
      value = listing.title;
    } else {
      return; // skips unknown attributes
    }

    // Checks for duplicates
    if (!addedValues.includes(value)) {
      addedValues.push(value);

      const option = document.createElement("option");
      option.value = value;
      option.textContent = listing.address.city + ": " + value;
      option.id = listing.id
      dropdown.appendChild(option);
    }
  });
}

// Get's the id from option element, returns the housing object. Stores housing object in global var.
function handleHousingSelection(selectElementId) {
  const dropdown = document.getElementById(selectElementId);
  const selectedOption = dropdown.options[dropdown.selectedIndex];


  const housingId = selectedOption.id;
  const housingObject = listings[housingId];
  housingObjectSelected = housingObject; // stores to global variable

  console.log("selected housing-ID:", housingId);
  console.log("Housing object returned: ",housingObject)

  // render title
  const title = document.getElementById("left-col-title");
  const type = document.getElementById("left-col-type");
  title.innerHTML = housingObject.title;
  type.innerHTML = housingObject.type;

  // render image
  const image = document.getElementById("comparison-img-left");
  image.src = housingObject.media.images[0];

  // render price
  const price = document.getElementById("price-display-left-col");
  price.innerHTML = `${housingObject.pricePerMonth},-/month`

  // render square meters
  const squareMeters = document.getElementById("sqm-display-left-col");
  squareMeters.innerHTML = `${housingObject.housingConditions.sizeSqm} square meters`

  // render privacy kitchen
  const kitchenDisplay = document.getElementById("kitchen-display-left-col");
  let kitchenPrivacyBoolean = housingObject.housingConditions.privateKitchen;
  let kitchenPrivacyIcon = document.getElementById("privacyKitchen-icon-left-col");

  if (kitchenPrivacyBoolean) {
    kitchenDisplay.innerHTML = "Private kitchen";
    kitchenPrivacyIcon.src = 'Icons/person icon.png'
  } else {
    kitchenDisplay.innerHTML = "Shared kitchen";
    kitchenPrivacyIcon.src = "Icons/people icon.png";
  }

  // render privacy bathroom
  const bathroomDisplay = document.getElementById("bathroom-display-left-col");
  let bathroomPrivacyBoolean = housingObject.housingConditions.privateBathroom;
  let bathroomPrivacyIcon = document.getElementById("privacyBathroom-icon-left-col");

  if (bathroomPrivacyBoolean) {
    bathroomDisplay.innerHTML = "Private bathroom";
    bathroomPrivacyIcon.src = 'Icons/person icon.png'
  } else {
    bathroomDisplay.innerHTML = "Shared bathroom";
    bathroomPrivacyIcon.src = "Icons/people icon.png";
  }

  // render neighbours
  const neighbourContainer = document.getElementById("neighbours-list-left-col");
  neighbourContainer.textContent = ""; // reset
  const neighboursArray = housingObject.socialEnvironment.neighbors;

  neighboursArray.forEach(neighbour => {
    const newLi = document.createElement("li");
    newLi.textContent = `Age: ${neighbour.age}: ${neighbour.studyField} student, year ${neighbour.studyYear}.`
    neighbourContainer.appendChild(newLi);
  })

  // render city centre distance
  const distanceDisplay = document.getElementById("ccDistance-display-left-col");
  distanceDisplay.innerHTML = `${housingObject.housingConditions.distanceToCityCentre}km away`;

  // render facility list
  const facilityContainer = document.getElementById("facility-container-left-col")
  facilityContainer.innerHTML = "";
  const objectFacilities = housingObject.housingConditions.infrastructure;
  console.log(objectFacilities);
  // create div
  objectFacilities.forEach(facility => {
    const newDiv = document.createElement("div");
    newDiv.className = "img-text-wrapper";
    console.log(facility)
    // icon
    const icon = document.createElement("img")
    if (facility == "laundry") {
      icon.src = "Icons/laundry icon.png";
    } else if (facility == "supermarket_nearby") {
      icon.src = "Icons/Cart Icon.png"
    } else if (facility == "gym") {
      icon.src = "Icons/Gym Icon.png"
    } else if (facility == "bike_shed") {
      icon.src = "Icons/Bicycle Icon.png"
    }
    icon.alt = "icon";
    // text
    const text = document.createElement("h2");
    let formatted = facility.replace("_", " ");
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    text.textContent = formatted;
    // checkmark
    const checkmark = document.createElement("img");
    checkmark.src = "Icons/check icon.png";
    checkmark.alt = "Green Check Icon";
    // append to div, append to container
    newDiv.appendChild(icon);
    newDiv.appendChild(text);
    newDiv.appendChild(checkmark);
    facilityContainer.appendChild(newDiv);
  })

  // render ratings
  const ratingContainer = document.getElementById("rating-list-left-col");
  ratingContainer.innerHTML = ""; // reset

  // agreeability
  const agreeability = document.createElement("li");
  agreeability.textContent = `Agreeability: ${housingObject.socialEnvironment.scores.agreeability}`
  // sociability
  const sociability = document.createElement("li");
  sociability.textContent = `Sociability: ${housingObject.socialEnvironment.scores.sociability}`
  // next
  const friendliness = document.createElement("li");
  friendliness.textContent = `Friendliness: ${housingObject.socialEnvironment.scores.friendliness}`
  // append
  ratingContainer.appendChild(agreeability);
  ratingContainer.appendChild(sociability);
  ratingContainer.appendChild(friendliness);
}

function renderComparedApartment(data,urlId) {
  const selectedHousing = data.listings[urlId];
  console.log("selectedHousing = ",selectedHousing.title)
  // Hide the select element
  const selectElement = document.getElementById("HousingNumberCompared-right-col");
  selectElement.innerHTML = "";
  selectElement.style.visibility = "hidden";
  // render title
  const title = document.getElementById("title-right-col");
  title.innerHTML = selectedHousing.title;
  // render type
  const type = document.getElementById("type-right-col");
  type.innerHTML = selectedHousing.type;
  // render image
  const image = document.getElementById("comparison-img-right");
  console.log(selectedHousing);
  image.src = selectedHousing.media.images[0];
  // render price
  const price = document.getElementById("price-right-col");
  price.textContent = `${selectedHousing.pricePerMonth},-/month`;
  // render sqm
  const sqm = document.getElementById("sqm-right-col");
  sqm.innerHTML = `${selectedHousing.housingConditions.sizeSqm} square meters`;

  // render privacy kitchen
  const kitchenDisplay = document.getElementById("kitchen-display-right-col");
  let kitchenPrivacyBoolean = selectedHousing.housingConditions.privateKitchen;
  let kitchenPrivacyIcon = document.getElementById("privacyKitchen-icon-right-col");

  if (kitchenPrivacyBoolean) {
    kitchenDisplay.innerHTML = "Private kitchen";
    kitchenPrivacyIcon.src = 'Icons/person icon.png'
  } else {
    kitchenDisplay.innerHTML = "Shared kitchen";
    kitchenPrivacyIcon.src = "Icons/people icon.png";
  }

  // render privacy bathroom
  const bathroomDisplay = document.getElementById("bathroom-display-right-col");
  let bathroomPrivacyBoolean = selectedHousing.housingConditions.privateBathroom;
  let bathroomPrivacyIcon = document.getElementById("privacyBathroom-icon-right-col");

  if (bathroomPrivacyBoolean) {
    bathroomDisplay.innerHTML = "Private bathroom";
    bathroomPrivacyIcon.src = 'Icons/person icon.png'
  } else {
    bathroomDisplay.innerHTML = "Shared bathroom";
    bathroomPrivacyIcon.src = "Icons/people icon.png";
  }
  // render neighbours
  const neighbourContainer = document.getElementById("neighbours-list-right-col");
  neighbourContainer.textContent = ""; // reset
  const neighboursArray = selectedHousing.socialEnvironment.neighbors;

  neighboursArray.forEach(neighbour => {
    const newLi = document.createElement("li");
    newLi.textContent = `Age: ${neighbour.age}: ${neighbour.studyField} student, year ${neighbour.studyYear}.`
    neighbourContainer.appendChild(newLi);
  })
  // render distance to city centre
  const ccDistance = document.getElementById("ccDistance-display-right-col");
  ccDistance.textContent = `${selectedHousing.housingConditions.distanceToCityCentre}km away`

   // render facility list
   const facilityContainer = document.getElementById("facility-container-right-col")
   facilityContainer.innerHTML = "";
   const objectFacilities = selectedHousing.housingConditions.infrastructure;

   // create div
   objectFacilities.forEach(facility => {
     const newDiv = document.createElement("div");
     newDiv.className = "img-text-wrapper";
     console.log(facility)
     // icon
     const icon = document.createElement("img")
     if (facility == "laundry") {
       icon.src = "Icons/laundry icon.png";
     } else if (facility == "supermarket_nearby") {
       icon.src = "Icons/Cart Icon.png"
     } else if (facility == "gym") {
       icon.src = "Icons/Gym Icon.png"
     } else if (facility == "bike_shed") {
       icon.src = "Icons/Bicycle Icon.png"
     }
     icon.alt = "icon";
     // text
     const text = document.createElement("h2");
     let formatted = facility.replace("_", " ");
     formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
     text.textContent = formatted;
     // checkmark
     const checkmark = document.createElement("img");
     checkmark.src = "Icons/check icon.png";
     checkmark.alt = "Green Check Icon";
     // append to div, append to container
     newDiv.appendChild(icon);
     newDiv.appendChild(text);
     newDiv.appendChild(checkmark);
     facilityContainer.appendChild(newDiv);
   })

  // render ratings
  const ratingContainer = document.getElementById("rating-list-right-col");
  ratingContainer.innerHTML = ""; // reset

  // agreeability
  const agreeability = document.createElement("li");
  agreeability.textContent = `Agreeability: ${selectedHousing.socialEnvironment.scores.agreeability}`
  // sociability
  const sociability = document.createElement("li");
  sociability.textContent = `Sociability: ${selectedHousing.socialEnvironment.scores.sociability}`
  // next
  const friendliness = document.createElement("li");
  friendliness.textContent = `Friendliness: ${selectedHousing.socialEnvironment.scores.friendliness}`
  // append
  ratingContainer.appendChild(agreeability);
  ratingContainer.appendChild(sociability);
  ratingContainer.appendChild(friendliness);
}

// Sorts the dropdown list. Sorted in city:housing number.
function sortDropdown(containerId) {
  const dropdown = document.getElementById(containerId);

  // Keeps the first option as a placeholder. Stores the rest in an array for sorting.
  const firstOption = dropdown.options[0];
  const otherOptions = Array.from(dropdown.options).slice(1);

  // Sorts the options based on textContent.
  otherOptions.sort((a, b) =>
    a.textContent.localeCompare(b.textContent, 'no', { sensitivity: 'base' })
  );

  // Tømmer dropdown og legger inn igjen i riktig rekkefølge
  dropdown.innerHTML = "";
  dropdown.appendChild(firstOption);
  otherOptions.forEach(option => dropdown.appendChild(option));
}
