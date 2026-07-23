import Provider from "../../core/provider.js";

export default class ParserProvider extends Provider {
  constructor(name, extensions = []) {
    super(name);
    this.extensions = extensions.map(ext => ext.toLowerCase());
  }

  supports(fileName) {
    const parts = fileName.split(".");
    if (parts.length < 2) return false;

    const extension = parts.pop().toLowerCase();
    return this.extensions.includes(extension);
  }

  async parse(filePath) {
    throw new Error(
      `${this.name}: parse() has not been implemented.`
    );
  }
}
