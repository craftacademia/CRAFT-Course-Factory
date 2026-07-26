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

        while (this.scheduler.hasNext()) {

            const event = this.scheduler.next();

            if (!event?.componentId) {
                continue;
            }

            const component = this.componentIndex.get(event.componentId);

            if (!component) {
                continue;
            }

            const renderer = this.registry.get(component.type);

            if (!renderer || typeof renderer.render !== "function") {
                continue;
            }

            renderer.render(component, this.context);

        }

        return this.context.flush();

    }

    hasComponent(id) {

        return this.componentIndex.has(id);

    }

    getComponent(id) {

        return this.componentIndex.get(id) ?? null;

    }

}