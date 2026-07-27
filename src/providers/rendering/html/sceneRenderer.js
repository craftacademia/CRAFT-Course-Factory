import ScreenRenderer from "./screenRenderer.js";

export default class SceneRenderer {

    constructor() {
        this.screenRenderer = new ScreenRenderer();
    }

    render(page) {

        if (!page) {
            return "";
        }

        const layers = page.layers ?? [];

        return `
<section class="scene" data-page-id="${page.id ?? ""}">

${layers.map(layer => this.screenRenderer.render(layer)).join("\n")}

</section>
`;

    }

}