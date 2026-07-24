export default class Layer {

    constructor() {

        this.type = null;

        this.components = [];

    }

    addComponent(component) {

        this.components.push(component);

    }

}