import ComponentRenderer from "./componentRenderer.js";


// Speakers on the LEFT side of scene — bubble goes RIGHT, tail points LEFT
const LEFT_SPEAKERS = new Set(["RAV"]);

// Speakers on the RIGHT side — bubble goes LEFT, tail points RIGHT
const RIGHT_SPEAKERS = new Set(["SHA", "MRS"]);


export default class DialogueRenderer extends ComponentRenderer {


    render(component, context) {

        const speaker   = component.properties?.speaker    ?? "";
        const text      = component.properties?.text       ?? "";
        const expression = component.properties?.expression ?? "";

        // NAR gets no bubble — just the microphone badge (handled by speakerBadgeRenderer)
        if (speaker === "NAR" || (!LEFT_SPEAKERS.has(speaker) && !RIGHT_SPEAKERS.has(speaker))) {

            // Fallback: plain text box for unknown speakers
            context.append(`
<div
    class="dialogue-box dialogue-box--plain"
    data-character="${expression}"
>
    <div class="dialogue-line">
        <div class="dialogue-text">${text}</div>
    </div>
</div>
`);
            return;

        }

        const isLeft = LEFT_SPEAKERS.has(speaker);

        // Bubble on the opposite side from the speaker
        // LEFT speaker (RAV) → bubble on RIGHT side
        // RIGHT speaker (SHA/MRS) → bubble on LEFT side
        const bubbleClass = isLeft
            ? "speech-bubble speech-bubble--right"
            : "speech-bubble speech-bubble--left";

        context.append(`
<div
    class="${bubbleClass}"
    data-character="${expression}"
    data-speaker="${speaker}"
>
    <div class="speech-bubble-text">${text}</div>
</div>
`);

    }

}
