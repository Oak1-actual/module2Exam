// load page
window.onload = function () {
    const urlId = getIdFromUrl();
    fetchObjectFromAPI(urlId);
  };

// Returns the housing id from url
function getIdFromUrl() {
const params = new URLSearchParams(window.location.search);
return params.get("id");
}

// Takes in url id. Fetches correct housing object from API and returns it as object, then renders HTML.
function fetchObjectFromAPI(urlId) {
    fetch(`https://api.npoint.io/eb3c116538e7dcbfc7bf/listings/${urlId}`)
      .then(response => response.json())
      .then(data => {
        renderHTMLelements(data);
        return data;
      });
  }

function renderHTMLelements(data) {
    renderTitle(data);
    renderImages(data);
    renderApartmentDetails(data);
    renderLocationDetails(data);
    renderHousingDescription(data);
    renderFacilityList(data);
    renderApprovalRatings(data);
    renderReviews(data);
}

function renderTitle(data) {
  document.getElementById("section-title").innerHTML = data.title;
}

function renderImages(data) {
  document.getElementById("details-building-image").src = data.media.images[0];
  document.getElementById("carouselImage1").src = data.media.images[1];
  document.getElementById("carouselImage2").src = data.media.images[2];
  document.getElementById("floor-plan").src = data.media.floorPlan;
}

function renderApartmentDetails(data) {
  console.log("rendering apartment details");
  const infoList = document.getElementById("item2-apartment-ul");
  // price
  const priceLi = document.createElement("li");
  priceLi.innerHTML = `${data.pricePerMonth},- /month`;
  // Square meters
  const sqmLi = document.createElement("li");
  sqmLi.innerHTML = `${data.housingConditions.sizeSqm} Sqm.`;
  // floor
  const floorLi = document.createElement("li");
  floorLi.innerHTML = `Floor: ${data.housingConditions.floor}`;
  // Private kitchen
  const kitchenLi = document.createElement("li");
  console.log("datatype: ", typeof data.privateKitchen)
  if (data.housingConditions.privateKitchen === true) {
    kitchenLi.textContent = "Private kitchen: Yes";
  } else {
    kitchenLi.textContent = "Private kitchen: No";
  }
  // Private bathroom
  const bathroomLi = document.createElement("li");
  if (data.housingConditions.privateBathroom === true) {
    bathroomLi.textContent = "Private bathroom: Yes";
  } else {
    bathroomLi.textContent = "Private bathroom: No";
  }

  // append to list
  infoList.appendChild(priceLi);
  infoList.appendChild(sqmLi);
  infoList.appendChild(floorLi);
  infoList.appendChild(kitchenLi);
  infoList.appendChild(bathroomLi);
}

function renderLocationDetails(data) {
  const locationList = document.getElementById("item3-location-ul");
  // type
  createLi(data.type,"Type");

  // City
  createLi(data.address.city,"City");

  // Distance to city centre
  createLi(data.housingConditions.distanceToCityCentre,"Km to city centre");
  // Mean neighbour age
  createLi(calculateNeighborAge(data),"Mean neighbor age");

  // creates a li element and appends it to location list
  function createLi(apiPath,text) {
    const newLiElement = document.createElement("li");
    newLiElement.textContent = `${text}: ${apiPath}`;
    locationList.appendChild(newLiElement);
    console.log("New list element: ", newLiElement);
  }

  // returns age as float
  function calculateNeighborAge(data) {
    const neighbourList = data.socialEnvironment.neighbors;
    const ages = []
    let summedAge = 0;

    neighbourList.forEach((element) => {
      ages.push(element.age);
      summedAge += element.age;
    });

    let meanAge = summedAge/ages.length;
    console.log("summary:", summedAge, "/",ages.length, "= ",meanAge)
    return meanAge.toFixed(1);
  }
}

