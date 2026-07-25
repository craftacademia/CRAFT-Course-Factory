import Interaction from "./interaction.js";

export default class MCQInteraction extends Interaction {

    constructor(component, runtime) {

        super(component, runtime);

        this.answer = null;

    }

    render() {

        return this.component.properties.options
            .map((option, index) => `
<label>
    <input
        type="radio"
        name="${this.component.id}"
        value="${index}">
    ${option}
</label><br>`)
            .join("");

    }

    bind(rootElement) {

        const inputs = rootElement.querySelectorAll(
            `input[name="${this.component.id}"]`
        );

        for (const input of inputs) {

            input.addEventListener("change", (event) => {

                this.collect(event.target.value);

            });

        }

    }

    collect(value) {

        this.answer = Number(value);

        return this.answer;

    }

    validate() {

        return this.answer !== null;

    }

    evaluate() {

        return this.answer === this.component.properties.correct;

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