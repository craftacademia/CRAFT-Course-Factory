import { walk } from "../utils/treeWalker.js";

export default class AssetBuilder {

  build(ast) {

    const assets = [];

    walk(ast, node => {

      if (node.type !== "ASSET") {
        return;
      }

      assets.push({
        id: node.attributes?.id ?? null,
        name: node.attributes?.name ?? null,
        type: node.attributes?.type ?? null,
        src: node.attributes?.src ?? null,
        alt: node.attributes?.alt ?? null,
        attributes: node.attributes ?? {}
      });

    });

    return assets;

  }

}
