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

    bind(rootElement) {

        const inputs = rootElement.querySelectorAll(
            `input[name="${this.component.id}"]`
        );

        for (const input of inputs) {

            input.addEventListener("change", () => {

                const values = [];

                for (const checkbox of inputs) {

                    if (checkbox.checked) {
                        values.push(Number(checkbox.value));
                    }

                }

                this.collect(values);

            });

        }

    }

    collect(values) {

        this.answers = [...values].sort((a, b) => a - b);

        return this.answers;

    }

    validate() {

        return this.answers.length > 0;

    }

    evaluate() {

        const correct = [...this.component.properties.correct]
            .sort((a, b) => a - b);

        if (correct.length !== this.answers.length) {
            return false;
        }

        return correct.every((value, index) => value === this.answers[index]);

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