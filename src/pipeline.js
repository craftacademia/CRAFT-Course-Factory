const Compiler = require("./compiler");
const NormalizeStage = require("./compiler/normalizeStage");
const CCIRStage = require("./compiler/ccirStage");

const compiler = new Compiler();

compiler
  .use(new NormalizeStage())
  .use(new CCIRStage());

module.exports = compiler;
