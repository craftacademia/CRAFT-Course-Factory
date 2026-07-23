import { walk } from "../utils/treeWalker.js";

export default class DialogueBuilder {

  build(ast) {

    const dialogues = [];

    walk(ast, node => {

      if (node.type !== "DIALOGUE") {
        return;
      }

      dialogues.push({
        id: node.attributes?.id ?? null,
        character: node.attributes?.character ?? null,
        text: node.attributes?.text ?? null,
        voice: node.attributes?.voice ?? null,
        attributes: node.attributes ?? {},
        children: node.children ?? []
      });

    });

    return dialogues;

  }

}
