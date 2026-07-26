import Interaction from "./interaction.js";

export default class CaseStudyInteraction extends Interaction {

    constructor(component, runtime) {

        super(component, runtime);

        this.currentStep = 0;
        this.responses = [];

    }

    render() {

        return {
            title: this.component.properties.title,
            description: this.component.properties.description ?? "",
            steps: this.component.properties.steps,
            currentStep: this.currentStep
        };

    }

    bind(rootElement) {

        const nextButton = rootElement.querySelector("[data-case-next]");
        const previousButton = rootElement.querySelector("[data-case-previous]");
        const responseInput = rootElement.querySelector("[data-case-response]");

        if (responseInput) {

            responseInput.addEventListener("input", (event) => {

                this.collect(event.target.value);

            });

        }

        if (nextButton) {

            nextButton.addEventListener("click", () => {

                this.next();

            });

        }

        if (previousButton) {

            previousButton.addEventListener("click", () => {

                this.previous();

            });

        }

    }

    collect(response) {

        this.responses[this.currentStep] = response;

        return this.responses;

    }

    validate() {

        return this.component.properties.steps.length > 0;

    }

    evaluate() {

        return {
            currentStep: this.currentStep,
            completed: this.currentStep >= this.component.properties.steps.length - 1,
            responses: this.responses
        };

    }

    next() {

        if (this.currentStep < this.component.properties.steps.length - 1) {
            this.currentStep++;
        }

        return this.currentStep;

    }

    previous() {

        if (this.currentStep > 0) {
            this.currentStep--;
        }

        return this.currentStep;

    }

    feedback() {

        return this.evaluate().completed
            ? (this.component.properties.completeFeedback ?? "Case Study Completed")
            : (this.component.properties.progressFeedback ?? "Continue");

    }

    complete() {

        return this.evaluate().completed;

    }

}