import Interaction from "./interaction.js";

export default class ClickToRevealInteraction extends Interaction {

    constructor(component, runtime) {

        super(component, runtime);

        this.revealed = new Set();

    }

    render() {

        return {
            items: this.component.properties.items
        };

    }

    collect(itemId) {

        this.revealed.add(itemId);

        return [...this.revealed];

    }

    validate() {

        return this.revealed.size > 0;

    }

    evaluate() {

        return this.revealed.size === this.component.properties.items.length;

    }

    feedback() {

        return this.evaluate()
            ? this.component.properties.completeFeedback
            : this.component.properties.incompleteFeedback;

    }

    complete() {

        return this.evaluate();

    }

}