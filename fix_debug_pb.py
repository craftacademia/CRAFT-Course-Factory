path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/presentation/builders/pageBuilder.js'

with open(path) as f:
    content = f.read()

old = '            const feedbackVoiceIds ='
new = '            console.log("[PAGEBUILDER] hotspotItems:", screen.hotspotItems?.length, "branching feedback:", screen.branching?.feedback?.correct?.voiceId);\n            const feedbackVoiceIds ='

assert content.count(old) == 1
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
