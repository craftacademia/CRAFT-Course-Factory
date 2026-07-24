export default class InteractionRegistry {

    constructor() {

        this.registry = new Map();

    }

    register(type, interactionClass) {

        this.registry.set(type, interactionClass);

    }

    create(type, component, runtime) {

        const Interaction = this.registry.get(type);

        if (!Interaction) {
            throw new Error(`Unknown interaction: ${type}`);
        }

        return new Interaction(component, runtime);

    }

    has(type) {

        return this.registry.has(type);

    }

    clear() {

        this.registry.clear();

    }

}