import mammoth from "mammoth";
import ParserProvider from "./parserProvider.js";

export default class WordParser extends ParserProvider {
  constructor() {
    super("word", ["docx"]);
  }

  async parse(filePath) {
    const result = await mammoth.convertToHtml({
      path: filePath,
    });

    return {
      type: "word",
      source: filePath,
      html: result.value,
      messages: result.messages,
    };
  }
}
