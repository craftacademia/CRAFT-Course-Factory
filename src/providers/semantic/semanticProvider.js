import Provider from "../../core/provider.js";

export default class SemanticProvider extends Provider {

  constructor() {
    super("semantic");
  }

  async validate(ast) {

    const errors = [];
    const ids = new Set();

    function visit(node) {

      if (node.attributes?.ID) {

        if (ids.has(node.attributes.ID)) {
          errors.push({
            type: "ERROR",
            line: node.line,
            message: `Duplicate ID '${node.attributes.ID}'`
          });
        }

        ids.add(node.attributes.ID);
      }

      if (node.children) {
        node.children.forEach(visit);
      }

    }

    visit(ast);

    return {
      valid: errors.length === 0,
      errors,
      ast
    };

  }

}
