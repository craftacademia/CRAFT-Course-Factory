import LayerBuilder from "./layerBuilder.js";
import ComponentBuilder from "./componentBuilder.js";

export default class PageBuilder {

    constructor() {

        this.layerBuilder = new LayerBuilder();
        this.componentBuilder = new ComponentBuilder();

    }

    build(ccir) {

        const pages = [];

        if (!Array.isArray(ccir.screens)) {
            return pages;
        }

        let pageNo = 1;

        for (const screen of ccir.screens) {

            const components = [];

            // Background component
            if (screen.asset) {

                components.push(
                    this.componentBuilder.build(
                        "BACKGROUND",
                        {
                            id: `BACKGROUND_${pageNo}`,
                            asset: screen.asset
                        }
                    )
                );

            }

            // Character component
            if (screen.character) {

                components.push(
                    this.componentBuilder.build(
                        "CHARACTER",
                        {
                            id: `CHARACTER_${pageNo}`,
                            properties: {
                                name: screen.character
                            }
                        }
                    )
                );

            }

            if (Array.isArray(screen.children)) {

                for (const child of screen.children) {

                    if (child.type === "TEXT") {

                        components.push(
                            this.componentBuilder.build(
                                "NARRATION",
                                {
                                    id: `NARRATION_${pageNo}_${components.length + 1}`,
                                    properties: {
                                        text: child.value
                                    }
                                }
                            )
                        );

                    }

                    if (child.type === "DIALOGUE") {

                        const dialogueText = (child.children ?? [])
                            .filter(c => c.type === "TEXT")
                            .map(c => c.value)
                            .join(" ");

                        components.push(
                            this.componentBuilder.build(
                                "DIALOGUE",
                                {
                                    id: `DIALOGUE_${pageNo}_${components.length + 1}`,
                                    properties: {
                                        text: dialogueText
                                    }
                                }
                            )
                        );

                    }

                }

            }

            const contentLayer = this.layerBuilder.build(
                "CONTENT",
                components
            );

            pages.push({

                id: screen.id ?? `PAGE_${pageNo}`,
                name: screen.title,
                title: screen.title,

                layers: [
                    contentLayer
                ]

            });

            pageNo++;

        }

        return pages;

    }

}