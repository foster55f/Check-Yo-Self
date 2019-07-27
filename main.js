var makeBtn = document.querySelector('#left__btn--make')
var clearBtn = document.querySelector('#left__btn--clear')
var filterBtn = document.querySelector('#left__btn--filter')
var addTaskBtn = document.querySelector('.left__btn--task')
var taskItemInput = document.querySelector('.left__input--item')
var taskTitleInput = document.querySelector('#left__input--title')
var itemList = document.querySelector('#left__item')
var cardSection = document.querySelector('.section__card')
var allToDoLists = []








// EventListeners

window.addEventListener('load', initializePage);
makeBtn.addEventListener('click', addTaskCard)
clearBtn.addEventListener('click', clearForm)
filterBtn.addEventListener('click', eventHandler)
addTaskBtn.addEventListener('click', addTaskItem)
taskItemInput.addEventListener('keyup', enablePlus)
taskTitleInput.addEventListener('keyup', enableMakeAndClear)




// Functions

function eventHandler(event){
  event.preventDefault();
}

function addTaskItem(event) {
  event.preventDefault();
  var plusTaskInsert = `<li class="left__item--list">
    <img src="images/delete.svg" class="left__item-delete">
    <p></p>    
    </li>`
    itemList.insertAdjacentHTML('beforeend', plusTaskInsert)
    document.querySelector('#left__item').lastChild.getElementsByTagName('P')[0].innerHTML  = taskItemInput.value
    addDeleteEventListeners();
    enableMakeAndClear();
  } 

function initializePage() {
  var todos = localStorage.getItem('todoArray')
  var allLists = JSON.parse(todos)

  allToDoLists = allLists.map(function(list){
    return new ToDoList(list)
  })

  populateCards()
}

function populateCards() {
  // how many cards to make
  for(var i = 0; i < allToDoLists.length; i++) {
    cardSection.insertAdjacentHTML('afterbegin', `<article class="section__card--card"><h2></h2><ul class= card__item ></ul></article>`)
    //how many list items to make for this card
    for(var i = 0; i < allToDoList.length; i++) {
      var plusTaskInsert = `<li class="card__item--list"><img src="images/delete.svg" class="card__item-delete"><p></p></li>`
      document.querySelector('.card__item').insertAdjacentHTML('beforeend', plusTaskInsert)
      itemList.insertAdjacentHTML('beforeend', plusTaskInsert)
      document.querySelector('.card__item').lastChild.getElementsByTagName('P')[0].innerHTML = allToDoLists[i]
    }
  }
}


function addTaskCard(event) {
  event.preventDefault();
    cardSection.insertAdjacentHTML('afterbegin', `<article class="section__card--card"><h2></h2></article>`)

    var id = Date.now();
    var title = taskTitleInput.value;
    
    var taskList = [];
    for(var i = 0; i < itemList.children.length; i++) {
      taskList.push(itemList.children[i].innerText)
    }

    var taskList = new ToDoList({
      id: id,
      title: title,
      taskList: taskList
    })

    allToDoLists.push(taskList)


    ToDoList.saveToStorage(allToDoLists)

    var list = itemList.cloneNode(true)
    
    for(var i=0; i < list.children.length; i++) {
      list.children[i].classList.add('new-class')
      list.children[i].getElementsByTagName('IMG')[0]
      list.children[i].getElementsByTagName('IMG')[0].src = "images/checkbox.svg"
    }
    
    document.querySelector(".section__card--card").appendChild(list)
    document.querySelector(".section__card--card").getElementsByTagName('H2')[0].innerHTML = taskTitleInput.value
    clearForm();

  }

//replace with event delegation on UL
  function addDeleteEventListeners() {
    var deleteBtns = document.getElementsByClassName('left__item-delete')
    for(i=0; i < deleteBtns.length; i++) {
      deleteBtns[i].addEventListener('click', deleteItem)
    }
  }

function enablePlus() {
  if(taskItemInput.value !== '') {
    addTaskBtn.disabled = false;
  } else {
    addTaskBtn.disabled = true;
  } 
}

function deleteItem(event) {
  console.log(event.target.parentNode)
  itemList.removeChild(event.target.parentNode) 
}

// function enableMake() {
//   if(taskTitleInput.value === ''|| itemList.children.length === 0) {
//     makeBtn.disabled = true;
//   } else {
//     makeBtn.disabled = false;
//   } 
// }

function enableMakeAndClear() {
  if(taskTitleInput.value === '' && itemList.children.length === 0) {
    makeBtn.disabled = true
    clearBtn.disabled = true
    return
  }

  if(taskTitleInput.value === '' || itemList.children.length === 0) {
    makeBtn.disabled = true
    clearBtn.disabled = false
    return
  }

  makeBtn.disabled = false
  clearBtn.disabled = false
}

function clearForm() {
document.querySelector('.left__form').reset()
  for(var i=0; i < itemList.children.length; i++) {
    itemList.removeChild(itemList.children[i]);
  }
}

