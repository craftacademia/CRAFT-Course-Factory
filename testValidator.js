import LexerProvider from "./src/providers/lexer/lexerProvider.js";
import ParserProvider from "./src/providers/parser/parserProvider.js";
import ValidatorProvider from "./src/providers/validator/validatorProvider.js";

const lexer = new LexerProvider();
const parser = new ParserProvider();
const validator = new ValidatorProvider();

const tokens = await lexer.lex([
  { number: 1, text: "[SCREEN ID=S01]" },
  { number: 2, text: "Hello World" },
  { number: 3, text: "[/SCREEN]" }
]);

const ast = await parser.parse(tokens);

const result = await validator.validate(ast);

console.log(JSON.stringify(result, null, 2));
