class ToDoList {
  constructor(properties) {
    this.id = properties.id;
    this.title = properties.title;
    this.urgent = properties.urgent || false;
    this.taskList = properties.taskList || []
  }

  updateTask(taskText, allToDoLists) {
   this.taskList.forEach(function(task) {
      if(taskText === task.name) {
        task.checked = !task.checked
        ToDoList.saveToStorage(allToDoLists)
      }
    })
  }

  static saveToStorage(allToDoLists) {
    localStorage.setItem('todoArray', JSON.stringify(allToDoLists))
  }

  static deleteFromStorage(toDoListId, allToDoLists) {
    allToDoLists.forEach(function(list, index) {
      if(toDoListId == list.id) {
        allToDoLists.splice(index,1);
        ToDoList.saveToStorage(allToDoLists);
      }
    })
  }

  static updateToDo(toDoListId, allToDoLists) {
    var listToUpdate = this.findToDo(toDoListId,allToDoLists)
    listToUpdate.urgent = !listToUpdate.urgent;
    ToDoList.saveToStorage(allToDoLists)
  }

  static findToDo(toDoListId, allToDoLists) {
    var targetList;

    allToDoLists.forEach(function(list) {
      if(toDoListId == list.id) {
        targetList = list
      }
    })
    return targetList
  }
}