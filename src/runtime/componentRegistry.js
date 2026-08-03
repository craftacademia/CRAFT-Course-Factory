export default class ComponentRegistry {

    constructor() {

        this.renderers = {};

    }


    register(
        type,
        renderer
    ) {

        this.renderers[type] = renderer;

    }


    get(type) {

        return this.renderers[type] ?? null;

    }


    render(
        component
    ) {

        const renderer =
            this.get(component.type);


        if (!renderer) {

            return "";

        }


        return renderer.render(
            component
        );

    }


    mount(
        element,
        component,
        runtime
    ) {

        const renderer =
            this.get(component.type);


        if (
            renderer &&
            typeof renderer.mount === "function"
        ) {

            renderer.mount(
                element,
                component,
                runtime
            );

        }

    }

}