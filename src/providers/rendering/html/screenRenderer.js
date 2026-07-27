import ComponentRenderer from "./componentRenderer.js";

export default class ScreenRenderer {

    constructor() {

        this.componentRenderer =
            new ComponentRenderer();

    }


    render(layer) {

        if (!layer) {

            return "";

        }


        const components =
            layer.components ?? [];


        const template =
            layer.template ??
            layer.properties?.template ??
            "content";


        return `
<section
class="screen screen-${template}"
data-layer="${layer.type ?? ""}"
data-template="${template}">

${components
    .map(component =>
        this.componentRenderer.render(component)
    )
    .join("\n")}

</section>
`;

    }

}