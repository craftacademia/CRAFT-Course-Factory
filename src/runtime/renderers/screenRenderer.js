export default class ScreenRenderer {

    constructor(runtime) {

        if (!runtime) {
            throw new Error("ScreenRenderer: runtime is required.");
        }

        this.runtime = runtime;

    }

    render(screen) {

        if (!screen) {
            throw new Error("ScreenRenderer: screen is required.");
        }

        const container = this.runtime.container;

        if (!container) {
            throw new Error("ScreenRenderer: runtime container not found.");
        }

        this.beforeRender(screen);

        container.replaceChildren();

        const screenElement = document.createElement("section");
        screenElement.className = "cf-screen";
        screenElement.dataset.screenId = screen.id ?? "";
        screenElement.dataset.screenType = screen.type ?? "";

        if (screen.title) {

            const heading = document.createElement("h1");
            heading.className = "cf-screen-title";
            heading.textContent = screen.title;

            screenElement.appendChild(heading);

        }

        const content = document.createElement("div");
        content.className = "cf-screen-content";

        if (Array.isArray(screen.components)) {

            for (const component of screen.components) {

                const element = this.renderComponent(component);

                if (element) {
                    content.appendChild(element);
                }

            }

        }

        screenElement.appendChild(content);

        container.appendChild(screenElement);

        this.afterRender(screen, screenElement);

        return screenElement;

    }

    renderComponent(component) {

        if (!component) {
            return null;
        }

        const element = document.createElement("div");

        element.className = "cf-component";
        element.dataset.componentId = component.id ?? "";
        element.dataset.componentType = component.type ?? "";

        switch (component.type) {

            case "heading": {

                const heading = document.createElement("h2");
                heading.textContent = component.text ?? "";
                element.appendChild(heading);
                break;

            }

            case "text": {

                const paragraph = document.createElement("p");
                paragraph.textContent = component.text ?? "";
                element.appendChild(paragraph);
                break;

            }

            case "image": {

                const image = document.createElement("img");
                image.src = component.src ?? "";
                image.alt = component.alt ?? "";
                element.appendChild(image);
                break;

            }

            default: {

                element.textContent = component.text ?? "";

            }

        }

        return element;

    }

    beforeRender(screen) {

        if (typeof this.runtime.onBeforeRender === "function") {
            this.runtime.onBeforeRender(screen);
        }

    }

    afterRender(screen, element) {

        if (typeof this.runtime.onAfterRender === "function") {
            this.runtime.onAfterRender(screen, element);
        }

    }

}