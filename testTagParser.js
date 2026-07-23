import TagAttributeParser from "./src/providers/tagParser/tagAttributeParser.js";

const parser = new TagAttributeParser();

const result = parser.parse(
  '[CHARACTER ID=CHAR-01-F NAME="Same" TITLE="Branch Manager" EXPRESSION="Apologetic"]'
);

console.log(JSON.stringify(result, null, 2));
