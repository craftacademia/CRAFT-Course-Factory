export default class Interaction {

    constructor(component, runtime) {

        this.component = component;
        this.runtime = runtime;

    }

    render() {

        throw new Error("render() not implemented.");

    }

    bind(rootElement) {

        throw new Error("bind() not implemented.");

    }

    collect() {

        return null;

    }

    validate() {

        return true;

    }

    evaluate() {

        return null;

    }

    feedback() {

        return null;

    }

    complete() {

        return true;

    }

}