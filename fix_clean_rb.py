import re
path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/runtime/runtimeBuilder.js'
with open(path) as f:
    content = f.read()

content = re.sub(r'let isPaused = false;\n', '', content)
content = re.sub(r'\s*isPaused = !isPaused;\n', '', content)
content = re.sub(r'\s*isPaused = false;\n', '', content)
content = re.sub(r'\s*if \(isPaused\) \{.*?\} else \{.*?\}\n', '', content, flags=re.DOTALL)

with open(path, 'w') as f:
    f.write(content)
print('Done')
