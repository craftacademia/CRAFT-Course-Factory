import LexerProvider from "./src/providers/lexer/lexerProvider.js";
import ParserProvider from "./src/providers/parser/parserProvider.js";

const lexer = new LexerProvider();
const parser = new ParserProvider();

const tokens = await lexer.lex([
  { number: 1, text: "[SCREEN ID=S01]" },
  { number: 2, text: "Hello World" },
  { number: 3, text: "[LINE]" },
  { number: 4, text: "Welcome" },
  { number: 5, text: "[/LINE]" },
  { number: 6, text: "[/SCREEN]" }
]);

const ast = await parser.parse(tokens);

console.log(JSON.stringify(ast, null, 2));
