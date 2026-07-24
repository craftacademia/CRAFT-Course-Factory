export default class VariableStore {

    constructor(initialValues = {}) {

        this.variables = new Map(
            Object.entries(initialValues)
        );

    }

    get(name) {

        return this.variables.get(name);

    }

    set(name, value) {

        this.variables.set(name, value);

        return value;

    }

    has(name) {

        return this.variables.has(name);

    }

    delete(name) {

        return this.variables.delete(name);

    }

    clear() {

        this.variables.clear();

    }

    all() {

        return Object.fromEntries(this.variables);

    }

}