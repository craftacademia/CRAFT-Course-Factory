import ComponentRenderer from "./componentRenderer.js";


export default class DialogueRenderer extends ComponentRenderer {


    render(component, context) {


        const speaker =
            component.properties?.speaker ?? "";


        const text =
            component.properties?.text ?? "";


        const expression =
            component.properties?.expression ?? "";



        context.append(`

<div 
    class="dialogue-box"
    data-character="${expression}"
>


    <div class="dialogue-line">


        ${
            speaker
            ?
            `
            <div class="dialogue-speaker">
                ${speaker}
            </div>
            `
            :
            ""
        }


        <div class="dialogue-text">
            ${text}
        </div>


    </div>


</div>

`);

    }

}