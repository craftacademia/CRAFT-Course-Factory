import { walk } from "../utils/treeWalker.js";

export default class DialogueBuilder {

    build(ast) {

        const dialogues = [];

        let dialogueNumber = 1;


        const extractText = (node) => {

            if (!node) {
                return "";
            }


            if (node.type === "TEXT") {
                return node.value ?? "";
            }


            return (node.children ?? [])
                .map(child => extractText(child))
                .join(" ")
                .trim();

        };


        walk(ast, node => {

            if (node.type !== "LINE") {
                return;
            }


            const id =
                node.attributes?.id ??
                node.attributes?.vo_id ??
                `DIALOGUE_${String(dialogueNumber).padStart(3, "0")}`;


            const text =
                extractText(node);


            dialogues.push({

                id,

                speaker:
                    node.attributes?.speaker ?? null,

                character:
                    node.attributes?.character ??
                    node.attributes?.speaker ??
                    null,

                text,

                voice:
                    node.attributes?.voice ?? null,

                voiceId:
                    node.attributes?.vo_id ??
                    node.attributes?.voiceId ??
                    null,

                expression:
                    node.attributes?.expression ??
                    null,

                attributes: {
                    ...(node.attributes ?? {}),
                    id
                },

                children:
                    node.children ?? []

            });


            dialogueNumber++;

        });


        return dialogues;

    }

}