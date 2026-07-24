import ComponentRenderer from "./componentRenderer.js";

export default class BackgroundRenderer extends ComponentRenderer {

    render(component, context) {

        const asset = component.asset?.object;

        if (!asset) {
            return;
        }

        context.append(`
<div class="background">
    <img
        src="${asset.src}"
        alt=""
        style="
            position:fixed;
            inset:0;
            width:100%;
            height:100%;
            object-fit:cover;
            z-index:-1;
        ">
</div>
`);

    }

}