import registry from "../../../core/registry/index.js";
import WordParser from "../wordParser.js";

registry.register(
  "parsers",
  "word",
  new WordParser()
);
