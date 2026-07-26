import Interaction from "./interaction.js";

export default class HotspotInteraction extends Interaction {

    constructor(component, runtime) {

        super(component, runtime);

        this.selected = null;

    }

    render() {

        return {
            image: this.component.properties.image,
            hotspots: this.component.properties.hotspots
        };

    }

    bind(rootElement) {

        const hotspots = rootElement.querySelectorAll("[data-hotspot-id]");

        for (const hotspot of hotspots) {

            hotspot.addEventListener("click", () => {

                this.collect(hotspot.dataset.hotspotId);

            });

        }

    }

    collect(hotspotId) {

        this.selected = hotspotId;

        return this.selected;

    }

    validate() {

        return this.selected !== null;

    }

    evaluate() {

        return this.selected === this.component.properties.correct;

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