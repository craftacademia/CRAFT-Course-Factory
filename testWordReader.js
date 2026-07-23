import WordReaderProvider from "./src/providers/readers/word/wordReaderProvider.js";

const reader = new WordReaderProvider();

const result = await reader.read("./scripts/Test Script.docx");

console.log(result);
