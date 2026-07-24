import RuntimePlayer from "../runtimePlayer.js";
import AssetLoader from "../assetLoader.js";
import NavigationEngine from "../navigationEngine.js";

export default class BrowserRuntime {

    constructor(rootElement) {

        if (!rootElement) {
            throw new Error("Root element is required.");
        }

        this.rootElement = rootElement;
        this.loader = new AssetLoader();
        this.navigation = null;

    }

    async mount(course) {

        this.navigation = new NavigationEngine(course);

        await this.renderCurrentPage();

    }

    async renderCurrentPage() {

        const page = this.navigation.current();

        await this.loadAssets(page);

        const player = new RuntimePlayer(page);

        this.rootElement.innerHTML = player.play();

    }

    async next() {

        this.navigation.next();

        await this.renderCurrentPage();

    }

    async previous() {

        this.navigation.previous();

        await this.renderCurrentPage();

    }

    async loadAssets(page) {

        for (const layer of page.layers ?? []) {

            for (const component of layer.components ?? []) {

                if (!component.asset) {
                    continue;
                }

                component.asset.object =
                    await this.loader.load(component.asset);

            }

        }

    }

    clear() {

        this.rootElement.innerHTML = "";

        this.loader.clear();

    }

}