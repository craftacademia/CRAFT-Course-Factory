path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/lexer/lexerProvider.js'

with open(path) as f:
    content = f.read()

old = '                    currentContext?.name === "LINE" ||\n                    currentContext?.name === "OPTION"'
new = '                    currentContext?.name === "LINE" ||\n                    currentContext?.name === "OPTION" ||\n                    currentContext?.name === "HOTSPOT_ITEM"'

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
