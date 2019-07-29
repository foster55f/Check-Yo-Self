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
cardSection.addEventListener('click', deleteCard);
cardSection.addEventListener('click', taskChecked);
cardSection.addEventListener('click', taskItemCheck);









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
  // how many cards to make
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
    //how many list items to make for this card
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
  }
}


function addTaskCard(event) {
  event.preventDefault();
   

    var id = Date.now();
    var title = taskTitleInput.value;
    
    var taskList = [];
    for(var i = 0; i < itemList.children.length; i++) {
      task = new Task({name: itemList.children[i].innerText})
      taskList.push(task)
    }

    var taskList = new ToDoList({
      id: id,
      title: title,
      taskList: taskList
    })

    allToDoLists.push(taskList)


    taskList.saveToStorage(allToDoLists)
     cardSection.insertAdjacentHTML('afterbegin', `<article class="section__card--card" data-id=${id}><h2></h2></article>`)
    var list = itemList.cloneNode(true)
    
    for(var i=0; i < list.children.length; i++) {
      list.children[i].classList.add('new-class')
      // list.children[i].setAttribute('data-id',)
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
  console.log(event)
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
  document.querySelector('.left__form').reset();
  itemList.innerHTML = '';

  // for(var i=0; i <= itemList.children.length; i++) {
  //   itemList.removeChild(itemList.children[i]);
  // }
}

function deleteCard(event) {
  if(event.target.className === "card__delete") {
    event.target.closest(".section__card--card").remove()
  }

}

function taskChecked(event) {
  if (event.target.src.includes('images/checkbox.svg')) {
    event.target.src = 'images/checkbox-active.svg';
    event.target.nextElementSibling.style.color =  '#3C6577';
    // event.target.parentNode.getElementsByTagName('p')[0].style.color = 'blue'
  } 
  else {
    event.target.src = 'images/checkbox.svg'
    event.target.nextElementSibling.style.color =  'black'
  }

}

// function getId(obj) {
//   return parseInt(obj.dataset.id);
// }

// /function getIndex(e) {
//   var cardIndex = e.target.closest(".section__card--card")
  // var allLists = JSON.parse(todos)
//   var taskCheckIndex = allLists.findIndex(obj => obj.id === taskCheckId)
// }



function taskItemCheck(e) {
  var taskText= e.target.closest(".card__item--list").querySelector('p').innerHTML
  for(var i=0;i < allToDoLists.length;i++) {
  if(taskText === allToDoLists[i].title) {
    
   }
  }
  
   
 
}




