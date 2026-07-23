import WordReaderProvider from "../providers/readers/word/wordReaderProvider.js";
import DocumentFormatterProvider from "../providers/documentFormatter/documentFormatterProvider.js";
import LexerProvider from "../providers/lexer/lexerProvider.js";
import ParserProvider from "../providers/parser/parserProvider.js";
import ValidatorProvider from "../providers/validator/validatorProvider.js";
import SemanticProvider from "../providers/semantic/semanticProvider.js";
import CCIRProvider from "../providers/ccir/ccirProvider.js";
import AttributeNormalizer from "./normalizers/attributeNormalizer.js";

export default class Compiler {

  constructor() {
    this.reader = new WordReaderProvider();
    this.formatter = new DocumentFormatterProvider();
    this.lexer = new LexerProvider();
    this.parser = new ParserProvider();
    this.validator = new ValidatorProvider();
    this.semantic = new SemanticProvider();
    this.normalizer = new AttributeNormalizer();
    this.ccir = new CCIRProvider();
  }

  async compile(filePath) {

    const rawText = await this.reader.read(filePath);

    const text = await this.formatter.format(rawText);

    const lines = text
      .split(/\r?\n/)
      .map((line, index) => ({
        number: index + 1,
        text: line
      }));

    const tokens = await this.lexer.lex(lines);

    const ast = await this.parser.parse(tokens);

    const normalizedAst = this.normalizer.normalize(ast);

    const syntax = await this.validator.validate(normalizedAst);

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
