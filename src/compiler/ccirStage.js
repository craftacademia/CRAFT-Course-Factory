const CompilerStage = require("./stage");

class CCIRStage extends CompilerStage {
  async run(context) {
    return context.output;
  }
}

module.exports = CCIRStage;
