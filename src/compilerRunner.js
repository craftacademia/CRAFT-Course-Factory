import Compiler from "./compiler/compiler.js";

async function main() {

    const inputFile = process.argv[2];

    const outputDirectory =
        process.argv[3] ?? "./build";


    if (!inputFile) {

        console.error(
            "Usage: node src/compilerRunner.js <course.docx> [output-folder]"
        );

        process.exit(1);

    }


    try {

        const compiler =
            new Compiler();


        const result =
            await compiler.compile(
                inputFile,
                outputDirectory
            );


        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );


    } catch (err) {

        console.error(err);

        process.exit(1);

    }

}


main();