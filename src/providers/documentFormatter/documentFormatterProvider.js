import Provider from "../../core/provider.js";

export default class DocumentFormatterProvider extends Provider {

  constructor() {
    super("document-formatter");
  }

  async format(text) {

    return text
      // Put every tag on its own line
      .replace(/(\[[^\]]+\])/g, "\n$1\n")

      // Collapse multiple blank lines
      .replace(/\n{2,}/g, "\n")

      // Trim surrounding whitespace
      .trim();

  }

}
