// select elements
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// global variables
let editFlag = false;
let editElement;
let editID = "";

// event listener
form.addEventListener("submit", addItem);
// **********functions************

// add item
function addItem(e) {
  e.preventDefault();
  let id = new Date().getTime().toString();
  const value = grocery.value;
  //   1- value is not empty and flag is false
  if (value !== "" && editFlag === false) {
    // create an element
    createElement(id, value);
    container.classList.add("show-container");
    // add item to local storage
    addToLocalStorage(id, value);
    displayAlert("item is added", "success");
    // set back to default
    setBacktoDefault();
    // clearItems
    clearBtn.addEventListener("click", clearItems);
  }
  //   2- value is not empty and flag is true
  else if (value !== "" && editFlag === true) {
    editElement.textContent = value;
    displayAlert("item has edited", "success");

    // edit local storage
    editLocalStorage(editID, value);
    setBacktoDefault();
  }
  //   3- value is empty
  else {
    displayAlert("Please Enter Value!", "danger");
  }
}
// delete item
function deleteItem(e) {
  const target = e.currentTarget.parentElement.parentElement;
  console.log(target);
  const id = target.dataset.id;
  console.log(id);
  list.removeChild(target);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBacktoDefault();

  // remove from local storage
  removeFromLocalStorage(id);
}
// edit item
function editItem(e) {
  const target = e.currentTarget.parentElement.parentElement;
  // select title
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // console.log(editElement);

  // set form value
  grocery.value = editElement.innerHTML;
  editID = target.dataset.id;
  editFlag = true;
  submitBtn.textContent = "edit";
}
// clearItems
function clearItems() {
  // console.log("clear btn is clicked");
  const items = list.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBacktoDefault();
  // remove from local storage
  localStorage.removeItem("list");
  // console.log(items);
}
// display alert

function displayAlert(text, type) {
  alert.textContent = `${text}`;
  alert.classList.add(`alert-${type}`);

  //   remove alert after 3 sec
  setTimeout(() => {
    alert.textContent = ``;
    alert.classList.remove(`alert-${type}`);
  }, 2000);
}

// setback to defualt
function setBacktoDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ********Lcal Storage
//   edit from local storage
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getFromLocalStorage();

  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
//   edit from local storage
function editLocalStorage(id, value) {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
      // console.log("matched");
    }
    return item;
  });
  // console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
}
//   remove from local storage
function removeFromLocalStorage(id) {
  let items = getFromLocalStorage();
  items = items.filter((item) => {
    if (item.id != id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getFromLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function createElement(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  // console.log(id);
  element.setAttributeNode(attr);
  element.innerHTML = ` <p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>`;

  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  list.appendChild(element);
  // console.log(list);
}

// ***********set items when windows loads
window.addEventListener("DOMContentLoaded", () => {
  let items = getFromLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createElement(item.id, item.value);
    });
  }
  container.classList.add("show-container");
  // clearItems
  // clearBtn.addEventListener("click", clearItems);
});
