path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/scorm/scormBuilder.js'

with open(path) as f:
    content = f.read()

old = "        const scormSrcPath = path.resolve('src/runtime/scorm.js');"
new = "        const scormSrcPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../../../runtime/scorm.js');"

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
