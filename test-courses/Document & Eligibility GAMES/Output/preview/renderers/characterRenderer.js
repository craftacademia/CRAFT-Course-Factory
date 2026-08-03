import ComponentRenderer from "./componentRenderer.js";

export default class CharacterRenderer extends ComponentRenderer {

    render(component, context) {

        const asset = component.asset?.object;

        if (!asset) {
            return;
        }

        const position = component.properties?.position ?? "center";

        context.append(`
<div class="character character-${position}">
    <img
        src="${asset.src}"
        alt=""
        style="
            position:fixed;
            bottom:0;
            max-height:90%;
            left:50%;
            transform:translateX(-50%);
            z-index:10;
        ">
</div>
`);

    }

}