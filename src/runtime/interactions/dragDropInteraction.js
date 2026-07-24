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