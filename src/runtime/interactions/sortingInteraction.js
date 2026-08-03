import Interaction from "./interaction.js";

export default class SortingInteraction extends Interaction {

    constructor(component, runtime) {

        super(component, runtime);

        this.order = [];

    }


    render() {

        return this.component.properties.items
            .map((item, index) => `
<div
    draggable="true"
    data-sort-item="${index}">
    ${item}
</div>
`)
            .join("");

    }


    bind(rootElement) {

        const items =
            rootElement.querySelectorAll(
                "[data-sort-item]"
            );


        for (const item of items) {

            item.addEventListener(
                "dragstart",
                (event) => {

                    event.dataTransfer.setData(
                        "text/plain",
                        item.dataset.sortItem
                    );

                }
            );


            item.addEventListener(
                "drop",
                (event) => {

                    event.preventDefault();

                    const source =
                        event.dataTransfer.getData(
                            "text/plain"
                        );


                    this.collect(
                        Number(source),
                        Number(item.dataset.sortItem)
                    );

                }
            );


            item.addEventListener(
                "dragover",
                (event) => {

                    event.preventDefault();

                }
            );

        }

    }


    collect(sourceIndex, targetIndex) {

        this.order.push({
            sourceIndex,
            targetIndex
        });


        return this.order;

    }


    validate() {

        return this.order.length > 0;

    }


    evaluate() {

        const correctOrder =
            this.component.properties.correctOrder ?? [];


        const currentOrder =
            this.component.properties.items.map(
                (_, index) => index
            );


        return JSON.stringify(currentOrder) ===
            JSON.stringify(correctOrder);

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