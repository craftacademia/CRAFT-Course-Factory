path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/browser/browserRuntime.js'

with open(path) as f:
    content = f.read()

old = '        window.__craftRuntime = this;\n'

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, '')

with open(path, 'w') as f:
    f.write(content)

print('Done')
