export default class AttributeNormalizer {


    normalize(ast) {

        this.walk(ast);

        return ast;

    }



    walk(node) {

        if (!node) {
            return;
        }


        if (node.attributes) {

            const normalized = {};


            for (const [key, value] of Object.entries(node.attributes)) {

                normalized[
                    key.toLowerCase()
                ] = value;

            }


            node.attributes = normalized;

        }


        for (const child of node.children ?? []) {

            child.parent = node;

            this.walk(
                child
            );

        }

    }

}