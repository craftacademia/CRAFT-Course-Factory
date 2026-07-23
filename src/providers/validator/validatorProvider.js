import Provider from "../../core/provider.js";

export default class ValidatorProvider extends Provider {

  constructor() {
    super("validator");
  }

  async validate(ast) {

    const errors = [];

    if (!ast || ast.type !== "COURSE") {
      errors.push({
        type: "ERROR",
        message: "Root node must be COURSE."
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      ast
    };

  }

}
