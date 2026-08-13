path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/renderers/mcqRenderer.js'

with open(path) as f:
    content = f.read()

old = '        const options  = component.properties?.options  ?? [];'
new = ('        // Hide the scene image when options panel takes over —\n'
       '        // Step 1 (question VO) shows it; Step 2 onwards is white panel only.\n'
       '        const sceneImage = slot.closest("#craft-stage, [id]")?.querySelector?.(".image-component");\n'
       '        if (sceneImage) sceneImage.style.display = "none";\n\n'
       '        const options  = component.properties?.options  ?? [];')

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
