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



        for (const screen of ccir.screens ?? []) {


            const components = [];



            const screenImage =
                screen.assetRef ??
                images.find(
                    image =>
                    image.name === screen.assetRef?.name
                )
                ??
                images[0]
                ??
                null;



            if (screenImage) {


                components.push(
                    this.componentBuilder.build(
                        "IMAGE",
                        {

                            id:
                            `IMAGE_${screen.id}`,

                            asset:
                            screenImage,

                            properties:{

                                asset:
                                screenImage

                            }

                        }
                    )
                );

            }



            const screenDialogues =
                (ccir.metadata?.dialogues ?? [])
                .filter(
                    item =>
                    item.screenId === screen.id
                );



            for (const dialogue of screenDialogues) {


                if (
                    !dialogue.text ||
                    !dialogue.speaker
                ) {

                    continue;

                }



                components.push(
                    this.componentBuilder.build(
                        "DIALOGUE",
                        {

                            id:
                            `DIALOGUE_${components.length + 1}`,

                            properties:{

                                text:
                                dialogue.text,

                                speaker:
                                dialogue.speaker,

                                voiceId:
                                dialogue.voiceId ?? null,

                                expression:
                                dialogue.expression ?? null

                            }

                        }
                    )
                );

            }



            pages.push({

                id:
                screen.id,


                title:
                screen.title ?? "",


                layers:[
                    this.layerBuilder.build(
                        "CONTENT",
                        components
                    )
                ]

            });

        }



        return pages;

    }

}