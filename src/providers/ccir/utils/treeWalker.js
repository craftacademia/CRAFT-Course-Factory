export function walk(node, visitor) {

  if (!node) {
    return;
  }

  visitor(node);

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walk(child, visitor);
    }
  }

}
