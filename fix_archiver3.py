path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/scorm/scormBuilder.js'

with open(path) as f:
    content = f.read()

old = "import { createWriteStream } from 'fs';\nimport archiver from 'archiver';"
new = "import { createWriteStream } from 'fs';\nimport * as archiverModule from 'archiver';\nconst archiver = archiverModule.default || archiverModule;"

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
