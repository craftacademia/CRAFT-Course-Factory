import Interaction from "./interaction.js";

export default class DialogueChoiceInteraction extends Interaction {

    constructor(component, runtime) {

        super(component, runtime);

        this.selection = null;

    }


    get choices() {

        return (
            this.component.properties?.choices ??
            this.component.properties?.options ??
            []
        );

    }


    render() {

        return this.choices
            .map((choice, index) => `

<button
    data-dialogue-choice="${this.component.id}"
    data-choice-id="${index}">
    ${choice.text ?? choice}
</button>

`)
            .join("");

    }


    bind(rootElement) {

        const choices =
            rootElement.querySelectorAll(
                `[data-dialogue-choice="${this.component.id}"]`
            );


        for (const choice of choices) {

            choice.addEventListener(
                "click",
                () => {

                    this.collect(
                        choice.dataset.choiceId
                    );

                }
            );

        }

    }


    collect(choiceId) {

        this.selection =
            Number(choiceId);

        return this.selection;

    }


    validate() {

        return this.selection !== null;

    }


    evaluate() {

        if (!this.validate()) {
            return null;
        }


        const selected =
            this.choices[
                this.selection
            ];


        return selected ?? null;

    }


    feedback() {

        return (
            this.component.properties?.feedback ??
            null
        );

    }


    complete() {

        return this.validate();

    }

}