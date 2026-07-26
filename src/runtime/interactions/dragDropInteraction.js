import Interaction from "./interaction.js";

export default class DragDropInteraction extends Interaction {

    constructor(component, runtime) {

        super(component, runtime);

        this.placements = new Map();

    }

    render() {

        return {
            draggableItems: this.component.properties.items,
            dropZones: this.component.properties.zones
        };

    }

    bind(rootElement) {

        const draggables = rootElement.querySelectorAll("[data-drag-item]");
        const dropZones = rootElement.querySelectorAll("[data-drop-zone]");

        for (const draggable of draggables) {

            draggable.addEventListener("dragstart", (event) => {

                event.dataTransfer.setData(
                    "text/plain",
                    draggable.dataset.dragItem
                );

            });

        }

        for (const zone of dropZones) {

            zone.addEventListener("dragover", (event) => {

                event.preventDefault();

            });

            zone.addEventListener("drop", (event) => {

                event.preventDefault();

                const itemId = event.dataTransfer.getData("text/plain");
                const zoneId = zone.dataset.dropZone;

                this.collect(itemId, zoneId);

            });

        }

    }

    collect(itemId, zoneId) {

        this.placements.set(itemId, zoneId);

        return Object.fromEntries(this.placements);

    }

    validate() {

        return this.placements.size > 0;

    }

    evaluate() {

        const answers = this.component.properties.answers;

        if (this.placements.size !== Object.keys(answers).length) {
            return false;
        }

        for (const [itemId, zoneId] of this.placements) {

            if (answers[itemId] !== zoneId) {
                return false;
            }

        }

        return true;

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