function renderHousingDescription(data) {
  const text = document.getElementById("item4-description-text");
  let providerFormatted = data.provider.replaceAll("_", " ");
  let furnished = data.housingConditions.isFurnished;
  if (furnished) {
    furnishedMessage = "is furnished"
  } else {
    furnishedMessage = "is not furnished"
  }
  if (data.provider == "external") {
    providerFormatted = "non-student housing"
  }
  console.log(data.provider);
  text.innerHTML = `This ${providerFormatted} ${data.type} is located in ${data.address.street}, house number ${data.address.house_number} in the city of ${data.address.city}. The ${data.type} ${furnishedMessage} and will be available from ${data.availableFrom}.`
}

function renderFacilityList(data) {
  const facilityContainer = document.getElementById("item1-sidemenu");
  const housingFacilities = data.housingConditions.infrastructure;

  housingFacilities.forEach(element => {
    const newDiv = document.createElement("div");
  
    // Create Icon
    const newDivIcon = document.createElement("img");
    const icons = {
      "bike_shed": "Icons/Bicycle%20icon.png",
      "laundry": "Icons/laundry%20icon.png",
      "gym": "Icons/Gym%20Icon.png",
      "supermarket_nearby": "Icons/Cart%20Icon.png"
    };
    
    newDivIcon.src = icons[element];
  
    // Add text
    const newDivText = document.createElement("h2");
    newDivText.textContent = element.replaceAll("_", " "); // formats text
  
    // Append til div
    newDiv.appendChild(newDivIcon);
    newDiv.appendChild(newDivText);
  
    // Legg til i dokumentet (husk å bestemme hvor!)
    facilityContainer.appendChild(newDiv);
  });    
}

function alertNotAvailable() {
  alert("This is not available at the moment. You will be redirected to the comparison page.");
  loadNewPage();
}

function renderApprovalRatings(data) {
  const container = document.getElementById("rating-container-full-w");

  createRatingElement(data.socialEnvironment.scores.sociability,"Sociability");
  createRatingElement(data.socialEnvironment.scores.agreeability,"Agreeability");
  createRatingElement(data.socialEnvironment.scores.friendliness,"Friendliness");

  // creates a div with title and score, appends it to container.
  function createRatingElement(data,category) {
    const newElement = document.createElement("div");
    newElement.className = "approval-rating-container";
    // Title
    const newElementTitle = document.createElement("h3");
    newElementTitle.textContent = `${category} rating`;
    // Score
    const newElementScore = document.createElement("p");
    newElementScore.textContent = `Score: ${data}`;
    //append
    newElement.appendChild(newElementTitle);
    newElement.appendChild(newElementScore);
    container.appendChild(newElement);
  }
}

function renderReviews(data) {
  const container = document.getElementById("review-container");
  const reviews = data.reviews;

  // For hver review, lag et review-element
  reviews.forEach((review) => {
    createReview(review);
  });

  function createReview(review) {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review-content";

    // Review title
    const reviewTitle = document.createElement("h2");
    reviewTitle.textContent = "Review";

    // Author info
    const authorInfo = document.createElement("p");
    authorInfo.textContent = `Author studying: ${review.authorStudyField}, year ${review.authorYearOfStudy}.`;
    authorInfo.className="support-text";

    // Comment
    const comment = document.createElement("p");
    comment.textContent = `"${review.comment}"`;

    // Support text and year
    const supportText = document.createElement("p");
    supportText.textContent = `Published: ${review.year}`;
    supportText.className="support-text";

    // Append to review container
    reviewDiv.appendChild(reviewTitle);
    reviewDiv.appendChild(authorInfo);
    reviewDiv.appendChild(comment);
    reviewDiv.appendChild(supportText);

    // Appends review to container
    container.appendChild(reviewDiv);
  }
}

// sends user to comparison page. Card ID is stored in url.
function loadNewPage() {
  window.location.href = `comparison.html?id=${getIdFromUrl()}`;
}