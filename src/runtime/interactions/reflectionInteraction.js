import Interaction from "./interaction.js";

export default class ReflectionInteraction extends Interaction {

    constructor(component, runtime) {

        super(component, runtime);

        this.response = "";

    }

    render() {

        return {
            prompt: this.component.properties.prompt,
            placeholder: this.component.properties.placeholder ?? ""
        };

    }

    bind(rootElement) {

        const input = rootElement.querySelector(
            `[data-reflection="${this.component.id}"]`
        );

        if (!input) {
            return;
        }

        input.addEventListener("input", (event) => {

            this.collect(event.target.value);

        });

    }

    collect(text) {

        this.response = String(text).trim();

        return this.response;

    }

    validate() {

        return this.response.length > 0;

    }

    evaluate() {

        return {
            completed: this.validate(),
            response: this.response
        };

    }

    feedback() {

        return this.validate()
            ? (this.component.properties.feedback ?? "Response recorded.")
            : (this.component.properties.requiredFeedback ?? "Please enter your response.");

    }

    complete() {

        return this.validate();

    }

}