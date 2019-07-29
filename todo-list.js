class ToDoList {
  constructor(properties) {
    this.id = properties.id;
    this.title = properties.title;
    this.urgent = properties.urgent || false;
    this.taskList = properties.taskList || []
  }
  
  saveToStorage(todos) {
    localStorage.setItem('todoArray', JSON.stringify(todos))
  }

  // updateTask(toDoListId, taskId) {
  //   this.tasks

  // }


// deleteFromStorage() {

// }

// updateToDo() {

}