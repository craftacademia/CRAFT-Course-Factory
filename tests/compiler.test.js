import path from "path";
import Compiler from "../src/compiler/compiler.js";

async function main() {

  console.log("===================================");
  console.log("CRA.F.T Compiler Test");
  console.log("===================================");

  const input = path.resolve("scripts/Test Script.docx");
  const output = path.resolve("tests/output");

  console.log("Input :", input);
  console.log("Output:", output);
  console.log("");

  const compiler = new Compiler();

  try {

    await compiler.compile(input, output);

    console.log("");
    console.log("Compilation Successful");
    console.log("");
    console.log(path.join(output, "ccir.json"));

  } catch (error) {

    console.log("");
    console.log("Compilation Failed");
    console.log("");
    console.error(error);

  }

}

main();
