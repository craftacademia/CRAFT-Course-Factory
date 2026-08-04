import LayerBuilder from "./layerBuilder.js";
import ComponentBuilder from "./componentBuilder.js";


export default class PageBuilder {


    constructor() {

        this.layerBuilder =
            new LayerBuilder();


        this.componentBuilder =
            new ComponentBuilder();

    }



    findImageByRef(images, ref) {

        if (!ref) {
            return null;
        }

        const normalizedRef =
            String(ref)
                .replaceAll("_", "-")
                .toUpperCase();

        return images.find(
            image => {

                const name =
                    (image.name ?? "")
                        .toUpperCase();

                const nameWithoutExtension =
                    name.replace(
                        /\.[A-Z0-9]+$/,
                        ""
                    );

                return (
                    nameWithoutExtension === normalizedRef
                    ||
                    name.includes(normalizedRef)
                );

            }
        ) ?? null;

    }



    build(ccir) {

        const pages = [];


        const images =
            ccir.assets?.images ?? [];



        for (const screen of ccir.screens ?? []) {


            const components = [];



            const screenImage =
                this.findImageByRef(
                    images,
                    screen.scene
                )
                ??
                this.findImageByRef(
                    images,
                    screen.location
                )
                ??
                this.findImageByRef(
                    images,
                    screen.character
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



            if (
                screen.branching &&
                screen.branching.options?.length > 0
            ) {


                components.push(
                    this.componentBuilder.build(
                        "BRANCHING",
                        {

                            id:
                            screen.branching.id ??
                            `BRANCHING_${screen.id}`,


                            properties:{

                                options:
                                screen.branching.options.map(
                                    option => ({

                                        text:
                                        option.text,

                                        next:
                                        option.next,

                                        letter:
                                        option.letter,

                                        score:
                                        option.score,

                                        voiceId:
                                        option.voiceId

                                    })
                                )

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


                nextOverride:
                screen.nextOverride ?? null,


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
