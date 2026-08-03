import RuntimePlayer from "../runtimePlayer.js";
import AssetLoader from "../assetLoader.js";
import NavigationEngine from "../navigationEngine.js";
import InteractionRenderer from "../interactionRenderer.js";
import RuntimeState from "../runtimeState.js";
import RenderContext from "../renderContext.js";

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

        this.currentAudio = null;

        this.isMounted = false;

        this.state = new RuntimeState();

        this.interactionRenderer =
            new InteractionRenderer(this);

        this.analytics = [];

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


        this.clear();

        this.course = course;

        this.state.reset();

        this.navigation =
            new NavigationEngine(course);


        this.isMounted = true;


        await this.renderCurrentPage();

    }



    async renderCurrentPage() {

        const page =
            this.navigation.current();


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

        this.mountBranching(page);

        await this.playDialogueSequence(page);

    }



    findDialogueAudio(voiceId) {

        if (!voiceId) {
            return null;
        }


        const audio =
            this.course?.audio?.dialogue ??
            this.course?.assets?.audio?.dialogue ??
            [];


        const normalizedVoice =
            voiceId
                .replaceAll("_", "-")
                .toUpperCase();



        return audio.find(
            item => {

                const name =
                    item.name?.toUpperCase() ?? "";


                return (
                    name.includes(normalizedVoice)
                    ||
                    name.includes(
                        normalizedVoice.replaceAll("-", "")
                    )
                );

            }
        ) ?? null;

    }



    async playDialogueSequence(page) {


        if (this.currentAudio) {

            this.currentAudio.pause();

            this.currentAudio = null;

        }


        const dialogueQueue =
            this.currentPlayer?.dialogueQueue ?? [];


        const slot =
            this.rootElement.querySelector(
                "#dialogue-slot"
            );


        if (!slot || dialogueQueue.length === 0) {

            return;

        }


        for (const component of dialogueQueue) {


            const dialogueRenderer =
                this.currentPlayer.registry.get(
                    "DIALOGUE"
                );


            const lineContext =
                new RenderContext();


            dialogueRenderer.render(
                component,
                lineContext
            );


            slot.innerHTML =
                lineContext.flush();


            const voiceId =
                component.properties?.voiceId;


            const audioAsset =
                this.findDialogueAudio(
                    voiceId
                );


            if (audioAsset) {

                await new Promise(
                    resolve => {


                        const audio =
                            new Audio(
                                `./${audioAsset.src}`
                            );


                        this.currentAudio =
                            audio;


                        audio.onended =
                            resolve;


                        audio.onerror =
                            resolve;


                        audio.play()
                        .catch(
                            resolve
                        );


                    }
                );

            } else {

                // No voice-over for this line — wait for the learner
                // to click it before advancing to the next line.
                await new Promise(
                    resolve => {

                        const handler =
                            () => {

                                slot.removeEventListener(
                                    "click",
                                    handler
                                );

                                resolve();

                            };


                        slot.addEventListener(
                            "click",
                            handler
                        );

                    }
                );

            }

        }


        slot.innerHTML = "";

    }



    mountInteractions(page) {

        for (const interaction of page.interactions ?? []) {


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



    mountBranching(page) {

        for (const layer of page.layers ?? []) {

            for (const component of layer.components ?? []) {


                if (component.type !== "BRANCHING") {
                    continue;
                }


                const element =
                    this.rootElement.querySelector(
                        `[data-component-id="${component.id}"]`
                    );


                if (!element) {
                    continue;
                }


                const renderer =
                    this.currentPlayer.registry.get(
                        "BRANCHING"
                    );


                if (
                    renderer &&
                    typeof renderer.bind === "function"
                ) {

                    renderer.bind(
                        element,
                        component,
                        this
                    );

                }

            }

        }

    }



    async next() {

        this.navigation.next();

        this.state.nextPage();

        await this.renderCurrentPage();

    }



    async previous() {

        this.navigation.previous();

        this.state.previousPage();

        await this.renderCurrentPage();

    }



    async reload() {

        await this.renderCurrentPage();

    }



    async loadAssets(page) {

        for (const layer of page.layers ?? []) {


            for (const component of layer.components ?? []) {


                if (!component.asset) {
                    continue;
                }


                if (typeof component.asset === "string") {

                    component.asset = {

                        id: component.id,

                        src: component.asset

                    };

                }


                component.asset.object =
                    await this.loader.load(
                        component.asset
                    );

            }

        }

    }



    clear() {

        this.rootElement.innerHTML = "";

        this.loader.clear();

        this.currentPlayer = null;

    }



    destroy() {

        if (this.currentAudio) {

            this.currentAudio.pause();

        }


        this.clear();

        this.navigation = null;

        this.course = null;

        this.isMounted = false;

    }



    track(event, data = {}) {

        this.analytics.push({

            event,

            data,

            timestamp: Date.now()

        });

    }



    getAnalytics() {

        return this.analytics;

    }

}
