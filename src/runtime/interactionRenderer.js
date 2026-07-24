import InteractionRegistry from "./interactions/interactionRegistry.js";

export default class InteractionRenderer {

    constructor(runtime) {

        this.runtime = runtime;
        this.registry = new InteractionRegistry();

    }

    register(type, interactionClass) {

        this.registry.register(type, interactionClass);

    }

    render(component) {

        const interaction = this.registry.create(
            component.type,
            component,
            this.runtime
        );

        return interaction.render();

    }

}