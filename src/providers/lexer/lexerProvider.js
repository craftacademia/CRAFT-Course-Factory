import Provider from "../../core/provider.js";
import TagAttributeParser from "../tagParser/tagAttributeParser.js";

export default class LexerProvider extends Provider {

  constructor() {
    super("lexer");
    this.tagParser = new TagAttributeParser();
  }

  async lex(lines) {

    const tokens = [];

    const tagRegex = /^\[(\/?)[A-Z_][A-Z0-9_]*.*\]$/;

    for (const line of lines) {

      const text = line.text.trim();

      if (!tagRegex.test(text)) {

        tokens.push({
          type: "TEXT",
          line: line.number,
          value: line.text
        });

        continue;

      }

      const closing = text.startsWith("[/");

      if (closing) {

        const name = text
          .replace("[/", "")
          .replace("]", "")
          .trim();

        tokens.push({
          type: "CLOSE_TAG",
          line: line.number,
          name
        });

        continue;

      }

      const parsed = this.tagParser.parse(text);

      tokens.push({
        type: "OPEN_TAG",
        line: line.number,
        name: parsed.tag,
        attributes: parsed.attributes
      });

    }

    return tokens;

  }

}
