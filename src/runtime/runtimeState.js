import VariableStore from "./variableStore.js";

export default class RuntimeState {

    constructor() {

        this.reset();

    }

    reset() {

        this.variables = new VariableStore();

        this.page = 0;
        this.score = 0;
        this.completed = false;

        this.startedAt = Date.now();
        this.updatedAt = this.startedAt;

    }

    touch() {

        this.updatedAt = Date.now();

    }

    setPage(index) {

        if (!Number.isInteger(index) || index < 0) {
            throw new Error("Invalid page index.");
        }

        this.page = index;

        this.touch();

    }

    getPage() {

        return this.page;

    }

    nextPage() {

        this.setPage(this.page + 1);

    }

    previousPage() {

        if (this.page > 0) {
            this.setPage(this.page - 1);
        }

    }

    addScore(points) {

        if (typeof points !== "number" || Number.isNaN(points)) {
            throw new Error("Score must be numeric.");
        }

        this.score += points;

        this.touch();

        return this.score;

    }

    setScore(score) {

        if (typeof score !== "number" || Number.isNaN(score)) {
            throw new Error("Score must be numeric.");
        }

        this.score = score;

        this.touch();

    }

    getScore() {

        return this.score;

    }

    complete() {

        this.completed = true;

        this.touch();

    }

    isCompleted() {

        return this.completed;

    }

    getElapsedTime() {

        return Date.now() - this.startedAt;

    }

    serialize() {

        return {
            version: 1,
            page: this.page,
            score: this.score,
            completed: this.completed,
            startedAt: this.startedAt,
            updatedAt: this.updatedAt,
            variables: this.variables
        };

    }

    restore(state) {

        if (!state || typeof state !== "object") {
            return false;
        }

        if ("version" in state && state.version !== 1) {
            throw new Error("Unsupported runtime state version.");
        }

        if (!Number.isInteger(state.page) || state.page < 0) {
            throw new Error("Invalid runtime page.");
        }

        if (typeof state.score !== "number" || Number.isNaN(state.score)) {
            throw new Error("Invalid runtime score.");
        }

        if (typeof state.completed !== "boolean") {
            throw new Error("Invalid runtime completion state.");
        }

        if (typeof state.startedAt !== "number") {
            throw new Error("Invalid runtime start time.");
        }

        if (typeof state.updatedAt !== "number") {
            throw new Error("Invalid runtime update time.");
        }

        this.page = state.page;
        this.score = state.score;
        this.completed = state.completed;
        this.startedAt = state.startedAt;
        this.updatedAt = state.updatedAt;

        if (state.variables instanceof VariableStore) {
            this.variables = state.variables;
        }

        this.touch();

        return true;

    }

    clone() {

        return structuredClone(this.serialize());

    }

}