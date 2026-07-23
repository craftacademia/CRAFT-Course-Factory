import Provider from "../../core/provider.js";

export default class LexerProvider extends Provider {

  constructor() {
    super("lexer");
  }

  async lex(lines) {

    const tokens = [];

    const tagRegex = /^\[(\/?)([A-Z_][A-Z0-9_]*)(.*?)\]$/;

    for (const line of lines) {

      const match = line.text.match(tagRegex);

      if (!match) {
        tokens.push({
          type: "TEXT",
          line: line.number,
          value: line.text
        });
        continue;
      }

      const [, closing, tagName, attributeString] = match;

      const attributes = {};

      attributeString
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .forEach(pair => {

          const index = pair.indexOf("=");

          if (index === -1) return;

          const key = pair.substring(0, index);

          let value = pair.substring(index + 1);

          value = value.replace(/^"(.*)"$/, "$1");

          attributes[key] = value;

        });

      tokens.push({
        type: closing ? "CLOSE_TAG" : "OPEN_TAG",
        line: line.number,
        name: tagName,
        attributes
      });

    }

    return tokens;

  }

}
