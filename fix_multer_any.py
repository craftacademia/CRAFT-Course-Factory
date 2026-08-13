path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/server.js'

with open(path) as f:
    content = f.read()

old = '    upload.any(),'
new = """    upload.any(),
    (req, res, next) => {
        if (Array.isArray(req.files)) {
            const obj = {};
            req.files.forEach(f => {
                if (!obj[f.fieldname]) obj[f.fieldname] = [];
                obj[f.fieldname].push(f);
            });
            req.files = obj;
        }
        next();
    },"""

count = content.count(old)
assert count == 1, f'count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)
print('Done')
