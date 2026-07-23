import fs from "fs/promises";
import mammoth from "mammoth";

const result = await mammoth.extractRawText({
  path: "scripts/Test Script.docx"
});

await fs.writeFile(
  "tests/output/rawText.txt",
  result.value,
  "utf8"
);

console.log("Raw text written to tests/output/rawText.txt");
