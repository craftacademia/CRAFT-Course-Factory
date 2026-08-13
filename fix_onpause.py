path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/browser/browserRuntime.js'

with open(path) as f:
    content = f.read()

old = """                        audio.onpause =
                            resolve;"""

new = """                        audio.onpause =
                            () => { if (!this._paused) resolve(); };"""

count = content.count(old)
assert count == 3, f'onpause anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
