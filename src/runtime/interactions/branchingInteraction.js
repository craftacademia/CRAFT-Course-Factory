import Interaction from "./interaction.js";

export default class BranchingInteraction extends Interaction {

    constructor(component, runtime) {

        super(component, runtime);

        this.selection = null;

    }

    render() {

        return {
            prompt: this.component.properties.prompt,
            choices: this.component.properties.choices
        };

    }

    collect(choiceId) {

        this.selection = choiceId;

        return this.selection;

    }

    validate() {

        return this.selection !== null;

    }

    evaluate() {

        if (!this.validate()) {
            return null;
        }

        return this.component.properties.branches[this.selection] ?? null;

    }

    feedback() {

        return null;

    }

    complete() {

        return this.validate();

    }

}