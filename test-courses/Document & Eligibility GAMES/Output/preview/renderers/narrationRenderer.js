import ComponentRenderer from "./componentRenderer.js";

export default class NarrationRenderer extends ComponentRenderer {

    render(component, context) {

        context.append(`
<div class="narration">
    ${component.properties.text}
</div>`);

    }

}