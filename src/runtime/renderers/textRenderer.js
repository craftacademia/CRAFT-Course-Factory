import ComponentRenderer from "./componentRenderer.js";

export default class TextRenderer extends ComponentRenderer {

    render(component, context) {

        const text =
            component.properties?.text ??
            "";

        context.append(`
<div class="text-component">
    ${text}
</div>
`);

    }

}