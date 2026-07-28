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

        const backgroundAudio =
            ccir.assets?.audio?.background?.[0]?.path ?? null;


        for (const screen of ccir.screens ?? []) {

            const components = [];


            const image =
                this.resolveImage(
                    screen,
                    images
                );


            if (image) {

                components.push(

                    this.componentBuilder.build(
                        "IMAGE",
                        {

                            id:
                            `IMAGE_${components.length + 1}`,

                            asset:
                            image,

                            properties:
                            {
                                asset:
                                image
                            }

                        }
                    )

                );

            }



            if (backgroundAudio) {

                components.push(

                    this.componentBuilder.build(
                        "AUDIO",
                        {

                            id:
                            `AUDIO_${components.length + 1}`,

                            asset:
                            backgroundAudio,

                            properties:
                            {
                                asset:
                                backgroundAudio
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



    resolveImage(
        screen,
        images
    ) {

        if (screen.assetRef?.src) {

            return screen.assetRef.src;

        }


        const image =
            images.find(
                item => {

                    const imageId =
                        item.name
                            ?.replace(
                                /\.[^/.]+$/,
                                ""
                            );


                    return imageId === screen.id;

                }
            );


        return image?.path ?? null;

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