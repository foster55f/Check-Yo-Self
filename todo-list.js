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
    for(var i=0;i < allToDoLists.length;i++) {
      if(toDoListId == allToDoLists[i].id) {
        allToDoLists.splice(i,1);
        ToDoList.saveToStorage(allToDoLists);
      }
    } 
  }

  static updateToDo(toDoListId, allToDoLists) {
    var listToUpdate = this.findToDo(toDoListId,allToDoLists)
    listToUpdate.urgent = !listToUpdate.urgent;
    listToUpdate.saveToStorage(allToDoLists)
    console.log(allToDoLists)
  }

  static findToDo(toDoListId, allToDoLists) {
    for(var i=0;i < allToDoLists.length;i++) {
      if(toDoListId == allToDoLists[i].id) {
        return allToDoLists[i]
      }
    } 
  }

}