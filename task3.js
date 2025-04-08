// Global data
var userData = [] // Stores user data as objects from API
var userPosts = [] // Stores user posts as an array of objects from API
var selectedOption = ""; // Stores selected option ID (user id)
var selectedName = ""; // Stores selected option name

// 1. When page loads:
window.onload = function () {
    fetchUsers(); // Fetches user data from API
    selectedUser(); // Stores data about selected user in variable
};

// Function for fetching user data from API and populating the select list by calling populateUserSelect() function.
function fetchUsers() {
    return fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json())
    .then((data) => {
        userData = data // Stores objects in global array.
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

// Function for displaying user data
function displayUserData() {
    const userDataContainer = document.getElementById("userData-container");
    userDataContainer.textContent = ""; // Reset display
    for (let i = 0; i < userData.length; i++) {
        if (userData[i].id == selectedOption) {
            // Email
            let userEmail = document.createElement("p");
            userEmail.textContent = `E-mail: ${userData[i].email}`;
            // Phone
            let userPhone = document.createElement("p");
            userPhone.textContent = `Phone: ${userData[i].phone}`;
            // Adress
            let userAdress = document.createElement("p");
            userAdress.textContent = `Address: ${userData[i].address.street}, ${userData[i].address.city}`;

            userDataContainer.appendChild(userEmail)
            userDataContainer.appendChild(userPhone)
            userDataContainer.appendChild(userAdress)
        }
    }
}



// Function for storing selected username and ID in global variables. Calls func for updating displayed user data.
function selectedUser() {
    document.getElementById("selector").addEventListener("change", function () {
        selectedOption = this.value;
        selectedName = this.options[this.selectedIndex].textContent;

        console.log("Stored user ID:", selectedOption);
        console.log("Stored user name:", selectedName);

        displayUserData(); // Updates displayed user information.
        
        fetchUserPosts(selectedOption).then(() => { // Waits for API-fetch before calling display function.
            displayUserPosts(); 
        });
        
    });
}

// Function for fetching user posts
function fetchUserPosts(userID) {
    return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userID}`)
    .then((response) => response.json())
    .then((data) => {
        userPosts = data // Stores objects in global array.
    })
}

// Function for displaying two most recent posts
function displayUserPosts() {
    const postsDisplayContainer = document.getElementById("userPosts-container");
    postsDisplayContainer.textContent = "";

    let sortedPosts = userPosts.sort((a, b) => b.id - a.id); // Sorts posts by highest ID first
    let twoLatestPosts = sortedPosts.slice(0, 2); // Takes the two most recent posts

    twoLatestPosts.forEach(post => {
        let userPostDiv = document.createElement("div");
        userPostDiv.id = `userPostDiv-${post.id}`;
        userPostDiv.className = "user-post-container"

        let userPostTitle = document.createElement("h2");
        userPostTitle.textContent = post.title;

        let userPostBody = document.createElement("p");
        userPostBody.textContent = post.body;

        userPostDiv.appendChild(userPostTitle);
        userPostDiv.appendChild(userPostBody);
        postsDisplayContainer.appendChild(userPostDiv);

        // Handling each post comment
        fetchPostComments(post.id).then(comments => { // Waits for promise to be resolved before accessing.
            let sortedComments = comments.sort((a, b) => a.id - b.id); // sorted by comment ID ascending

            // Iterates through comments, creating a div with author name and text. Appends to parent div.
            sortedComments.forEach(comment => {
                let childCommentDiv = document.createElement("div");
                childCommentDiv.className = "child-comment-div"
                // Author
                let childCommentAuthor = document.createElement("h4");
                childCommentAuthor.textContent = `Author: ${comment.name}`;
                // Text
                let childCommentBody = document.createElement("p");
                childCommentBody.textContent = comment.body;
                // Add to page
                childCommentDiv.appendChild(childCommentAuthor);
                childCommentDiv.appendChild(childCommentBody);
                userPostDiv.appendChild(childCommentDiv);
            });
        });
    });
}

// Function for fetching post comments from API
function fetchPostComments(postId) {
    return fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        .then((response) => response.json())
        .then((data) => {
            return data;
        });
}