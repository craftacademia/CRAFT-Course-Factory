import LexerProvider from "./src/providers/lexer/lexerProvider.js";
import ParserProvider from "./src/providers/parser/parserProvider.js";
import SemanticProvider from "./src/providers/semantic/semanticProvider.js";

const lexer = new LexerProvider();
const parser = new ParserProvider();
const semantic = new SemanticProvider();

const tokens = await lexer.lex([
  { number: 1, text: "[SCREEN ID=S01]" },
  { number: 2, text: "Screen One" },
  { number: 3, text: "[/SCREEN]" },
  { number: 4, text: "[SCREEN ID=S01]" },
  { number: 5, text: "Duplicate Screen" },
  { number: 6, text: "[/SCREEN]" }
]);

const ast = await parser.parse(tokens);

const result = await semantic.validate(ast);

console.log(JSON.stringify(result, null, 2));
