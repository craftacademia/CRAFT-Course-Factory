path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/renderers/mcqRenderer.js'

with open(path) as f:
    content = f.read()

# 1. Set stage to white when bind() starts
old1 = ('        // Hide the scene image when options panel takes over —\n'
        '        // Step 1 (question VO) shows it; Step 2 onwards is white panel only.\n'
        '        const sceneImage = document.querySelector("#craft-stage .image-component");\n'
        '        if (sceneImage) sceneImage.style.display = "none";\n\n')

new1 = ('        // Hide the scene image and set white background for Steps 2 and 3.\n'
        '        const sceneImage = document.querySelector("#craft-stage .image-component");\n'
        '        if (sceneImage) sceneImage.style.display = "none";\n'
        '        const stage = document.querySelector("#craft-stage");\n'
        '        if (stage) stage.style.background = "#ffffff";\n\n')

assert content.count(old1) == 1, f'anchor1 count: {content.count(old1)}'
content = content.replace(old1, new1)

# 2. Center the feedback box vertically on white background
old2 = ('        slot.innerHTML = feedbackLine\n'
        '            ? `<div class="dialogue-box" style="position:relative;bottom:auto;left:auto;right:auto;width:90%;margin:30px auto 0 auto;box-sizing:border-box;">\n'
        '                   <div class="dialogue-speaker">${feedbackLine.speaker ?? "NAR"}</div>\n'
        '                   <div class="dialogue-text">${feedbackLine.text ?? ""}</div>\n'
        '               </div>`\n'
        '            : "";')

new2 = ('        slot.innerHTML = feedbackLine\n'
        '            ? `<div style="position:absolute;inset:0;background:#ffffff;display:flex;align-items:center;justify-content:center;padding:40px;">\n'
        '                   <div class="dialogue-box" style="position:relative;bottom:auto;left:auto;right:auto;width:90%;max-width:800px;box-sizing:border-box;">\n'
        '                       <div class="dialogue-speaker">${feedbackLine.speaker ?? "NAR"}</div>\n'
        '                       <div class="dialogue-text">${feedbackLine.text ?? ""}</div>\n'
        '                   </div>\n'
        '               </div>`\n'
        '            : "";')

assert content.count(old2) == 1, f'anchor2 count: {content.count(old2)}'
content = content.replace(old2, new2)

with open(path, 'w') as f:
    f.write(content)

print('Done')
