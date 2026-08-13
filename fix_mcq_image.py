path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/presentation/builders/pageBuilder.js'

with open(path) as f:
    content = f.read()

old = '                ["mcq", "hotspot"].includes('
new = '                ["hotspot"].includes('

count = content.count(old)
assert count == 1, f'anchor not unique — count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
