import providerManager from "../../core/providerManager.js";

export function getParser(fileName) {
  const parsers = providerManager.getAll("parsers");

  for (const parser of parsers) {
    if (parser.supports(fileName)) {
      return parser;
    }
  }

  throw new Error(`No parser available for "${fileName}"`);
}
