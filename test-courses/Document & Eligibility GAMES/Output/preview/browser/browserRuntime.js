import RuntimePlayer from "../runtimePlayer.js";
import AssetLoader from "../assetLoader.js";
import NavigationEngine from "../navigationEngine.js";
import InteractionRenderer from "../interactionRenderer.js";

import MCQInteraction from "../interactions/mcqInteraction.js";
import MSQInteraction from "../interactions/msqInteraction.js";
import HotspotInteraction from "../interactions/hotspotInteraction.js";
import ClickToRevealInteraction from "../interactions/clickToRevealInteraction.js";
import DragDropInteraction from "../interactions/dragDropInteraction.js";
import ReflectionInteraction from "../interactions/reflectionInteraction.js";
import BranchingInteraction from "../interactions/branchingInteraction.js";
import CaseStudyInteraction from "../interactions/caseStudyInteraction.js";
import DialogueChoiceInteraction from "../interactions/dialogueChoiceInteraction.js";
import SortingInteraction from "../interactions/sortingInteraction.js";


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

        this.interactionRenderer =
            new InteractionRenderer(this);

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
        this.interactionRenderer.register("DIALOGUE_CHOICE", DialogueChoiceInteraction);
        this.interactionRenderer.register("SORTING", SortingInteraction);

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

        this.currentPlayer =
            new RuntimePlayer(page);


        this.rootElement.innerHTML =
            this.currentPlayer.play();


        this.mountInteractions(page);

    }


    mountInteractions(page) {

        for (const interaction of (page.interactions ?? [])) {

            const element =
                this.rootElement.querySelector(
                    `[data-component-id="${interaction.id}"]`
                );


            if (!element) {
                continue;
            }


            const instance =
                this.interactionRenderer.registry.create(
                    interaction.type,
                    interaction,
                    this
                );


            instance.bind(element);

        }

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