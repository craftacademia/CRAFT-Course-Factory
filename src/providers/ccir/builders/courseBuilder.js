export default class CourseBuilder {

  build(ast) {

    return {
      id: ast.attributes?.ID ?? null,
      title: ast.attributes?.TITLE ?? null,
      description: ast.attributes?.DESCRIPTION ?? null,
      root: ast
    };

  }

}
