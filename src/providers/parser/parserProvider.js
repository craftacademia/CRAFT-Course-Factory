import Provider from "../../core/provider.js";

export default class ParserProvider extends Provider {

  constructor() {
    super("parser");
  }

  async parse(tokens) {

    const root = {
      type: "COURSE",
      children: []
    };

    const stack = [root];

    for (const token of tokens) {

      switch (token.type) {

        case "OPEN_TAG": {

          const node = {
            type: token.name,
            line: token.line,
            attributes: token.attributes,
            children: []
          };

          stack[stack.length - 1].children.push(node);
          stack.push(node);

          break;
        }

        case "TEXT":

          stack[stack.length - 1].children.push({
            type: "TEXT",
            line: token.line,
            value: token.value
          });

          break;

        case "CLOSE_TAG":

          if (stack.length > 1) {
            stack.pop();
          }

          break;

      }

    }

    return root;

  }

}
