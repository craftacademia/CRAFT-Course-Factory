import LexerProvider from "./src/providers/lexer/lexerProvider.js";

const lexer = new LexerProvider();

const tokens = await lexer.lex([
  {
    number: 1,
    text: "[SCREEN ID=S01 TYPE=DIALOG]"
  },
  {
    number: 2,
    text: "Hello World"
  },
  {
    number: 3,
    text: "[/SCREEN]"
  }
]);

console.log(JSON.stringify(tokens, null, 2));
