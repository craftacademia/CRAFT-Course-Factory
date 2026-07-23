import SceneRenderer from "./sceneRenderer.js";

export default class CourseRenderer {

  constructor() {
    this.sceneRenderer = new SceneRenderer();
  }

  render(course) {

    if (!course) return "";

    const scenes =
      course.scenes ??
      course.pages ??
      course.modules ??
      [];

    return scenes
      .map(scene => this.sceneRenderer.render(scene))
      .join("\n");

  }

}
