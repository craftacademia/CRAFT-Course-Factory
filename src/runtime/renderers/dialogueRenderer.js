import ComponentRenderer from "./componentRenderer.js";

const LEFT_SPEAKERS  = new Set(["RAV"]);
const RIGHT_SPEAKERS = new Set(["SHA", "MRS"]);

export default class DialogueRenderer extends ComponentRenderer {

    render(component, context) {

        const speaker    = component.properties?.speaker    ?? "";
        const text       = component.properties?.text       ?? "";
        const expression = component.properties?.expression ?? "";

        if (speaker === "NAR") {
            context.append(`
<div class="dialogue-box" data-character="${expression}">
    <div class="dialogue-text">${text}</div>
</div>
`);
            return;
        }

        context.append(`
<div class="dialogue-box" data-character="${expression}" data-speaker="${speaker}">
    <div class="dialogue-text">${text}</div>
</div>
`);

    }

}
