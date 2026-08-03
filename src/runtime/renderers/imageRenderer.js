import ComponentRenderer from "./componentRenderer.js";

export default class ImageRenderer extends ComponentRenderer {

    render(component, context) {

        const asset =
            component.asset?.object ??
            null;


        const src =
            asset?.src ??
            component.asset ??
            component.properties?.asset ??
            null;


        if (!src) {
            return;
        }


        context.append(`
<img
    class="image-component"
    src="${src}"
    alt=""
>
`);

    }

}