import LayerBuilder from "./layerBuilder.js";
import ComponentBuilder from "./componentBuilder.js";

export default class PageBuilder {

    constructor() {

        this.layerBuilder = new LayerBuilder();
        this.componentBuilder = new ComponentBuilder();

    }

    build(ccir) {

        console.log("CCIR:", JSON.stringify(ccir, null, 2));

        const pages = [];

        if (!Array.isArray(ccir.locations)) {
            return pages;
        }

        for (const location of ccir.locations) {

            const backgroundComponent = this.componentBuilder.build(
                "BACKGROUND",
                {
                    id: location.id,
                    asset: location.id,
                    properties: {
                        name: location.name
                    }
                }
            );

            const backgroundLayer = this.layerBuilder.build(
                "BACKGROUND",
                [backgroundComponent]
            );

            pages.push({

                id: location.id,

                name: location.name,

                title: location.name,

                background: location.id,

                layers: [
                    backgroundLayer
                ]

            });

        }

        return pages;

    }

}