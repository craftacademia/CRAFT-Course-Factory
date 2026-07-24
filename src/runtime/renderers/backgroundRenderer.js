import ComponentRenderer from "./componentRenderer.js";

export default class BackgroundRenderer extends ComponentRenderer {

    render(component, context) {

        const background = component.asset?.src ?? "";

        context.append(`
<div class="background"
     style="background-image: url('${background}');">
</div>`);

    }

}