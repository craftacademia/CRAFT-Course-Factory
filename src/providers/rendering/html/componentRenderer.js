export default class ComponentRenderer {


    render(component) {

        if (!component || component.visible === false) {

            return "";

        }


        const type =
            (component.type ?? "unknown").toLowerCase();


        const asset =
            component.asset ??
            component.properties?.asset ??
            null;


        const content =
            this.renderContent(
                component,
                asset
            );


        return `
<div
class="component component-${type}"
data-component-id="${component.id ?? ""}"
data-component-type="${component.type ?? ""}"
>

${content}

</div>
`;

    }


    renderContent(component, asset) {

        const type =
            (component.type ?? "")
            .toUpperCase();



        if (
            type === "IMAGE" &&
            asset
        ) {

            return `
<img
class="component-image"
src="${asset}"
/>
`;

        }



        if (
            type === "AUDIO" &&
            asset
        ) {

            return `
<audio
class="component-audio"
controls
src="${asset}">
</audio>
`;

        }



        return (
            component.properties?.text ??
            component.text ??
            component.value ??
            component.content ??
            component.title ??
            ""
        );

    }

}