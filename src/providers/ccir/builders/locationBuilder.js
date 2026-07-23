import { walk } from "../utils/treeWalker.js";

export default class LocationBuilder {

  build(ast) {

    const locations = [];

    walk(ast, node => {

      if (node.type !== "LOCATION") {
        return;
      }

      locations.push({
        id: node.attributes?.id ?? null,
        name: node.attributes?.name ?? null,
        description: node.children
          ?.filter(child => child.type === "TEXT")
          .map(child => child.value)
          .join("\n")
          .trim() ?? "",
        attributes: node.attributes ?? {},
        children: node.children ?? []
      });

    });

    return locations;

  }

}
