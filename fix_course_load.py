path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/runtime.js'
with open(path) as f:
    content = f.read()
old = "    if (window.PIR) return window.PIR;\n    const res = await fetch(\"./data/course.json\");\n    return res.json();"
new = "    try {\n        const res = await fetch(\"./data/course.json\");\n        if (res.ok) return res.json();\n    } catch(e) {}\n    if (window.PIR) return window.PIR;\n    throw new Error(\"No course data found\");"
count = content.count(old)
assert count == 1, f'count: {count}'
content = content.replace(old, new)
with open(path, 'w') as f:
    f.write(content)
print('Done')
