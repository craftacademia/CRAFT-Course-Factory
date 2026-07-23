import fs from "fs/promises";

import WordReaderProvider from "../src/providers/readers/word/wordReaderProvider.js";
import LexerProvider from "../src/providers/lexer/lexerProvider.js";
import ParserProvider from "../src/providers/parser/parserProvider.js";

const reader = new WordReaderProvider();
const lexer = new LexerProvider();
const parser = new ParserProvider();

const text = await reader.read("scripts/Test Script.docx");

const lines = text
  .split(/\r?\n/)
  .map((line, index) => ({
    number: index + 1,
    text: line
  }));

const tokens = await lexer.lex(lines);

const ast = await parser.parse(tokens);

await fs.mkdir("tests/output", { recursive: true });

await fs.writeFile(
  "tests/output/ast.json",
  JSON.stringify(ast, null, 2),
  "utf8"
);

console.log("AST written to tests/output/ast.json");
