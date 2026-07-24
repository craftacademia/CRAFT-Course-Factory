export default class ComponentRegistry {

    constructor() {

        this.registry = new Map();

    }

    register(type, handler) {

        this.registry.set(type, handler);

    }

    get(type) {

        return this.registry.get(type);

    }

    has(type) {

        return this.registry.has(type);

    }

}