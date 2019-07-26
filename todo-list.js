class ToDoList {
  constructor(id, title, taskArray, urgent) {
    this.id = id;
    this.title = title;
    this.urgent = urgent || false;
    this.taskArray = taskArray || [];
  }
}

saveToStorage(array) {
  localStorage.setItem()
}

deleteFromStorage() {

}

updateToDo() {

}

updateTask() {

}