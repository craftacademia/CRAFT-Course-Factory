import RuntimePlayer from "./runtimePlayer.js";
import InteractionRenderer from "./interactionRenderer.js";

import MCQInteraction from "./interactions/mcqInteraction.js";
import MSQInteraction from "./interactions/msqInteraction.js";
import HotspotInteraction from "./interactions/hotspotInteraction.js";
import ClickToRevealInteraction from "./interactions/clickToRevealInteraction.js";
import DragDropInteraction from "./interactions/dragDropInteraction.js";
import ReflectionInteraction from "./interactions/reflectionInteraction.js";
import BranchingInteraction from "./interactions/branchingInteraction.js";
import CaseStudyInteraction from "./interactions/caseStudyInteraction.js";

export default class BrowserRuntime {

    constructor(page) {

        this.page = page;

        this.player = new RuntimePlayer(page);

        this.interactionRenderer = new InteractionRenderer(this);

        this.registerInteractions();

    }

    registerInteractions() {

        this.interactionRenderer.register("MCQ", MCQInteraction);
        this.interactionRenderer.register("MSQ", MSQInteraction);
        this.interactionRenderer.register("HOTSPOT", HotspotInteraction);
        this.interactionRenderer.register("CLICK_TO_REVEAL", ClickToRevealInteraction);
        this.interactionRenderer.register("DRAG_DROP", DragDropInteraction);
        this.interactionRenderer.register("REFLECTION", ReflectionInteraction);
        this.interactionRenderer.register("BRANCHING", BranchingInteraction);
        this.interactionRenderer.register("CASE_STUDY", CaseStudyInteraction);

    }

    play() {

        return this.player.play();

    }

    renderInteraction(component) {

        return this.interactionRenderer.render(component);

    }

    mountInteraction(component, rootElement) {

        const interaction =
            this.interactionRenderer.registry.create(
                component.type,
                component,
                this
            );

        interaction.bind(rootElement);

        return interaction;

    }

}