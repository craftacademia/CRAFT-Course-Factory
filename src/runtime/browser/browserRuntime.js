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

        this.isTransitioning = false;

        // Tracks whether the CURRENT page's dialogue has finished playing.
        // Back/Next stay disabled until this becomes true, in addition to
        // any interaction-specific gating (branching choice, tab read,
        // etc.) that already applies on top of it.
        this.dialogueComplete = false;

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


        await this.showStartGate();

        await this.renderCurrentPage();

    }



    async showStartGate() {

        // Browsers block audio autoplay until the learner has interacted
        // with the page at least once. This single click satisfies that
        // requirement for the entire course session — every page after
        // this one will auto-play its voice-over with no further clicks.
        await new Promise(
            resolve => {

                this.rootElement.innerHTML = `
<div
    id="start-gate"
    style="
        width:100%;
        height:100%;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#111;
    "
>
    <button
        id="start-course-btn"
        style="
            font-size:28px;
            font-weight:700;
            padding:20px 50px;
            border-radius:16px;
            border:3px solid #d71920;
            background:#ffffff;
            color:#d71920;
            cursor:pointer;
        "
    >
        Click to Begin Course
    </button>
</div>
`;

                const button =
                    this.rootElement.querySelector(
                        "#start-course-btn"
                    );

                button.addEventListener(
                    "click",
                    () => resolve(),
                    { once: true }
                );

            }
        );

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

        this.dialogueComplete = false;

        await this.playDialogueSequence(page);

        await this.playScoreBranchDialogue(page);

        this.dialogueComplete = true;

        if (typeof this.onStateChange === "function") {

            this.onStateChange();

        }


        await this.renderBranchingOptions(page);

        this.renderTabPanel(page);

        this.renderRevealPanel(page);

        this.renderDragDrop(page);

        this.renderScoreCheckpoint(page);

    }



    findDialogueAudio(voiceId) {

        if (!voiceId) {
            return null;
        }


        // A voice line can come from either upload bucket — dialogue
        // (character lines) or narration (NAR-speaker lines) — depending
        // on which field it was uploaded under. Search both, since the
        // script itself doesn't distinguish which bucket a VO_ID lives in.
        const dialogueAudio =
            this.course?.audio?.dialogue ??
            this.course?.assets?.audio?.dialogue ??
            [];


        const narrationAudio =
            this.course?.audio?.narration ??
            this.course?.assets?.audio?.narration ??
            [];


        const audio =
            [
                ...dialogueAudio,
                ...narrationAudio
            ];


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



    findSpeakerAvatar(expression) {

        if (!expression || expression === "NONE") {
            return null;
        }


        const images =
            this.course?.assets?.images ??
            this.course?.images ??
            [];


        const normalizedExpression =
            expression
                .replaceAll("_", "-")
                .toUpperCase();



        return images.find(
            item => {

                const name =
                    (item.name ?? "").toUpperCase();


                const nameWithoutExtension =
                    name.replace(
                        /\.[A-Z0-9]+$/,
                        ""
                    );


                return (
                    nameWithoutExtension === normalizedExpression
                    ||
                    name.includes(normalizedExpression)
                );

            }
        ) ?? null;

    }



    renderSpeakerBadge(component) {

        const badgeSlot =
            this.rootElement.querySelector(
                "#speaker-badge-slot"
            );


        if (!badgeSlot) {
            return;
        }


        const speaker =
            component.properties?.speaker ?? "";


        if (speaker.toUpperCase() === "NAR") {

            badgeSlot.innerHTML = `
<div class="speaker-badge">
    <div class="speaker-avatar">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#d71920" stroke-width="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
    </div>
    <span class="speaker-name">Narrator</span>
</div>
`;

            return;

        }


        const expression =
            component.properties?.expression;


        const avatar =
            this.findSpeakerAvatar(expression);


        if (avatar) {

            badgeSlot.innerHTML = `
<div class="speaker-badge">
    <div class="speaker-avatar">
        <img src="./${avatar.src}" alt="">
    </div>
    <span class="speaker-name">${speaker}</span>
</div>
`;

        } else {

            badgeSlot.innerHTML = "";

        }

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


            this.renderSpeakerBadge(
                component
            );


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


                        // Lets an interrupting click (see
                        // branchingRenderer.js selectOption) directly
                        // and synchronously unblock this wait, instead
                        // of relying on the async 'pause' event, whose
                        // timing isn't guaranteed relative to whatever
                        // the click handler does next.
                        this.currentAudioResolve =
                            resolve;


                        audio.onended =
                            resolve;


                        audio.onerror =
                            resolve;


                        // .pause() does NOT fire 'ended' — without this,
                        // interrupting audio (e.g. by clicking a branching
                        // option mid-playback) leaves this promise pending
                        // forever, permanently freezing navigation.
                        audio.onpause =
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


        const badgeSlot =
            this.rootElement.querySelector(
                "#speaker-badge-slot"
            );

        if (badgeSlot) {

            badgeSlot.innerHTML = "";

        }

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



    async renderBranchingOptions(page) {

        const branchingQueue =
            this.currentPlayer?.branchingQueue ?? [];


        if (branchingQueue.length === 0) {

            return;

        }


        const slot =
            this.rootElement.querySelector(
                "#branching-slot"
            );


        if (!slot) {

            return;

        }


        const branchingRenderer =
            this.currentPlayer.registry.get(
                "BRANCHING"
            );


        if (!branchingRenderer) {

            return;

        }


        // Cleared by the click handler in branchingRenderer.js the
        // moment the learner picks an option, so option voice-over
        // playback stops immediately instead of continuing underneath
        // the next page.
        this.branchingChoicePending = true;


        for (const component of branchingQueue) {


            const lineContext =
                new RenderContext();


            branchingRenderer.render(
                component,
                lineContext
            );


            slot.innerHTML =
                lineContext.flush();


            // MCQ uses its own 3-step renderer.
            // instant and hotspot use branchingRenderer as before.
            // MCQ_RENDERER_ROUTED
            const componentStyle = component.properties?.style ?? "instant";

            if (componentStyle === "mcq") {

                const mcqRenderer = this.currentPlayer.registry.get("MCQ");

                if (mcqRenderer && typeof mcqRenderer.bind === "function") {

                    await mcqRenderer.bind(slot, component, this);

                    continue;

                }

            }

            if (typeof branchingRenderer.bind === "function") {

                branchingRenderer.bind(
                    slot,
                    component,
                    this
                );

            }


            for (const option of component.properties?.options ?? []) {


                if (!this.branchingChoicePending) {

                    break;

                }


                const audioAsset =
                    this.findDialogueAudio(
                        option.voiceId
                    );


                if (!audioAsset) {

                    continue;

                }


                await new Promise(
                    resolve => {


                        const audio =
                            new Audio(
                                `./${audioAsset.src}`
                            );


                        this.currentAudio =
                            audio;


                        // Lets an interrupting click (see
                        // branchingRenderer.js selectOption) directly
                        // and synchronously unblock this wait, instead
                        // of relying on the async 'pause' event, whose
                        // timing isn't guaranteed relative to whatever
                        // the click handler does next.
                        this.currentAudioResolve =
                            resolve;


                        audio.onended =
                            resolve;


                        audio.onerror =
                            resolve;


                        // Same reasoning as playDialogueSequence above —
                        // .pause() must also resolve this promise, or
                        // clicking an option mid-VO freezes navigation.
                        audio.onpause =
                            resolve;


                        audio.play()
                        .catch(
                            resolve
                        );


                    }
                );

            }


            // Only make the options clickable once every option's own
            // voice-over has actually finished — this removes the
            // possibility of interrupting mid-VO entirely, rather than
            // trying to handle that interruption cleanly.
            const wrapper =
                slot.querySelector(
                    `[data-component-id="${component.id}"]`
                );

            if (wrapper) {

                wrapper.classList.remove(
                    "branch-options--locked"
                );

            }

        }

    }



    renderTabPanel(page) {

        const tabPanelQueue =
            this.currentPlayer?.tabPanelQueue ?? [];


        if (tabPanelQueue.length === 0) {

            return;

        }


        const slot =
            this.rootElement.querySelector(
                "#tab-panel-slot"
            );


        if (!slot) {

            return;

        }


        const tabPanelRenderer =
            this.currentPlayer.registry.get(
                "TAB_PANEL"
            );


        if (!tabPanelRenderer) {

            return;

        }


        for (const component of tabPanelQueue) {


            const lineContext =
                new RenderContext();


            tabPanelRenderer.render(
                component,
                lineContext
            );


            slot.innerHTML +=
                lineContext.flush();


            if (typeof tabPanelRenderer.bind === "function") {

                tabPanelRenderer.bind(
                    slot,
                    component,
                    this
                );

            }

        }

    }



    renderRevealPanel(page) {

        const revealPanelQueue =
            this.currentPlayer?.revealPanelQueue ?? [];


        if (revealPanelQueue.length === 0) {

            return;

        }


        const slot =
            this.rootElement.querySelector(
                "#reveal-panel-slot"
            );


        if (!slot) {

            return;

        }


        const revealPanelRenderer =
            this.currentPlayer.registry.get(
                "REVEAL_PANEL"
            );


        if (!revealPanelRenderer) {

            return;

        }


        for (const component of revealPanelQueue) {


            const lineContext =
                new RenderContext();


            revealPanelRenderer.render(
                component,
                lineContext
            );


            slot.innerHTML +=
                lineContext.flush();


            if (typeof revealPanelRenderer.bind === "function") {

                revealPanelRenderer.bind(
                    slot,
                    component,
                    this
                );

            }

        }

    }



    renderDragDrop(page) {

        const dragDropQueue =
            this.currentPlayer?.dragDropQueue ?? [];


        if (dragDropQueue.length === 0) {

            return;

        }


        const slot =
            this.rootElement.querySelector(
                "#dragdrop-slot"
            );


        if (!slot) {

            return;

        }


        const dragDropRenderer =
            this.currentPlayer.registry.get(
                "DRAG_DROP"
            );


        if (!dragDropRenderer) {

            return;

        }


        for (const component of dragDropQueue) {


            const lineContext =
                new RenderContext();


            dragDropRenderer.render(
                component,
                lineContext
            );


            slot.innerHTML +=
                lineContext.flush();


            if (typeof dragDropRenderer.bind === "function") {

                dragDropRenderer.bind(
                    slot,
                    component,
                    this
                );

            }

        }

    }



    renderScoreCheckpoint(page) {

        const scoreCheckpointQueue =
            this.currentPlayer?.scoreCheckpointQueue ?? [];


        if (scoreCheckpointQueue.length === 0) {

            return;

        }


        const slot =
            this.rootElement.querySelector(
                "#score-checkpoint-slot"
            );


        if (!slot) {

            return;

        }


        const scoreCheckpointRenderer =
            this.currentPlayer.registry.get(
                "SCORE_CHECKPOINT"
            );


        if (!scoreCheckpointRenderer) {

            return;

        }


        for (const component of scoreCheckpointQueue) {


            const lineContext =
                new RenderContext();


            scoreCheckpointRenderer.render(
                component,
                lineContext
            );


            slot.innerHTML +=
                lineContext.flush();


            if (typeof scoreCheckpointRenderer.bind === "function") {

                scoreCheckpointRenderer.bind(
                    slot,
                    component,
                    this
                );

            }

        }

    }



    async playScoreBranchDialogue(page) {

        const scoreBranch =
            page.scoreBranch;


        if (!scoreBranch || !scoreBranch.cases?.length) {

            return;

        }


        const currentTotal =
            typeof this.computeTotalScore === "function"
            ? this.computeTotalScore()
            : 0;


        // Same rolling baseline used for SCORE_CHECKPOINT — this
        // module's score-so-far is however much the total has grown
        // since the last checkpoint (0 if none has happened yet).
        const baseline =
            this.state.variables.get(
                "scoreCheckpointBaseline"
            ) ?? 0;


        const moduleScoreSoFar =
            currentTotal - baseline;


        const matchingCase =
            scoreBranch.cases.find(
                scoreCase =>
                moduleScoreSoFar >= scoreCase.min &&
                moduleScoreSoFar <= scoreCase.max
            );


        if (!matchingCase) {

            return;

        }


        const slot =
            this.rootElement.querySelector(
                "#dialogue-slot"
            );


        if (!slot) {

            return;

        }


        const dialogueRenderer =
            this.currentPlayer?.registry.get(
                "DIALOGUE"
            );


        if (!dialogueRenderer) {

            return;

        }


        for (const line of matchingCase.lines) {


            const lineComponent = {

                properties:{

                    text:
                    line.text,

                    speaker:
                    line.speaker,

                    voiceId:
                    line.voiceId,

                    expression:
                    line.expression

                }

            };


            const lineContext =
                new RenderContext();


            dialogueRenderer.render(
                lineComponent,
                lineContext
            );


            slot.innerHTML =
                lineContext.flush();


            this.renderSpeakerBadge(
                lineComponent
            );


            const audioAsset =
                this.findDialogueAudio(
                    line.voiceId
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


                        // Lets an interrupting click (see
                        // branchingRenderer.js selectOption) directly
                        // and synchronously unblock this wait, instead
                        // of relying on the async 'pause' event, whose
                        // timing isn't guaranteed relative to whatever
                        // the click handler does next.
                        this.currentAudioResolve =
                            resolve;


                        audio.onended =
                            resolve;

                        audio.onerror =
                            resolve;

                        audio.onpause =
                            resolve;


                        audio.play()
                        .catch(
                            resolve
                        );


                    }
                );

            } else {

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


        const badgeSlot =
            this.rootElement.querySelector(
                "#speaker-badge-slot"
            );

        if (badgeSlot) {

            badgeSlot.innerHTML = "";

        }

    }



    async next() {

        if (this.isTransitioning) {
            return;
        }


        this.isTransitioning = true;


        try {

            // A page reached via a branching PATH carries a nextOverride —
            // the screen that should follow it, so all paths correctly
            // rejoin the main course sequence regardless of where they
            // sit in the underlying page array.
            const currentPage =
                this.navigation.current();


            if (currentPage?.nextOverride) {

                this.navigation.goToPage(
                    currentPage.nextOverride
                );

            } else {

                this.navigation.next();

            }


            this.state.nextPage();

            await this.renderCurrentPage();

        } finally {

            this.isTransitioning = false;

        }

    }



    async navigate(pageId) {

        if (this.isTransitioning) {
            return;
        }


        this.isTransitioning = true;


        try {

            this.navigation.goToPage(
                pageId
            );

            await this.renderCurrentPage();

        } finally {

            this.isTransitioning = false;

        }

    }



    async previous() {

        if (this.isTransitioning) {
            return;
        }


        this.isTransitioning = true;


        try {

            this.navigation.previous();

            this.state.previousPage();

            await this.renderCurrentPage();

        } finally {

            this.isTransitioning = false;

        }

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
