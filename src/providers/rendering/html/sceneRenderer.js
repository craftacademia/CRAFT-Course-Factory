import ScreenRenderer from "./screenRenderer.js";

export default class SceneRenderer {

  constructor() {
    this.screenRenderer = new ScreenRenderer();
  }

  render(scene) {

    const screens =
      scene.screens ??
      scene.children ??
      [];

    return `
<section class="scene">

${screens.map(screen => this.screenRenderer.render(screen)).join("\n")}

</section>
`;

  }

}
