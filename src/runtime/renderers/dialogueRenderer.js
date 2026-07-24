import ComponentRenderer from "./componentRenderer.js";

export default class DialogueRenderer extends ComponentRenderer {

    render(component, context) {

        context.append(`
<div class="dialogue">
    ${component.properties.text}
</div>`);

    }

}