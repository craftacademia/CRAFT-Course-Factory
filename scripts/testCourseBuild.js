import path from "path";

import TestCompiler from "../src/testing/TestCompiler.js";
import Compiler from "../src/compiler/compiler.js";

const projectPath = process.argv[2];

if (!projectPath) {
    console.error("Usage:");
    console.error("node scripts/testCourseBuild.js <project-folder>");
    process.exit(1);
}

async function main() {

    console.log("\n========================================");
    console.log("      CRAFT COURSE FACTORY TEST");
    console.log("========================================\n");

    console.log("[1/5] Validating project...");

    const testCompiler = new TestCompiler(projectPath);

    try {

        await testCompiler.validate();

        console.log("✓ Validation completed.\n");

    } catch (error) {

        console.error("\nVALIDATION FAILED\n");
        console.error(error);
        console.error("\nStack Trace:\n");
        console.error(error.stack);

        throw error;

    }

    console.log("[2/5] Creating compiler...");

    const compiler = new Compiler();

    console.log("✓ Compiler created.\n");

    const scriptFile = path.join(
        projectPath,
        "Script",
        "Course Script.docx"
    );

    const outputFolder = path.join(
        projectPath,
        "Output"
    );

    console.log("[3/5] Script File :");
    console.log(scriptFile);

    console.log("\n[4/5] Output Folder :");
    console.log(outputFolder);

    console.log("\n[5/5] Starting compilation...\n");

    try {

        await compiler.compile(
            scriptFile,
            outputFolder
        );

        console.log("\n========================================");
        console.log(" BUILD COMPLETE ");
        console.log("========================================\n");

    } catch (error) {

        console.error("\n========================================");
        console.error(" BUILD FAILED INSIDE COMPILER ");
        console.error("========================================\n");

        console.error(error);
        console.error("\nStack Trace:\n");
        console.error(error.stack);

        throw error;

    }

}

main().catch(error => {

    console.error("\n========================================");
    console.error(" BUILD ABORTED ");
    console.error("========================================\n");

    console.error(error);
    console.error("\nStack Trace:\n");
    console.error(error.stack);

    process.exit(1);

});