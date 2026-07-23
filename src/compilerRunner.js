import Compiler from "./compiler/compiler.js";

async function main() {

  const file = process.argv[2];

  if (!file) {
    console.error("Usage: node src/compilerRunner.js <course.docx>");
    process.exit(1);
  }

  try {

    const compiler = new Compiler();

    const result = await compiler.compile(file);

    console.log(JSON.stringify(result, null, 2));

  } catch (err) {

    console.error(err);

    process.exit(1);

  }

}

main();
