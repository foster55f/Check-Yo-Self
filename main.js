var makeBtn = document.querySelector('#left__btn--make');
var clearBtn = document.querySelector('#left__btn--clear');
var newListForm = document.querySelector('.left__form')
var addTaskBtn = document.querySelector('.left__btn--task');
var taskItemInput = document.querySelector('.left__input--item');
var taskTitleInput = document.querySelector('#left__input--title');
var itemList = document.querySelector('#left__item');
var cardSection = document.querySelector('.section__card');
var taskEmpty = document.querySelector('.section__p--task');
var allToDoLists = [];

// EventListeners

window.addEventListener('load', initializePage);
window.addEventListener('load', taskEmptyPrompt);
makeBtn.addEventListener('click', addTaskCard);
clearBtn.addEventListener('click', clearForm);
addTaskBtn.addEventListener('click', addLeftTaskItem);
newListForm.addEventListener('click', enablePlus)
newListForm.addEventListener('keyup', enablePlus);
taskTitleInput.addEventListener('keyup', enableMakeAndClearBtns);
cardSection.addEventListener('click', deleteToDoList);
cardSection.addEventListener('click', taskChecked);
cardSection.addEventListener('click', listUrgency);
itemList.addEventListener('click', deleteItem);

// Functions

// get list Id from card that was clicked on
function getListId(event) {
  return event.target.closest('.section__card--card').getAttribute('data-id');
}

// loads page on refresh
function initializePage() {
  var todos = localStorage.getItem('todoArray');
  var allLists = JSON.parse(todos);

  allToDoLists = allLists.map(function(list){
    var tasks = list.taskList.map(function(taskProperties) {
      return new Task(taskProperties);
    });

    list.taskList = tasks;
    return new ToDoList(list);
  });
  populateCards();
}

// creates card for each to do list
function populateCards() {
  allToDoLists.forEach(function(list) {
    createCard(list);
  });
}

// creates card with UL, title, and urgency icon
function createCard(list) {
  var cardHTML =
    `<article class="section__card--card" data-id= ${list.id}>
      <h2></h2>
      <ul class= "card__item" ></ul>
      <footer class= "card__item--image">
        <div>
        <img src="images/urgent.svg" class="card__urgent">
        <p class="card__item--txt">URGENT</p>
        </div>
        <div>
        <img src="images/delete.svg" class="card__delete">
        <p class="card__item--txt">DELETE</p>
        </div>
        </footer>
    </article>`;

  cardSection.insertAdjacentHTML('afterbegin', cardHTML);
  createList(list);
  setCardTitle(list);
  setCardUrgency(list);
  taskEmptyPrompt()
}

// creates UL with LIs for each task
function createList(list) {
  list.taskList.forEach(function(task) {
    var ul = document.querySelector('.card__item');
    addTaskListItemToList(ul, task.name);

    var ulImage = ul.lastChild.getElementsByTagName('IMG')[0];
    setListItemCheckboxImage(ulImage, task);
  });
}

// adds LIs for each task to a UL, sets correct class
function addTaskListItemToList(ul, liText) {
  var plusTaskInsert =
    `<li>
      <img>
      <p></p>
    </li>`;

  ul.insertAdjacentHTML('beforeend', plusTaskInsert);
  ul.lastChild.getElementsByTagName('P')[0].innerHTML = liText;

  if(ul.id === 'left__item') {
    ul.lastChild.className = 'left__item--list';
  } else {
    ul.lastChild.className = 'card__item--list';
  }
}

// sets correct chexkbox image on LI
function setListItemCheckboxImage(img, task) {
  if(task.checked) {
    img.src = 'images/checkbox-active.svg';
  } else {
    img.src = 'images/checkbox.svg';
  }
  img.className = 'card__item--checkbox';
}

function setCardTitle(list) {
  document.querySelector('.section__card--card').getElementsByTagName('H2')[0].innerHTML = list.title;
}

// sets card urgency styling
function setCardUrgency(list) {
  if(list.urgent) {
    var urgentIcon = document.querySelector('.card__urgent');

    document.querySelector('.section__card--card').style.backgroundColor= '#FFE89D';
    urgentIcon.src = 'images/urgent-active.svg';
    urgentIcon.nextElementSibling.style.color =  '#B23A25';
  }
}

