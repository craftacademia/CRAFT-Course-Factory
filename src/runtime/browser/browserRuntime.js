import RuntimePlayer from "../runtimePlayer.js";
import AssetLoader from "../assetLoader.js";

export default class BrowserRuntime {

    constructor(rootElement) {

        if (!rootElement) {
            throw new Error("Root element is required.");
        }

        this.rootElement = rootElement;
        this.loader = new AssetLoader();

    }

    async mount(page) {

        await this.loadAssets(page);

        const player = new RuntimePlayer(page);

        const html = player.play();

        this.rootElement.innerHTML = html;

        return html;

    }

    async loadAssets(page) {

        for (const layer of page.layers ?? []) {

            for (const component of layer.components ?? []) {

                if (!component.asset) {
                    continue;
                }

                component.asset.object = await this.loader.load(component.asset);

            }

        }

    }

    clear() {

        this.rootElement.innerHTML = "";
        this.loader.clear();

    }

}