export default class Provider {

  constructor(name) {
    this.name = name;
  }

  init() {}

  validate() {}

  execute() {
    throw new Error("execute() not implemented");
  }

}
