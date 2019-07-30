class Task {
  constructor(properties) {
    this.id = properties.id
    this.name = properties.name;
    this.checked = properties.checked || false;
  }

}