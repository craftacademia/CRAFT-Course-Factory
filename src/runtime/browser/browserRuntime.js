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

        this.course = null;

        this.currentPlayer = null;

        this.isMounted = false;

    }

    async mount(course) {

        if (!course) {
            throw new Error("Course is required.");
        }

        if (!Array.isArray(course.layers) && !Array.isArray(course.pages)) {
            throw new Error("Invalid course.");
        }

        this.clear();

        this.course = course;

        this.navigation = new NavigationEngine(course);

        this.isMounted = true;

        await this.renderCurrentPage();

    }

    async renderCurrentPage() {

        if (!this.navigation) {
            throw new Error("Runtime has not been mounted.");
        }

        const page = this.navigation.current();

        if (!page) {
            this.rootElement.innerHTML = "";
            return;
        }

        await this.loadAssets(page);

        this.currentPlayer = new RuntimePlayer(page);

        this.rootElement.innerHTML =
            this.currentPlayer.play();

    }

    async next() {

        if (!this.navigation) {
            return;
        }

        this.navigation.next();

        await this.renderCurrentPage();

    }

    async previous() {

        if (!this.navigation) {
            return;
        }

        this.navigation.previous();

        await this.renderCurrentPage();

    }

    async reload() {

        if (!this.isMounted) {
            return;
        }

        await this.renderCurrentPage();

    }

    async loadAssets(page) {

        for (const layer of (page.layers ?? [])) {

            for (const component of (layer.components ?? [])) {

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

        this.currentPlayer = null;

    }

    destroy() {

        this.clear();

        this.navigation = null;

        this.course = null;

        this.isMounted = false;

    }

}