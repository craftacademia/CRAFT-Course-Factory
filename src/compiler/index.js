class Compiler {
  constructor() {
    this.stages = [];
  }

  use(stage) {
    if (!stage || typeof stage.run !== "function") {
      throw new Error("Compiler stage must expose a run(context) function.");
    }

    this.stages.push(stage);
    return this;
  }

  async compile(input) {
    const context = {
      input,
      output: input,
      metadata: {},
      diagnostics: []
    };

    for (const stage of this.stages) {
      context.output = await stage.run(context);
    }

    return context;
  }
}

module.exports = Compiler;
