class Task {
  constructor(properties) {
    this.id = Date.now();
    this.name = properties.name;
    this.checked = properties.checked || false;
  }

}