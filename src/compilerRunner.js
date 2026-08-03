import fs from "fs/promises";

import Compiler from "./compiler/compiler.js";


async function main() {

    const inputFile =
        process.argv[2];


    const outputDirectory =
        process.argv[3] ??
        "./build";


    const assetManifestFile =
        process.argv[4] ?? null;



    if (!inputFile) {

        throw new Error(
            "Input script file required."
        );

    }



    let assetManifest =
        null;



    if (assetManifestFile) {

        assetManifest =
            JSON.parse(
                await fs.readFile(
                    assetManifestFile,
                    "utf8"
                )
            );

    }



    const compiler =
        new Compiler();



    await compiler.compile(
        inputFile,
        outputDirectory,
        assetManifest
    );

}



main()
.catch(
    error => {

        console.error(
            error
        );

        process.exit(
            1
        );

    }
);