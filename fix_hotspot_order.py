path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/browser/browserRuntime.js'

with open(path) as f:
    lines = f.readlines()

# Find the two lines and swap them
branch_idx = None
hotspot_idx = None

for i, line in enumerate(lines):
    if 'await this.renderBranchingOptions(page)' in line:
        branch_idx = i
    if 'await this.renderHotspotPanel(page)' in line:
        hotspot_idx = i

assert branch_idx is not None, 'renderBranchingOptions not found'
assert hotspot_idx is not None, 'renderHotspotPanel not found'
assert branch_idx < hotspot_idx, f'Already in right order: branch={branch_idx}, hotspot={hotspot_idx}'

# Swap the two lines
lines[branch_idx], lines[hotspot_idx] = lines[hotspot_idx], lines[branch_idx]

with open(path, 'w') as f:
    f.writelines(lines)

print(f'Done — swapped lines {branch_idx} and {hotspot_idx}')
