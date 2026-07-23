import { walk } from "../utils/treeWalker.js";

export default class VariableBuilder {

  build(ast) {

    const variables = [];

    walk(ast, node => {

      if (node.type !== "VARIABLE") {
        return;
      }

      variables.push({
        id: node.attributes?.id ?? null,
        name: node.attributes?.name ?? null,
        type: node.attributes?.type ?? "string",
        defaultValue: node.attributes?.default ?? null,
        attributes: node.attributes ?? {}
      });

    });

    return variables;

  }

}
