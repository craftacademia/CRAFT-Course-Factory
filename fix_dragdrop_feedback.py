path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/renderers/dragDropRenderer.js'

with open(path) as f:
    content = f.read()

old = """                    if (feedbackLine) {


                        const audioAsset =
                            typeof runtime.findDialogueAudio === "function"
                            ? runtime.findDialogueAudio(feedbackLine.voiceId)"""

new = """                    if (feedbackLine) {

                        // Show feedback text on white centered panel
                        const dragDropSlot =
                            runtime.rootElement?.querySelector("#dragdrop-slot");

                        if (dragDropSlot) {
                            dragDropSlot.innerHTML = `
<div style="position:absolute;inset:0;background:#ffffff;display:flex;align-items:center;justify-content:center;padding:40px;z-index:20;">
    <div class="dialogue-box" style="position:relative;bottom:auto;left:auto;right:auto;width:90%;max-width:800px;box-sizing:border-box;">
        <div class="dialogue-speaker">${feedbackLine.speaker ?? "NAR"}</div>
        <div class="dialogue-text">${feedbackLine.text ?? ""}</div>
    </div>
</div>`;
                        }

                        const stage = document.querySelector("#craft-stage");
                        if (stage) stage.style.background = "#ffffff";

                        const audioAsset =
                            typeof runtime.findDialogueAudio === "function"
                            ? runtime.findDialogueAudio(feedbackLine.voiceId)"""

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
