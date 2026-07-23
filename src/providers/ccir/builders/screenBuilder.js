import { walk } from "../utils/treeWalker.js";

export default class ScreenBuilder {

  build(ast) {

    const screens = [];

    walk(ast, node => {

      if (node.type !== "SCREEN") {
        return;
      }

      screens.push({
        id: node.attributes?.id ?? null,
        title: node.attributes?.title ?? null,
        type: node.attributes?.type ?? "content",
        character: node.attributes?.character ?? null,
        location: node.attributes?.location ?? null,
        asset: node.attributes?.asset ?? null,
        attributes: node.attributes ?? {},
        children: node.children ?? []
      });

    });

    return screens;

  }

}
