import Provider from "../../core/provider.js";

export default class CCIRProvider extends Provider {

  constructor() {
    super("ccir");
  }

  async build(ast) {

    return {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      root: ast
    };

  }

}
