export default class ScreenRenderer {
    constructor(runtime) {
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

        container.innerHTML = "";

        const screenElement = document.createElement("div");
        screenElement.className = "cf-screen";
        screenElement.dataset.screenId = screen.id || "";

        container.appendChild(screenElement);

        return screenElement;
    }
}