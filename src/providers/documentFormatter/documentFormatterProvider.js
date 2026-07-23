import Provider from "../../core/provider.js";

export default class DocumentFormatterProvider extends Provider {

  constructor() {
    super("document-formatter");
  }

  async format(text) {

    const normalized = text
      .replace(/(\[[^\]]+\])/g, "\n$1\n")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();

    return normalized
      .split("\n")
      .map((line, index) => ({
        number: index + 1,
        text: line
      }));

  }

}
