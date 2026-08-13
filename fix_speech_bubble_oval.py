base = '/Users/debraj/projects/craft-course-factory 2.0 copy'
path = base + '/src/runtime/renderers/dialogueRenderer.js'

new_content = '''import ComponentRenderer from "./componentRenderer.js";


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
'''

with open(path, 'w') as f:
    f.write(new_content)

print('1. dialogueRenderer.js updated')


# ── Update CSS in htmlBuilder.js ──────────────────────────────────────────────
hb_path = base + '/src/providers/rendering/html/htmlBuilder.js'

with open(hb_path) as f:
    content = f.read()

import re

# Replace the entire .dialogue-box block and its ::before/::after with new bubble CSS
# First find from .dialogue-box to end of .dialogue-text block
pattern = r'\.dialogue-box \{[^}]*\}(\s*\.dialogue-box::before \{[^}]*\}\s*\.dialogue-box::after \{[^}]*\})?'
new_css = '''.dialogue-box--plain {
    position:absolute;
    left:10%;
    right:10%;
    bottom:2%;
    background:#ffffff;
    border:3px solid #d71920;
    border-radius:16px;
    padding:14px 18px;
    z-index:10;
    box-shadow:0 4px 16px rgba(0,0,0,0.25);
}

.speech-bubble {
    position:absolute;
    bottom:8%;
    width:55%;
    background:#ffffff;
    border:3px solid #d71920;
    border-radius:50%;
    padding:28px 40px;
    z-index:10;
    display:flex;
    align-items:center;
    justify-content:center;
    min-height:90px;
    box-sizing:border-box;
}

.speech-bubble--right {
    right:3%;
    left:auto;
}

.speech-bubble--left {
    left:3%;
    right:auto;
}

.speech-bubble--right::before {
    content:'';
    position:absolute;
    left:-32px;
    top:50%;
    transform:translateY(-50%);
    border-width:14px 32px 14px 0;
    border-style:solid;
    border-color:transparent #d71920 transparent transparent;
}

.speech-bubble--right::after {
    content:'';
    position:absolute;
    left:-26px;
    top:50%;
    transform:translateY(-50%);
    border-width:11px 26px 11px 0;
    border-style:solid;
    border-color:transparent #ffffff transparent transparent;
}

.speech-bubble--left::before {
    content:'';
    position:absolute;
    right:-32px;
    top:50%;
    transform:translateY(-50%);
    border-width:14px 0 14px 32px;
    border-style:solid;
    border-color:transparent transparent transparent #d71920;
}

.speech-bubble--left::after {
    content:'';
    position:absolute;
    right:-26px;
    top:50%;
    transform:translateY(-50%);
    border-width:11px 0 11px 26px;
    border-style:solid;
    border-color:transparent transparent transparent #ffffff;
}

.speech-bubble-text {
    font-size:17px;
    line-height:1.5;
    color:#222;
    text-align:center;
}'''

result = re.sub(pattern, new_css, content, flags=re.DOTALL)

if result == content:
    # Pattern didn't match — just replace the .dialogue-box block
    # Find it manually
    start = content.find('.dialogue-box {')
    if start == -1:
        print('ERROR: could not find .dialogue-box in htmlBuilder.js')
    else:
        # Find the end of the dialogue-text block
        end = content.find('.dialogue-speaker {', start)
        if end == -1:
            end = start + 500
        # Find end of .dialogue-text block
        dt_start = content.find('.dialogue-text {', start)
        if dt_start != -1:
            dt_end = content.find('}', dt_start) + 1
            result = content[:start] + new_css + '\n\n' + content[dt_end:]
        with open(hb_path, 'w') as f:
            f.write(result)
        print('2. htmlBuilder.js CSS updated (fallback method)')
else:
    with open(hb_path, 'w') as f:
        f.write(result)
    print('2. htmlBuilder.js CSS updated')

print('\nDone — restart Pane-1, rebuild, test a dialogue scene')
