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

    addScore(points) {

        if (typeof points !== "number") {
            throw new Error("Score must be numeric.");
        }

        this.score += points;

        this.touch();

        return this.score;

    }

    setScore(score) {

        if (typeof score !== "number") {
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
            page: this.page,
            score: this.score,
            completed: this.completed,
            startedAt: this.startedAt,
            updatedAt: this.updatedAt,
            variables: this.variables
        };

    }

}