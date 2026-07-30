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


            const screenDialogues =
                (ccir.metadata?.dialogues ?? [])
                .filter(
                    item =>
                    item.screenId === screen.id
                )
                .map(
                    item => ({
                        ...item
                    })
                );



            this.addNodeComponents(
                screen,
                components,
                screenDialogues
            );



            this.addInteractions(
                screen,
                components,
                ccir.interactions ?? []
            );



            pages.push({

                id:screen.id,

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




    addInteractions(
        screen,
        components,
        interactions
    ) {


        for (const interaction of interactions) {


            const exists =
                screen.children?.some(
                    child =>
                    child.type === "BRANCH_POINT" &&
                    child.attributes?.id === interaction.id
                );


            if (!exists) {
                continue;
            }


            components.push(
                this.componentBuilder.build(
                    "BRANCHING",
                    {
                        id:
                        interaction.id,

                        properties:{
                            options:
                            interaction.options ?? []
                        }
                    }
                )
            );

        }

    }





    addNodeComponents(
        node,
        components,
        dialogues
    ) {


        if (!node) {
            return;
        }



        if (
            node.type === "BRANCH_POINT" ||
            node.type === "OPTION"
        ) {
            return;
        }



        if (node.type === "TEXT") {


            const dialogue =
                dialogues.shift();



            components.push(
                this.componentBuilder.build(
                    "DIALOGUE",
                    {

                        id:
                        `DIALOGUE_${components.length + 1}`,


                        properties:{

                            text:
                            node.value ?? "",


                            speaker:
                            dialogue?.speaker ?? null,


                            voiceId:
                            dialogue?.voiceId ?? null,


                            expression:
                            dialogue?.expression ?? null

                        }

                    }
                )
            );


            return;

        }



        for (const child of node.children ?? []) {

            this.addNodeComponents(
                child,
                components,
                dialogues
            );

        }

    }

}