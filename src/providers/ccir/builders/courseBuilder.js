import { walk } from "../utils/treeWalker.js";

export default class CourseBuilder {

  build(ast) {

    let course = null;

    walk(ast, node => {

      if (node.type !== "COURSE") {
        return;
      }

      course = {
        id: node.attributes?.id ?? null,
        title: node.attributes?.title ?? null,
        version: node.attributes?.version ?? null
      };

    });

    return course;

  }

}
