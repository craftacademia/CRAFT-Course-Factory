const CompilerStage = require("./stage");

class NormalizeStage extends CompilerStage {
  async run(context) {
    return context.output;
  }
}

module.exports = NormalizeStage;
