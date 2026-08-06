import Provider from "../../core/provider.js";


// These tags carry all their data in attributes and never have a
// matching closing tag — [CARD ID=... ZONE=A], not [CARD]...[/CARD].
// Without this list, the parser would keep them open on the stack
// forever, silently nesting every tag that follows inside them.
const SELF_CLOSING_TAGS = new Set([
    "CARD",
    "ZONE"
]);


export default class ParserProvider extends Provider {

    constructor() {

        super("parser");

    }


    async parse(tokens) {

        const root = {
            type: "COURSE",
            children: [],
            parent: null
        };


        const stack = [root];


        for (const token of tokens) {


            switch (token.type) {


                case "OPEN_TAG": {

                    const parent =
                        stack[stack.length - 1];


                    const node = {

                        type: token.name,

                        line: token.line,

                        attributes:
                            token.attributes,

                        children: [],

                        parent

                    };


                    parent.children.push(
                        node
                    );


                    if (!SELF_CLOSING_TAGS.has(token.name)) {

                        stack.push(
                            node
                        );

                    }


                    break;

                }


                case "TEXT": {

                    const parent =
                        stack[stack.length - 1];


                    const node = {

                        type: "TEXT",

                        line: token.line,

                        value:
                            token.value,

                        parent

                    };


                    parent.children.push(
                        node
                    );


                    break;

                }


                case "CLOSE_TAG": {


                    if (stack.length > 1) {

                        stack.pop();

                    }


                    break;

                }


            }

        }


        return root;

    }

}
