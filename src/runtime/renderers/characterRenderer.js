import ComponentRenderer from "./componentRenderer.js";

export default class CharacterRenderer extends ComponentRenderer {

    render(component, context) {

        const src = component.asset?.src ?? "";
        const x = component.properties?.x ?? 0;
        const y = component.properties?.y ?? 0;

        context.append(`
<div class="character"
     style="left:${x}px;top:${y}px;position:absolute;">
    <img src="${src}" />
</div>`);

    }

}