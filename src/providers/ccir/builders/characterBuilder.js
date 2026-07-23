import { walk } from "../utils/treeWalker.js";

export default class CharacterBuilder {

  build(ast) {

    const characters = [];

    walk(ast, node => {

      if (node.type !== "CHARACTER") {
        return;
      }

      characters.push({
        id: node.attributes?.id ?? null,
        name: node.attributes?.name ?? null,
        avatar: node.attributes?.avatar ?? null,
        attributes: node.attributes ?? {}
      });

    });

    return characters;

  }

}
