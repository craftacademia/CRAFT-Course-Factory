import BrowserRuntime from "./browser/browserRuntime.js";
import RuntimeState from "./runtimeState.js";

export default class RuntimeOrchestrator {

    constructor(rootElement) {

        if (!rootElement) {
            throw new Error("Root element is required.");
        }

        this.runtime = new BrowserRuntime(rootElement);
        this.state = new RuntimeState();

        this.course = null;

    }

    async load(course) {

        if (!course) {
            throw new Error("Course is required.");
        }

        this.course = course;

        this.state.reset();

        await this.runtime.mount(course);

    }

    async next() {

        await this.runtime.next();

        this.state.setPage(
            this.runtime.navigation.currentIndex()
        );

    }

    async previous() {

        await this.runtime.previous();

        this.state.setPage(
            this.runtime.navigation.currentIndex()
        );

    }

    async reload() {

        await this.runtime.reload();

    }

    destroy() {

        this.runtime.destroy();

        this.state.reset();

        this.course = null;

    }

    getState() {

        return this.state;

    }

    getCurrentPage() {

        return this.runtime.navigation.current();

    }

}