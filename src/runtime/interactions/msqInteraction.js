import Interaction from "./interaction.js";

export default class MSQInteraction extends Interaction {

    constructor(component, runtime) {

        super(component, runtime);

        this.answers = [];

    }

    render() {

        return this.component.properties.options
            .map((option, index) => `
<label>
    <input
        type="checkbox"
        name="${this.component.id}"
        value="${index}">
    ${option}
</label><br>`)
            .join("");

    }

    collect(values) {

        this.answers = values.map(Number);

        return this.answers;

    }

    validate() {

        return this.answers.length > 0;

    }

    evaluate() {

        const correct = [...this.component.properties.correct].sort((a, b) => a - b);
        const selected = [...this.answers].sort((a, b) => a - b);

        return JSON.stringify(correct) === JSON.stringify(selected);

    }

    feedback() {

        return this.evaluate()
            ? this.component.properties.correctFeedback
            : this.component.properties.incorrectFeedback;

    }

    complete() {

        return this.validate();

    }

}