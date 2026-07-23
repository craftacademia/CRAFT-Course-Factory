import LexerProvider from "./src/providers/lexer/lexerProvider.js";
import ParserProvider from "./src/providers/parser/parserProvider.js";
import SemanticProvider from "./src/providers/semantic/semanticProvider.js";
import CCIRProvider from "./src/providers/ccir/ccirProvider.js";

const lexer = new LexerProvider();
const parser = new ParserProvider();
const semantic = new SemanticProvider();
const ccir = new CCIRProvider();

const tokens = await lexer.lex([
  { number: 1, text: "[SCREEN ID=S01]" },
  { number: 2, text: "Hello World" },
  { number: 3, text: "[/SCREEN]" }
]);

const ast = await parser.parse(tokens);

const validation = await semantic.validate(ast);

if (!validation.valid) {
  console.log(JSON.stringify(validation, null, 2));
  process.exit(1);
}

const result = await ccir.build(validation.ast);

console.log(JSON.stringify(result, null, 2));
