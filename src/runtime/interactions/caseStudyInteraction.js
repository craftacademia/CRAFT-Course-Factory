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