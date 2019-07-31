var makeBtn = document.querySelector('#left__btn--make')
var clearBtn = document.querySelector('#left__btn--clear')
var filterBtn = document.querySelector('#left__btn--filter')
var addTaskBtn = document.querySelector('.left__btn--task')
var taskItemInput = document.querySelector('.left__input--item')
var taskTitleInput = document.querySelector('#left__input--title')
var itemList = document.querySelector('#left__item')
var cardSection = document.querySelector('.section__card')
var taskEmpty = document.querySelector('.section__p--task')
var allToDoLists = []

// EventListeners

window.addEventListener('load', initializePage);
makeBtn.addEventListener('click', addTaskCard)
clearBtn.addEventListener('click', clearForm)
addTaskBtn.addEventListener('click', addTaskItem)
taskItemInput.addEventListener('keyup', enablePlus)
taskTitleInput.addEventListener('keyup', enableMakeAndClear)
cardSection.addEventListener('click', deleteCard);
cardSection.addEventListener('click', taskChecked);
cardSection.addEventListener('click', listUrgency);
cardSection.addEventListener('click', listUrgent);
cardSection.addEventListener('click', listUrgent);
itemList.addEventListener('click', deleteItem);

// Functions

function addTaskItem(event) {
  event.preventDefault();
  var plusTaskInsert = `<li class="left__item--list">
    <img src="images/delete.svg" class="left__item-delete">
    <p></p>    
    </li>`
    itemList.insertAdjacentHTML('beforeend', plusTaskInsert)
    document.querySelector('#left__item').lastChild.getElementsByTagName('P')[0].innerHTML  = taskItemInput.value
    enableMakeAndClear();
    taskItemInput.value = '';
  } 

function initializePage() {
  var todos = localStorage.getItem('todoArray')
  var allLists = JSON.parse(todos)

  allToDoLists = allLists.map(function(list){
    var tasks = list.taskList.map(function(taskProperties) {
      return new Task(taskProperties)
    })
    list.taskList = tasks  
    return new ToDoList(list)
  })
  populateCards()
}

function populateCards() {
  for(var i = 0; i < allToDoLists.length; i++) {
    cardSection.insertAdjacentHTML('afterbegin', `<article class="section__card--card" data-id= ${allToDoLists[i].id}><h2></h2>
      <ul class= "card__item" ></ul>
      <footer class= "card__item--image">
      <img src="images/urgent.svg" class="card__urgent">
      <p>URGENT</p>
      <img src="images/delete.svg" class="card__delete">
      <p>DELETE</p>
      </footer>
      </article>`)
    allToDoLists[i].taskList.forEach(function(task) {
      var plusTaskInsert = `<li class="card__item--list" data-id=${task.id} ><img class="card__item--checkbox"><p></p></li>`
      document.querySelector('.card__item').insertAdjacentHTML('beforeend', plusTaskInsert)

      if(task.checked) {
        document.querySelector('.card__item').lastChild.getElementsByTagName('IMG')[0].src = 'images/checkbox-active.svg'
      } else {
        document.querySelector('.card__item').lastChild.getElementsByTagName('IMG')[0].src = 'images/checkbox.svg'
      }
      document.querySelector('.card__item').lastChild.getElementsByTagName('P')[0].innerHTML = task.name
    })

      document.querySelector('.section__card--card').getElementsByTagName('H2')[0].innerHTML = allToDoLists[i].title

      if(allToDoLists[i].urgent) {
        document.querySelector('.section__card--card').style.backgroundColor= '#FFE89D';
        document.querySelector('.card__urgent').src = 'images/urgent-active.svg';
        document.querySelector('.card__urgent').nextElementSibling.style.color =  '#B23A25';
      }
  }
}


