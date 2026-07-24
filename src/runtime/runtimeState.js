import VariableStore from "./variableStore.js";

export default class RuntimeState {

    constructor() {

        this.variables = new VariableStore();

        this.page = 0;
        this.score = 0;
        this.completed = false;

    }

    setPage(index) {

        this.page = index;

    }

    getPage() {

        return this.page;

    }

    addScore(points) {

        this.score += points;

        return this.score;

    }

    getScore() {

        return this.score;

    }

    complete() {

        this.completed = true;

    }

    isCompleted() {

        return this.completed;

    }

}