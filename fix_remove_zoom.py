path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/html/htmlBuilder.js'

with open(path) as f:
    content = f.read()

import re

# Remove the entire inline zoom script block
pattern = r'\n*<script>\n\(function\(\) \{.*?\}\)\(\);\n</script>'
cleaned = re.sub(pattern, '', content, flags=re.DOTALL)

if cleaned == content:
    print('ERROR: zoom script not found')
else:
    with open(path, 'w') as f:
        f.write(cleaned)
    print('Done — zoom script removed')
