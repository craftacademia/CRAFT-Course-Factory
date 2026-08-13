path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/scorm/scormBuilder.js'

with open(path) as f:
    content = f.read()

old = ("import { createWriteStream } from 'fs';\n"
       "import { createRequire } from 'module';\n"
       "const require = createRequire(import.meta.url);\n"
       "const archiver = require('archiver');")

new = "import { createWriteStream } from 'fs';\nimport archiver from 'archiver';"

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
