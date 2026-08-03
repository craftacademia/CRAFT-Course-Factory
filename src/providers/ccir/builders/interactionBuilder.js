import { walk } from "../utils/treeWalker.js";

export default class InteractionBuilder {

    build(ast) {

        const interactions = [];


        walk(ast, node => {

            if (node.type !== "BRANCH_POINT" &&
                node.type !== "OPTION" &&
                node.type !== "INTERACTION") {
                return;
            }


            if (node.type === "BRANCH_POINT") {

                interactions.push({

                    id:
                    node.attributes?.id ?? null,

                    type:
                    "BRANCHING",

                    options:
                    (node.children ?? [])
                        .filter(
                            child =>
                            child.type === "OPTION"
                        )
                        .map(option => ({

                            letter:
                            option.attributes?.letter ?? null,

                            score:
                            Number(
                                option.attributes?.score ?? 0
                            ),

                            next:
                            option.attributes?.next ?? null,

                            voiceId:
                            option.attributes?.voId ??
                            option.attributes?.voiceId ??
                            null,

                            text:
                            (option.children ?? [])
                                .filter(
                                    child =>
                                    child.type === "TEXT"
                                )
                                .map(
                                    child =>
                                    child.value
                                )
                                .join(" ")
                                .trim(),

                            attributes:
                            option.attributes ?? {}

                        })),

                    attributes:
                    node.attributes ?? {},

                    children:
                    node.children ?? []

                });

                return;

            }


            if (node.type === "INTERACTION") {

                interactions.push({

                    id:
                    node.attributes?.id ?? null,

                    type:
                    node.attributes?.type ?? null,

                    target:
                    node.attributes?.target ?? null,

                    action:
                    node.attributes?.action ?? null,

                    attributes:
                    node.attributes ?? {},

                    children:
                    node.children ?? []

                });

            }

        });


        return interactions;

    }

}