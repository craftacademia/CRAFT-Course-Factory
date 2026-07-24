import RuntimePlayer from "../runtimePlayer.js";

export default class BrowserRuntime {

    constructor(rootElement) {

        if (!rootElement) {
            throw new Error("Root element is required.");
        }

        this.rootElement = rootElement;

    }

    mount(page) {

        const player = new RuntimePlayer(page);

        const html = player.play();

        this.rootElement.innerHTML = html;

        return html;

    }

    clear() {

        this.rootElement.innerHTML = "";

    }

}