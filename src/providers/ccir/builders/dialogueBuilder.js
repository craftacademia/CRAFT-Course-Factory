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


            const lineNode =
                [...ancestors]
                .reverse()
                .find(
                    item =>
                    item.type === "LINE"
                );



            const screenNode =
                [...ancestors]
                .reverse()
                .find(
                    item =>
                    item.type === "SCREEN"
                );



            const attributes =
                lineNode?.attributes ?? {};



            const characterId =
                attributes.expression ??
                attributes.EXPRESSION ??
                null;



            dialogues.push({

                screenId:
                screenNode?.attributes?.id ??
                screenNode?.attributes?.ID ??
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