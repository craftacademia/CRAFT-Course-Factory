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


        const content =
            components
                .map(component =>
                    this.componentRenderer.render(component)
                )
                .join("\n");



        return this.renderTemplate(
            template,
            layer,
            content
        );

    }


    renderTemplate(
        template,
        layer,
        content
    ) {

        const layouts = {

            content: `
<div class="slide-template-content">
${content}
</div>
`,


            dialogue: `
<div class="slide-template-dialogue">
${content}
</div>
`,


            image: `
<div class="slide-template-image">
${content}
</div>
`,


            assessment: `
<div class="slide-template-assessment">
${content}
</div>
`

        };


        const body =
            layouts[template] ??
            layouts.content;



        return `
<section
class="screen screen-${template}"
data-layer="${layer.type ?? ""}"
data-template="${template}">

${body}

</section>
`;

    }

}