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
                this.findImageByRef(
                    images,
                    screen.propRef
                )
                ??
                images[0]
                ??
                null;



            // MCQ screens are intentionally clean — no background
            // image at all, just the question and options on white.
            const isMcqScreen =
                (screen.type ?? "").toUpperCase() === "MCQ";


            if (screenImage && !isMcqScreen) {


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



            const feedbackVoiceIds =
                new Set(
                    [
                        screen.dragDrop?.feedback?.correct,
                        screen.dragDrop?.feedback?.incorrect,
                        screen.branching?.feedback?.correct,
                        screen.branching?.feedback?.incorrect
                    ]
                    .filter(Boolean)
                    .map(
                        line =>
                        line.voiceId
                    )
                    .filter(Boolean)
                );


            const scoreBranchVoiceIds =
                new Set(
                    (screen.scoreBranch?.cases ?? [])
                    .flatMap(
                        scoreCase =>
                        scoreCase.lines ?? []
                    )
                    .map(
                        line =>
                        line.voiceId
                    )
                    .filter(Boolean)
                );


            const screenDialogues =
                (ccir.metadata?.dialogues ?? [])
                .filter(
                    item =>
                    item.screenId === screen.id &&
                    !feedbackVoiceIds.has(item.voiceId) &&
                    !scoreBranchVoiceIds.has(item.voiceId)
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

                                style:
                                screen.branching.style ?? "instant",


                                feedback:
                                screen.branching.feedback ?? null,


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
                                        option.voiceId,


                                        // Only used when style is "hotspot" —
                                        // each option is a document image
                                        // rather than a text button.
                                        image:
                                        screen.branching.style === "hotspot"
                                        ?
                                        this.findImageByRef(
                                            images,
                                            option.assetRef
                                        )
                                        :
                                        null

                                    })
                                )

                            }

                        }
                    )
                );

            }



            if (
                screen.tabContent &&
                screen.tabContent.bullets?.length > 0
            ) {


                components.push(
                    this.componentBuilder.build(
                        "TAB_PANEL",
                        {

                            id:
                            `TAB_PANEL_${screen.id}`,


                            properties:{

                                bullets:
                                screen.tabContent.bullets

                            }

                        }
                    )
                );

            }



            if (
                screen.revealTabs &&
                screen.revealTabs.length > 0
            ) {


                components.push(
                    this.componentBuilder.build(
                        "REVEAL_PANEL",
                        {

                            id:
                            `REVEAL_PANEL_${screen.id}`,


                            properties:{

                                tabs:
                                screen.revealTabs.map(
                                    tab => ({

                                        id:
                                        tab.id,

                                        title:
                                        tab.title,

                                        text:
                                        tab.text,


                                        image:
                                        this.findImageByRef(
                                            images,
                                            tab.assetRef
                                        )

                                    })
                                )

                            }

                        }
                    )
                );

            }



            if (
                screen.dragDrop &&
                screen.dragDrop.cards?.length > 0
            ) {


                components.push(
                    this.componentBuilder.build(
                        "DRAG_DROP",
                        {

                            id:
                            `DRAG_DROP_${screen.id}`,


                            properties:{

                                cards:
                                screen.dragDrop.cards.map(
                                    card => ({

                                        id:
                                        card.id,

                                        label:
                                        card.label,

                                        subtext:
                                        card.subtext,

                                        correctZone:
                                        card.zone,


                                        image:
                                        this.findImageByRef(
                                            images,
                                            card.assetRef
                                        )

                                    })
                                ),


                                zones:
                                screen.dragDrop.zones,


                                feedback:
                                screen.dragDrop.feedback ?? null

                            }

                        }
                    )
                );

            }



            if (screen.scoreCheckpoint) {


                components.push(
                    this.componentBuilder.build(
                        "SCORE_CHECKPOINT",
                        {

                            id:
                            `SCORE_CHECKPOINT_${screen.id}`,


                            properties:{

                                checkpointId:
                                screen.scoreCheckpoint.checkpointId,

                                moduleName:
                                screen.scoreCheckpoint.moduleName,

                                max:
                                screen.scoreCheckpoint.max

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


                scoreBranch:
                screen.scoreBranch ?? null,


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
