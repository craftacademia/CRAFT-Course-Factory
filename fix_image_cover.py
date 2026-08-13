path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/html/htmlBuilder.js'

with open(path) as f:
    lines = f.readlines()

changed = 0
for i in [240, 398]:  # 0-indexed (lines 241 and 399)
    if 'object-fit:contain' in lines[i]:
        lines[i] = lines[i].replace('object-fit:contain', 'object-fit:cover')
        changed += 1

with open(path, 'w') as f:
    f.writelines(lines)

print(f'Done — changed {changed} lines')
