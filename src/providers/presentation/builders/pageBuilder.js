import LayerBuilder from "./layerBuilder.js";

export default class PageBuilder {

    constructor() {
        this.layerBuilder = new LayerBuilder();
    }

    build(ccir) {

        const pages = [];

        if (!Array.isArray(ccir.locations)) {
            return pages;
        }

        for (const location of ccir.locations) {

            const backgroundLayer = this.layerBuilder.build(
                "BACKGROUND",
                {
                    id: location.id,
                    name: location.name
                }
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