// adds new task item to left task list
function addLeftTaskItem(event) {
  event.preventDefault();
  addTaskListItemToList(itemList, taskItemInput.value);
  setListItemDeleteImage(itemList.lastChild.getElementsByTagName('IMG')[0]);
  enableMakeAndClearBtns();
  taskItemInput.value = '';
}

// sets delete image on left list items
function setListItemDeleteImage(img) {
  img.src = 'images/delete.svg';
  img.className = 'left__item-delete';
}

// adds task card to DOM
function addTaskCard(event) {
  event.preventDefault();

  var tasks = createTasks();
  var list = createToDoList(tasks);

  createCard(list);
  clearForm();
}

// clears left form
function clearForm() {
  document.querySelector('.left__form').reset();
  itemList.innerHTML = '';
}

// creates Task objects out of left task list
// you can't use map here because itemList.children is an HTMLCollection, not an array
function createTasks() {
  var tasks = [];

  for(var i = 0; i < itemList.children.length; i++) {
    var task = new Task({id: Date.now(), name: itemList.children[i].innerText});
    tasks.push(task);
  }
  return tasks;
}

// creates ToDoList object out of left task list, saves to local storage
function createToDoList(tasks) {
  var id = Date.now();
  var title = taskTitleInput.value;

  var toDoList = new ToDoList({
    id: id,
    title: title,
    taskList: tasks
  });

  allToDoLists.push(toDoList);
  ToDoList.saveToStorage(allToDoLists);

  return toDoList;
}

// enables/disables left task item button
function enablePlus() {
  addTaskBtn.disabled = taskItemInput.value === '';
}

// enables make list button and clear all button in left form
function enableMakeAndClearBtns() {
  var titleEmpty = taskTitleInput.value === '';
  var noTaskItems = itemList.children.length === 0;

  makeBtn.disabled = titleEmpty || noTaskItems;
  clearBtn.disabled = titleEmpty && noTaskItems;
}

// removes left list item from DOM
function deleteItem(event) {
  if(event.target.className === 'left__item-delete') {
    itemList.removeChild(event.target.parentNode);
  }
}

// returns false if any tasks inside of a list are unchecked, determines whether to do list can be deleted
function deleteBtnEnabled(event) {
  var list = ToDoList.findToDo(getListId(event), allToDoLists);
  var allTasksChecked = true;

  list.taskList.forEach(function(task) {
    if(!task.checked) {
      allTasksChecked = false;
    }
  })
  return allTasksChecked;
}

// removes card from DOM, deletes from local storage
function deleteToDoList(event) {
  if(!deleteBtnEnabled(event)) { return };

  if(event.target.className === 'card__delete') {
    event.target.closest('.section__card--card').remove();
    ToDoList.deleteFromStorage(getListId(event), allToDoLists);
    taskEmptyPrompt()
  }
}

// updates checkbox image, updates task.checked in localStorage
function taskChecked(event) {
  if(event.target.className === 'card__item--checkbox') {
    toggleCheckBox(event.target);

    var list = ToDoList.findToDo(getListId(event), allToDoLists);
    var taskText= event.target.closest('.card__item--list').querySelector('p').innerHTML;

    list.updateTask(taskText, allToDoLists);
  }
}

// updates checkbox styling for task
function toggleCheckBox(target) {
  if (target.src.includes('images/checkbox.svg')) {
    target.src = 'images/checkbox-active.svg';
    target.nextElementSibling.style.color =  '#3C6577';
  } else {
    target.src = 'images/checkbox.svg';
    target.nextElementSibling.style.color =  'black';
  }
}

// updates urgency styling, updates list.urgent in localStorage
function listUrgency(event) {
  if (event.target.className === 'card__urgent'){
    toggleUrgency(event.target);
    ToDoList.updateToDo(getListId(event), allToDoLists);
  }
}

// updates urgency styling for to do list card
function toggleUrgency(target) {
  var card = target.closest('.section__card--card');

  if(target.src.includes('images/urgent.svg')) {
    target.src = 'images/urgent-active.svg';
    target.nextElementSibling.style.color = '#B23A25';
    card.style.backgroundColor= '#FFE89D';
  } else {
    target.src = 'images/urgent.svg';
    target.nextElementSibling.style.color = 'black';
    card.style.backgroundColor= 'white';
  }
}

function taskEmptyPrompt() {
  if(allToDoLists.length > 0) {
    taskEmpty.style.display = 'none'
  } else {
    taskEmpty.style.display = 'block'
  }
}
  






