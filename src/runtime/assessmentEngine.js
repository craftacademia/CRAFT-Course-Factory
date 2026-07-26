export default class AssessmentEngine {

    constructor(runtimeState, interactionEngine, eventBus) {

        if (!runtimeState) {
            throw new Error("RuntimeState is required.");
        }

        if (!interactionEngine) {
            throw new Error("InteractionEngine is required.");
        }

        if (!eventBus) {
            throw new Error("EventBus is required.");
        }

        this.runtimeState = runtimeState;
        this.interactionEngine = interactionEngine;
        this.eventBus = eventBus;

        this.results = [];
        this.attempts = new Map();

        this.beforeSubmitHooks = [];
        this.afterSubmitHooks = [];

    }

    beforeSubmit(handler) {

        if (typeof handler !== "function") {
            throw new Error("Handler must be a function.");
        }

        this.beforeSubmitHooks.push(handler);

    }

    afterSubmit(handler) {

        if (typeof handler !== "function") {
            throw new Error("Handler must be a function.");
        }

        this.afterSubmitHooks.push(handler);

    }

    submit(question) {

        if (!question) {
            throw new Error("Question is required.");
        }

        for (const hook of this.beforeSubmitHooks) {
            hook(question, this.runtimeState);
        }

        const id = question.id ?? "__default__";

        const attempt = (this.attempts.get(id) ?? 0) + 1;

        this.attempts.set(id, attempt);

        const correct = question.selected === question.correct;

        const result = {
            id,
            attempt,
            correct,
            selected: question.selected,
            expected: question.correct,
            points: Number(question.points ?? 0),
            timestamp: Date.now()
        };

        if (correct && result.points > 0) {

            this.interactionEngine.execute({
                type: "ADD_SCORE",
                points: result.points
            });

        }

        this.results.push(result);

        this.eventBus.emit(
            correct
                ? "assessment.correct"
                : "assessment.incorrect",
            result
        );

        this.eventBus.emit("assessment.submitted", result);

        for (const hook of this.afterSubmitHooks) {
            hook(result, this.runtimeState);
        }

        return {
            correct,
            score: this.runtimeState.getScore(),
            attempt,
            result
        };

    }

    getAttemptCount(questionId) {

        return this.attempts.get(questionId) ?? 0;

    }

    getResults() {

        return [...this.results];

    }

    reset() {

        this.results = [];
        this.attempts.clear();
        this.beforeSubmitHooks = [];
        this.afterSubmitHooks = [];

    }

}