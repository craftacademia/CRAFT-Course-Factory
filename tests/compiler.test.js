import fs from "fs/promises";
import path from "path";

import Compiler from "../src/compiler/compiler.js";

async function main() {

    const compiler = new Compiler();

    const input = path.resolve(
        "scripts",
        "Test Script.docx"
    );

    console.log("===================================");
    console.log("CRA.F.T Compiler Test");
    console.log("===================================");
    console.log("Input :", input);
    console.log("");

    const ccir = await compiler.compile(input);

    await fs.mkdir("tests/output", {
        recursive: true
    });

    const outputFile = path.resolve(
        "tests/output/ccir.json"
    );

    await fs.writeFile(
        outputFile,
        JSON.stringify(ccir, null, 2),
        "utf8"
    );

    console.log("");
    console.log("Compilation Successful");
    console.log("");
    console.log("Output:");
    console.log(outputFile);

}

main().catch(err => {

    console.error("");
    console.error("Compilation Failed");
    console.error("");
    console.error(err);

    process.exit(1);

});
