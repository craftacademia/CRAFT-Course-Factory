import ComponentRenderer from "./componentRenderer.js";

export default class ScreenRenderer {

  constructor() {
    this.componentRenderer = new ComponentRenderer();
  }

  render(screen) {

    const components =
      screen.components ??
      screen.children ??
      [];

    return `
<section class="screen">

${components.map(c => this.componentRenderer.render(c)).join("\n")}

</section>
`;

  }

}
