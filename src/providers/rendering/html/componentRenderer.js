export default class ComponentRenderer {


    render(component) {

        if (!component || component.visible === false) {

            return "";

        }


        const type =
            (component.type ?? "unknown")
            .toUpperCase();


        const asset =
            component.asset ??
            component.properties?.asset ??
            null;


        let content = "";


        switch (type) {

            case "IMAGE":

                content =
                    this.renderImage(asset);

                break;


            case "AUDIO":

                content =
                    this.renderAudio(asset);

                break;


            case "BRANCHING":

                content =
                    this.renderBranching(
                        component
                    );

                break;


            default:

                content =
                    this.renderText(
                        component
                    );

        }


        return `
<div
class="component component-${type.toLowerCase()}"
data-component-id="${component.id ?? ""}"
data-component-type="${component.type ?? ""}"
>

${content}

</div>
`;

    }



    renderImage(asset) {

        if (!asset) {

            return "";

        }


        return `
<img
class="component-image"
src="${asset}"
/>
`;

    }



    renderAudio(asset) {

        if (!asset) {

            return "";

        }


        return `
<audio
class="component-audio"
controls
src="${asset}">
</audio>
`;

    }



    renderBranching(component) {

        const options =
            component.properties?.options ?? [];


        return options
            .map(
                (option, index) => `

<button
class="branch-option"
data-branching-id="${component.id}"
data-option-index="${index}">
${option.text ?? ""}
</button>

`
            )
            .join("");

    }



    renderText(component) {

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