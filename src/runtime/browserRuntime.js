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

        this.state = {
            variables: {},
            interactions: {},
            score: 0,
            completed: false,
            currentPage: 0
        };

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

    }

    play() {

        this.track("course_started");

        return this.player.play();

    }

    renderInteraction(component) {

        return this.interactionRenderer.render(component);

    }

    mountInteraction(component, rootElement) {

        const interaction = this.interactionRenderer.registry.create(
            component.type,
            component,
            this
        );

        interaction.bind(rootElement);

        return interaction;

    }

    nextPage() {

        this.state.currentPage++;

        this.track("page_next", {
            page: this.state.currentPage
        });

        return this.state.currentPage;

    }

    previousPage() {

        if (this.state.currentPage > 0) {
            this.state.currentPage--;
        }

        this.track("page_previous", {
            page: this.state.currentPage
        });

        return this.state.currentPage;

    }

    goToPage(pageIndex) {

        this.state.currentPage = pageIndex;

        this.track("page_goto", {
            page: pageIndex
        });

        return this.state.currentPage;

    }

    getCurrentPage() {

        return this.state.currentPage;

    }

    setVariable(name, value) {

        this.state.variables[name] = value;

        this.track("variable_set", {
            name,
            value
        });

    }

    getVariable(name) {

        return this.state.variables[name];

    }

    saveInteraction(id, data) {

        this.state.interactions[id] = data;

        this.track("interaction_saved", {
            id,
            data
        });

    }

    getInteraction(id) {

        return this.state.interactions[id];

    }

    setScore(score) {

        this.state.score = score;

        this.track("score_updated", {
            score
        });

    }

    getScore() {

        return this.state.score;

    }

    completeCourse() {

        this.state.completed = true;

        this.track("course_completed");

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

    getState() {

        return this.state;

    }

    resetState() {

        this.state = {
            variables: {},
            interactions: {},
            score: 0,
            completed: false,
            currentPage: 0
        };

        this.analytics = [];

    }

}