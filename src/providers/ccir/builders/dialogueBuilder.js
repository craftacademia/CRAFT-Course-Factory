export default class DialogueBuilder {


    build(ast) {

        const dialogues = [];


        this.walk(
            ast,
            dialogues,
            []
        );


        return dialogues;

    }



    walk(
        node,
        dialogues,
        ancestors
    ) {


        if (!node) {
            return;
        }



        if (node.type === "TEXT") {


            // Text can belong to a LINE (spoken dialogue) or an OPTION
            // (a branching choice's button label) — only LINE text counts
            // as dialogue. OPTION text is collected separately by
            // CCIRProvider when it builds branching data.
            const nearestContainer =
                [...ancestors]
                .reverse()
                .find(
                    item =>
                    item.type === "LINE" ||
                    item.type === "OPTION"
                );


            if (
                !nearestContainer ||
                nearestContainer.type !== "LINE"
            ) {

                return;

            }


            const lineNode =
                nearestContainer;



            // A LINE inside a PATH belongs to that PATH (which becomes
            // its own page), not to the SCREEN the PATH is nested in.
            const screenOrPathNode =
                [...ancestors]
                .reverse()
                .find(
                    item =>
                    item.type === "SCREEN" ||
                    item.type === "PATH"
                );



            const attributes =
                lineNode?.attributes ?? {};



            const characterId =
                attributes.expression ??
                attributes.EXPRESSION ??
                null;



            dialogues.push({

                screenId:
                screenOrPathNode?.attributes?.id ??
                screenOrPathNode?.attributes?.ID ??
                null,


                text:
                node.value ?? "",


                speaker:
                attributes.speaker ??
                attributes.SPEAKER ??
                null,


                characterId,


                voiceId:
                attributes.vo_id ??
                attributes.voiceId ??
                attributes.VO_ID ??
                null,


                expression:
                characterId

            });


            return;

        }



        for (const child of node.children ?? []) {


            this.walk(
                child,
                dialogues,
                [
                    ...ancestors,
                    node
                ]
            );

        }

    }

}
