import Compiler from "./src/compiler/compiler.js";

const compiler = new Compiler();

const result = await compiler.compile("./scripts/Test Script.docx");

console.log(JSON.stringify(result, null, 2));
