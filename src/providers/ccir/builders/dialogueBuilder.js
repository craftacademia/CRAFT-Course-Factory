import { walk } from "../utils/treeWalker.js";

export default class DialogueBuilder {

  build(ast) {

    const dialogues = [];
    let dialogueNumber = 1;

    walk(ast, node => {

      if (node.type !== "DIALOGUE") {
        return;
      }

      const id =
        node.attributes?.id ??
        `DIALOGUE_${String(dialogueNumber).padStart(3, "0")}`;

      const text =
        node.attributes?.text ??
        (node.children ?? [])
          .filter(child => child.type === "TEXT")
          .map(child => child.value)
          .join(" ")
          .trim();

      dialogues.push({

        id,

        character: node.attributes?.character ?? null,

        text,

        voice: node.attributes?.voice ?? null,

        attributes: {
          ...(node.attributes ?? {}),
          id
        },

        children: node.children ?? []

      });

      dialogueNumber++;

    });

    return dialogues;

  }

}