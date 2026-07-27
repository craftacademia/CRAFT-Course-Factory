import LayerBuilder from "./layerBuilder.js";
import ComponentBuilder from "./componentBuilder.js";

export default class PageBuilder {

    constructor() {

        this.layerBuilder =
            new LayerBuilder();

        this.componentBuilder =
            new ComponentBuilder();

    }


    build(ccir) {

        const pages = [];

        const images =
            ccir.assets?.images ?? [];


        for (const [index, screen] of (ccir.screens ?? []).entries()) {

            const components = [];


            const asset =
                screen.assetRef?.src ??
                images[index]?.path ??
                null;


            if (asset) {

                components.push(

                    this.componentBuilder.build(
                        "IMAGE",
                        {

                            id:
                            `IMAGE_${components.length + 1}`,

                            asset,

                            properties:
                            {
                                asset
                            }

                        }
                    )

                );

            }


            this.addNodeComponents(
                screen,
                components
            );


            pages.push({

                id:
                screen.id,

                title:
                screen.title ?? "",

                layers:
                [
                    this.layerBuilder.build(
                        "CONTENT",
                        components
                    )
                ]

            });

        }


        return pages;

    }



    addNodeComponents(
        node,
        components
    ) {

        if (!node) {

            return;

        }


        if (node.type === "TEXT") {

            components.push(

                this.componentBuilder.build(
                    "NARRATION",
                    {

                        id:
                        `NARRATION_${components.length + 1}`,

                        properties:
                        {
                            text:
                            node.value ?? ""
                        }

                    }
                )

            );

        }


        for (const child of node.children ?? []) {

            this.addNodeComponents(
                child,
                components
            );

        }

    }

}