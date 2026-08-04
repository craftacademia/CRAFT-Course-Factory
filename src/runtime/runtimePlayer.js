import ComponentRegistry from "./componentRegistry.js";
import EventScheduler from "./eventScheduler.js";
import RenderContext from "./renderContext.js";
import registerDefaultRenderers from "./registerDefaultRenderers.js";

export default class RuntimePlayer {

    constructor(page) {

        if (!page) {
            throw new Error("Page is required.");
        }

        this.page = page;

        this.registry = new ComponentRegistry();

        this.registerDefaultRenderers();

        this.scheduler = new EventScheduler(page.timeline ?? []);

        this.context = new RenderContext();

        this.componentIndex = new Map();

        this.dialogueQueue = [];

        this.branchingQueue = [];

        this.buildComponentIndex();

    }

    registerDefaultRenderers() {

        registerDefaultRenderers(this.registry);

    }

    buildComponentIndex() {

        for (const layer of (this.page.layers ?? [])) {

            for (const component of (layer.components ?? [])) {

                if (!component?.id) {
                    continue;
                }

                this.componentIndex.set(component.id, component);

            }

        }

    }

    play() {

        this.scheduler.reset();

        this.dialogueQueue = [];

        this.branchingQueue = [];

        while (this.scheduler.hasNext()) {

            const event = this.scheduler.next();

            if (!event?.componentId) {
                continue;
            }

            const component = this.componentIndex.get(event.componentId);

            if (!component) {
                continue;
            }

            // DIALOGUE lines are revealed one at a time by BrowserRuntime,
            // not rendered all at once here — collect them in order instead.
            if (component.type === "DIALOGUE") {

                this.dialogueQueue.push(component);

                continue;

            }

            // BRANCHING options should only appear once the setup dialogue
            // has finished playing, not from the moment the page loads —
            // collect them here and reveal them later, same as dialogue.
            if (component.type === "BRANCHING") {

                this.branchingQueue.push(component);

                continue;

            }

            const renderer = this.registry.get(component.type);

            if (!renderer || typeof renderer.render !== "function") {
                continue;
            }

            renderer.render(component, this.context);

        }

        // Reserve a single, stable slot for dialogue lines to be revealed into,
        // one at a time, by BrowserRuntime after this static scene is mounted.
        this.context.append(
            `<div id="dialogue-slot"></div>`
        );

        // Reserve a stable slot for the current speaker's avatar badge,
        // updated alongside each dialogue line by BrowserRuntime.
        this.context.append(
            `<div id="speaker-badge-slot"></div>`
        );

        // Reserve a stable slot for branching options, revealed only after
        // the dialogue sequence above finishes.
        this.context.append(
            `<div id="branching-slot"></div>`
        );

        return this.context.flush();

    }

    hasComponent(id) {

        return this.componentIndex.has(id);

    }

    getComponent(id) {

        return this.componentIndex.get(id) ?? null;

    }

}
