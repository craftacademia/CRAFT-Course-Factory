import { walk } from "../utils/treeWalker.js";

export default class InteractionBuilder {

  build(ast) {

    const interactions = [];

    walk(ast, node => {

      if (node.type !== "INTERACTION") {
        return;
      }

      interactions.push({
        id: node.attributes?.id ?? null,
        type: node.attributes?.type ?? null,
        target: node.attributes?.target ?? null,
        action: node.attributes?.action ?? null,
        attributes: node.attributes ?? {},
        children: node.children ?? []
      });

    });

    return interactions;

  }

}
