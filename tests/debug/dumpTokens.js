import WordReaderProvider from "../../src/providers/readers/word/wordReaderProvider.js";
import DocumentFormatterProvider from "../../src/providers/documentFormatter/documentFormatterProvider.js";
import LexerProvider from "../../src/providers/lexer/lexerProvider.js";

const reader = new WordReaderProvider();
const formatter = new DocumentFormatterProvider();
const lexer = new LexerProvider();

const raw = await reader.read("scripts/Test Script.docx");
const formatted = await formatter.format(raw);

const lines = formatted.split(/\r?\n/).map((text, i) => ({
  number: i + 1,
  text
}));

const tokens = await lexer.lex(lines);

for (const token of tokens) {
  if (
    token.name === "LOCATION" ||
    token.name === "LOCATIONS" ||
    token.name === "ASSET" ||
    token.name === "ASSETS"
  ) {
    console.log(token);
  }
}
