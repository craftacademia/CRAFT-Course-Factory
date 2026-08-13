path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/presentation/builders/pageBuilder.js'

with open(path) as f:
    content = f.read()

old = """                        screen.branching?.feedback?.correct,
                        screen.branching?.feedback?.incorrect,
                        ...((screen.hotspotItems?.length ?? 0) > 0 && screen.branching
                            ? [screen.branching.feedback?.correct, screen.branching.feedback?.incorrect]
                            : [])"""

new = """                        screen.branching?.feedback?.correct,
                        screen.branching?.feedback?.incorrect,
                        screen.hotspotItems?.length > 0 ? screen.branching?.feedback?.correct  : null,
                        screen.hotspotItems?.length > 0 ? screen.branching?.feedback?.incorrect : null"""

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
