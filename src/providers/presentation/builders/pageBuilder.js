import LayerBuilder from "./layerBuilder.js";
import ComponentBuilder from "./componentBuilder.js";

export default class PageBuilder {

    constructor() {
        this.layerBuilder = new LayerBuilder();
        this.componentBuilder = new ComponentBuilder();
    }

    build(ccir) {

        const pages = [];

        for (const screen of ccir.screens ?? []) {

            const components = [];

            this.addNodeComponents(screen, components);

            pages.push({

                id: screen.id,

                title: screen.title ?? screen.name ?? "",

                layers: [
                    this.layerBuilder.build(
                        "CONTENT",
                        components
                    )
                ]

            });

        }

        return pages;

    }


    addNodeComponents(node, components) {

        if (!node) {
            return;
        }


        if (node.type === "TEXT") {

            components.push(
                this.componentBuilder.build(
                    "NARRATION",
                    {
                        id: `NARRATION_${components.length + 1}`,
                        properties: {
                            text: node.value ?? ""
                        }
                    }
                )
            );

        }


        if (node.type === "DIALOGUE") {

            const text = (node.children ?? [])
                .filter(child => child.type === "TEXT")
                .map(child => child.value ?? "")
                .join(" ");

            components.push(
                this.componentBuilder.build(
                    "DIALOGUE",
                    {
                        id: `DIALOGUE_${components.length + 1}`,
                        properties: {
                            text
                        }
                    }
                )
            );

        }


        for (const child of node.children ?? []) {
            this.addNodeComponents(child, components);
        }

    }

}