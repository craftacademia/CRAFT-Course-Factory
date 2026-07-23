function normalizeKey(key) {

    return key
        .trim()
        .toLowerCase()
        .replace(/_([a-z])/g, (_, c) => c.toUpperCase());

}

function walk(node) {

    if (!node || typeof node !== "object") {
        return;
    }

    if (node.attributes) {

        const normalized = {};

        for (const [key, value] of Object.entries(node.attributes)) {
            normalized[normalizeKey(key)] = value;
        }

        node.attributes = normalized;

    }

    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            walk(child);
        }
    }

}

export default class AttributeNormalizer {

    normalize(ast) {

        walk(ast);

        return ast;

    }

}
