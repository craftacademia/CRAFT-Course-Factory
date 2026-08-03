import ComponentRenderer from "./componentRenderer.js";

export default class AudioRenderer extends ComponentRenderer {

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
<audio
    class="audio-component"
    src="${src}"
    controls
>
</audio>
`);

    }

}