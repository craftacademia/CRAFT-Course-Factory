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

        this.status = "idle";

    }

    async initialize(course) {

        await this.load(course);

    }

    async load(course) {

        if (!course) {
            throw new Error("Course is required.");
        }

        this.course = course;

        this.state.reset();

        await this.runtime.mount(course);

        this.status = "loaded";

    }

    async start() {

        if (!this.course) {
            throw new Error("No course loaded.");
        }

        this.status = "running";

        await this.runtime.reload();

    }

    async pause() {

        if (this.status === "running") {
            this.status = "paused";
        }

    }

    async resume() {

        if (this.status === "paused") {

            this.status = "running";

            await this.runtime.reload();

        }

    }

    async stop() {

        this.runtime.destroy();

        this.state.reset();

        this.status = "stopped";

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

        this.status = "destroyed";

    }

    getStatus() {

        return this.status;

    }

    getState() {

        return this.state;

    }

    getCurrentPage() {

        return this.runtime.navigation.current();

    }

}