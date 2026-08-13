path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/browser/browserRuntime.js'

with open(path) as f:
    content = f.read()

# Just find the isMounted line and insert after it
old = "        this.isMounted = true;\n"
new  = "        this.isMounted = true;\n        window.__craftRuntime = this;\n"

count = content.count(old)
assert count == 1, f'anchor not unique — count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
