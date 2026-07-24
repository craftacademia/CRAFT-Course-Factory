import ComponentRegistry from "./componentRegistry.js";
import EventScheduler from "./eventScheduler.js";
import RenderContext from "./renderContext.js";

import NarrationRenderer from "./renderers/narrationRenderer.js";
import DialogueRenderer from "./renderers/dialogueRenderer.js";
import BackgroundRenderer from "./renderers/backgroundRenderer.js";
import CharacterRenderer from "./renderers/characterRenderer.js";

export default class RuntimePlayer {

    constructor(page) {

        this.page = page;

        this.registry = new ComponentRegistry();

        this.registry.register("NARRATION", new NarrationRenderer());
        this.registry.register("DIALOGUE", new DialogueRenderer());
        this.registry.register("BACKGROUND", new BackgroundRenderer());
        this.registry.register("CHARACTER", new CharacterRenderer());

        this.scheduler = new EventScheduler(page.timeline ?? []);
        this.context = new RenderContext();

        this.componentIndex = new Map();

        for (const layer of page.layers ?? []) {

            for (const component of layer.components ?? []) {

                this.componentIndex.set(component.id, component);

            }

        }

    }

    play() {

        this.scheduler.reset();

        while (this.scheduler.hasNext()) {

            const event = this.scheduler.next();

            const component = this.componentIndex.get(event.componentId);

            if (!component) {
                continue;
            }

            const renderer = this.registry.get(component.type);

            if (!renderer) {
                continue;
            }

            renderer.render(component, this.context);

        }

        return this.context.flush();

    }

}