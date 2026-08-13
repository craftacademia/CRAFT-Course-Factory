path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/presentation/builders/pageBuilder.js'

with open(path) as f:
    content = f.read()

old = '                ["hotspot"].includes(\n                    screen.branching?.style ?? ""\n                );'
new = '                false; // Hotspot shows location image during question VO (Step 1)\n                // Image is hidden by hotspotRenderer.bind() for Steps 2-4'

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
