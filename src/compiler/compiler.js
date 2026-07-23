import WordReaderProvider from "../providers/readers/word/wordReaderProvider.js";
import LexerProvider from "../providers/lexer/lexerProvider.js";
import ParserProvider from "../providers/parser/parserProvider.js";
import ValidatorProvider from "../providers/validator/validatorProvider.js";
import SemanticProvider from "../providers/semantic/semanticProvider.js";
import CCIRProvider from "../providers/ccir/ccirProvider.js";

export default class Compiler {

  constructor() {
    this.reader = new WordReaderProvider();
    this.lexer = new LexerProvider();
    this.parser = new ParserProvider();
    this.validator = new ValidatorProvider();
    this.semantic = new SemanticProvider();
    this.ccir = new CCIRProvider();
  }

  async compile(filePath) {

    const text = await this.reader.read(filePath);

    const lines = text
      .split(/\r?\n/)
      .map((line, index) => ({
        number: index + 1,
        text: line
      }));

    const tokens = await this.lexer.lex(lines);

    const ast = await this.parser.parse(tokens);

    const syntax = await this.validator.validate(ast);

    if (!syntax.valid) {
      return syntax;
    }

    const semantic = await this.semantic.validate(syntax.ast);

    if (!semantic.valid) {
      return semantic;
    }

    return await this.ccir.build(semantic.ast);

  }

}
