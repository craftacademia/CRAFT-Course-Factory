path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/runtime/runtimeBuilder.js'

with open(path) as f:
    content = f.read()

old = '        await fs.copyFile(\n            path.resolve("src/runtime/characterZoomController.js"),\n            path.join(outputDirectory, "characterZoomController.js")\n        );'

new = '        await fs.copyFile(\n            path.join(path.dirname(new URL(import.meta.url).pathname), "../../../runtime/characterZoomController.js"),\n            path.join(outputDirectory, "characterZoomController.js")\n        );'

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