function addTaskCard(event) {
  event.preventDefault();
   

    var id = Date.now();
    var title = taskTitleInput.value;
    
    var taskList = [];
    for(var i = 0; i < itemList.children.length; i++) {
      task = new Task({id: Date.now(), name: itemList.children[i].innerText})
      taskList.push(task)
    }

    var taskList = new ToDoList({
      id: id,
      title: title,
      taskList: taskList
    })

    allToDoLists.push(taskList)


    ToDoList.saveToStorage(allToDoLists)
     cardSection.insertAdjacentHTML('afterbegin', `<article class="section__card--card" data-id=${id}><h2></h2></article>`)
    var list = itemList.cloneNode(true)

    list.className = 'card__item'
    
    for(var i=0; i < list.children.length; i++) {
      list.children[i].classList.add('new-class')
      list.children[i].classList.add('card__item--list')

      list.children[i].getElementsByTagName('IMG')[0].className = 'card__item--checkbox'
      list.children[i].getElementsByTagName('IMG')[0].src = "images/checkbox.svg"
    }
    
    document.querySelector(".section__card--card").appendChild(list)
    document.querySelector(".section__card--card").insertAdjacentHTML('beforeend', `<footer class= "card__item--image">
      <img src="images/urgent.svg" class="card__urgent">
      <p>URGENT</p>
      <img src="images/delete.svg" class="card__delete">
      <p>DELETE</p>
      </footer>`)
    document.querySelector(".section__card--card").getElementsByTagName('H2')[0].innerHTML = taskTitleInput.value
    clearForm();
    taskChecked(event);

  }

function enablePlus() {
  if(taskItemInput.value !== '') {
    addTaskBtn.disabled = false;
  } else {
    addTaskBtn.disabled = true;
  } 
}

function deleteItem(event) {
  itemList.removeChild(event.target.parentNode) 
}

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
  document.querySelector('.left__form').reset();
  itemList.innerHTML = '';
}

function deleteCard(event) {
  if(deleteBtnEnabled(event)){
    if(event.target.className === "card__delete") {
      event.target.closest(".section__card--card").remove();
      var listId = event.target.closest(".section__card--card").getAttribute('data-id')

      ToDoList.deleteFromStorage(listId, allToDoLists)
    }
  }

}

function deleteBtnEnabled(event) {
  var listId = event.target.closest(".section__card--card").getAttribute('data-id')
  var list = ToDoList.findToDo(listId, allToDoLists);

  for(var i= 0; i < list.taskList.length; i++) {
    if(!list.taskList[i].checked) {
      return false
    }
  }
  return true
}

function taskChecked(event) {
  if (event.target.className === "card__item--checkbox") {
    if (event.target.src.includes('images/checkbox.svg')) {
      event.target.src = 'images/checkbox-active.svg';
      event.target.nextElementSibling.style.color =  '#3C6577';
      // event.target.parentNode.getElementsByTagName('p')[0].style.color = 'blue'
    } 
    else {
      event.target.src = 'images/checkbox.svg'
      event.target.nextElementSibling.style.color =  'black'
    }

    var listId = event.target.closest(".section__card--card").getAttribute('data-id')

    for(var i=0;i < allToDoLists.length;i++) {
      if(listId == allToDoLists[i].id) {
          var taskText= event.target.closest(".card__item--list").querySelector('p').innerHTML
          allToDoLists[i].updateTask(taskText, allToDoLists)
      }
    }
  }
}

function listUrgent() {
  if (event.target.className === "card__urgent") {
    if (event.target.src.includes('images/urgent.svg')) {
      event.target.src = 'images/urgent-active.svg';
      event.target.nextElementSibling.style.color =  '#B23A25';
      document.querySelector('.section__card--card').style.backgroundColor= '#FFE89D';
    } 
    else {
      event.target.src = 'images/urgent.svg'
      event.target.nextElementSibling.style.color =  'black'
      document.querySelector('.section__card--card').style.backgroundColor= 'white';
    }
  }
}

function listUrgency(e) {
  if (e.target.className === "card__urgent"){
    var listId = e.target.closest(".section__card--card").getAttribute('data-id')
    ToDoList.updateToDo(listId, allToDoLists)
  }
} 

function taskEmptyPrompt() {
  if (allToDoLists.length < 1) {
    taskEmpty.classList.remove("hidden");
}
  if (allToDoLists.length > 0) {
    taskEmpty.classList.add("hidden")
  }
}
  






