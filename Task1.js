let tasks = []; // A variable that stores an array of tasks that is added.

document.getElementById("addBtn").addEventListener("click", addTask); // Adds eventlistener to the add task button. Activates on "click" and runs the addTask function.
document.getElementById("filterBtn").addEventListener("click", filterTasks); // Adds eventlistener to the filtering button. Activates on "click" and runs the filterTasks function.
document.getElementById("clearFilterBtn").addEventListener("click", resetFilter); // Adds eventlistener to the filter reset button. Activates on "click" and runs the resetFilter function.

// Function that takes in an id as argument and returns the correspodning value from the HTML-element. trim() removes whitespace before and after the string text.
function getInputValue(id) {
  return document.getElementById(id).value.trim();
}

// Function that takes in the description and category as arguments and creates an object variable. Returns the object variable.
function createTask(description, category) {
  taskObj = {description, category};
  return taskObj;
}

// Function for adding a task to the tasks array.
// Calls the renderTasks() and clearInputs() function to show the added task in HTML and to reset the input field.
function addTask() {
  const description = getInputValue("taskInput"); // Gets the value from the input type = "text", wich will be the task description.
  const category = getInputValue("categorySelect"); // Gets the value from the selected option in the dropdown menu (select), which will be the selected task category.

  if (description.length < 2) return alert("Task too short"); // Returns an alert if the description input was shorter than 2 characters.

  const newTask = createTask(description, category); // Runs the createTask function and stores the returned value (a task object) in the variable "newTask".
  tasks.push(newTask); // Adds the new task object to the tasks array.
  renderTasks(tasks); // runs the renderTasks function with the tasks array as argument. Will create sepparate li-elements with the task objects in the array.
  clearInputs(); // Runs the clearInputs function to clear the input field (sets value to "").
}

// Function for rendering the tasks array objects as sepparate li-elements.
function renderTasks(list) {
  const ul = document.getElementById("taskList"); // Gets the empty ul-element from HTML trough id.
  ul.innerHTML = ""; // Resets the list to avoid duplicates.
  list.forEach(task => { // Iterates trough every list element.
    const li = document.createElement("li"); // Creates a li element in HTML.
    li.textContent = '[' + task.category + '] ' + task.description; // adds content to the li-element., which is the category in [] followed by the task description.
    ul.appendChild(li); // Apppends the li-element to the ul-list in the HTML file.
  });
}

// Function for resetting the task descripton input field.
function clearInputs() {
  document.getElementById("taskInput").value = ""; // sets value to "".
}

// Function that filters tasks based on category.
function filterTasks() {
  const cat = getInputValue("categorySelect"); // gets the value of the selected option.
  let results = []; // Creates an array that will store filtered tasks.

  for (let i = 0; i < tasks.length; i++) { // Loop that will iterate as many times as the number of elements in the taks array.
    if (tasks[i].category === cat) { // Condition for execution. If the indexed array element has the same category as the the selected category (dropdown option) the code will run.
      results.push(tasks[i]); // Adds the indexed element to the results array (The task category matched the filter category).
    }
  }

  console.log("Filtering tasks for category:", cat); // Shows the category in the console.
  console.log("Found:", results.length); // Shows the number of elements in the filtered results array in the console.

  const ul = document.getElementById("taskList"); // Gets the ul-list in HTML file.
  ul.innerHTML = ""; // Sets inner content to "", resetting the list.

  for (let i = 0; i < results.length; i++) { // Loop that iterates as many times at the number of elements in the results array.
    const li = document.createElement("li"); // Creates a li-element in the HTML-file.
    li.textContent = '[' +results[i].category + '] ' + results[i].description; // Adds content to the li-element, which is the category of the indexed element in [] and the decription of the indexed element.
    ul.appendChild(li); // appends the li-element to the ul-list as child.
  }

  for (let i = 0; i < results.length; i++) { // loop that iterates as many times as the number of elements in the results array.
    if (results[i].description.includes("test")) { // Condition for executing following code. Executes if the indexed element has a description that includes the string "test".
      console.log("Task contains 'test':", results[i].description); // Displays "task contains 'test': and the indexed elements description in the console.
    }
  }

  const countInfo = document.createElement("li"); // Creates a li-element in the HTML file.
  countInfo.textContent = 'Total in ' + cat + ': ' + results.length; // Adds content to the li-element, which is the number of tasks with the filters category.
  countInfo.style.fontWeight = "bold"; // Changes the text style of the li-element to be bold.
  ul.appendChild(countInfo); // Appends the li-element (number of filtered tasks) to the ul-element as child.
}

// Function for resetting the filter
function resetFilter(){
    renderTasks(tasks); // Runs the function which adds all tasks elements to the ul as li-elements, not filtering out any categories.
}

/* 
- The functions are split into distinct tasks, avoiding complex function that serves multiple purposes.
- Functions with spesific and contained purposes makes it easier to reuse them throughout the program for several other purposes.
- This makes it easier to maintain and change individual functions later on, reducing the risk of introducing bugs.
- Splitting the code into distinct functions increases readability.
*/