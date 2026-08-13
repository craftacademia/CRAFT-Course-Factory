path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/scorm/scormBuilder.js'

with open(path) as f:
    content = f.read()

old = "import archiver from 'archiver';\nimport { createWriteStream } from 'fs';"
new = "import { createWriteStream } from 'fs';\nimport { createRequire } from 'module';\nconst require = createRequire(import.meta.url);\nconst archiver = require('archiver');"

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
