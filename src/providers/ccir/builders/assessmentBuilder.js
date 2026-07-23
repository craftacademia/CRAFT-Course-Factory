import { walk } from "../utils/treeWalker.js";

export default class AssessmentBuilder {

  build(ast) {

    const assessments = [];

    walk(ast, node => {

      if (node.type !== "ASSESSMENT") {
        return;
      }

      assessments.push({
        id: node.attributes?.id ?? null,
        title: node.attributes?.title ?? null,
        passingScore: node.attributes?.passingScore ?? null,
        attributes: node.attributes ?? {},
        children: node.children ?? []
      });

    });

    return assessments;

  }

}
