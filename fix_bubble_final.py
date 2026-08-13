path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/html/htmlBuilder.js'

with open(path) as f:
    lines = f.readlines()

# Remove animation and keyframes lines
skip_keywords = [
    'animation: charBreath',
    '@keyframes charBreath',
    'transform: scale(1.0)',
    'transform: scale(1.10)',
]

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    if any(kw in line for kw in skip_keywords):
        i += 1
        continue
    new_lines.append(line)
    i += 1

content = ''.join(new_lines)

# Add speech bubble if not already there
if '.dialogue-box::before' not in content:
    import re
    match = re.search(r'\.dialogue-box \{[^}]*\}', content)
    if match:
        bubble = """
.dialogue-box::before {
    content:'';
    position:absolute;
    top:-22px;
    left:60px;
    border-width:0 12px 22px 12px;
    border-style:solid;
    border-color:transparent transparent #d71920 transparent;
}

.dialogue-box::after {
    content:'';
    position:absolute;
    top:-17px;
    left:63px;
    border-width:0 9px 18px 9px;
    border-style:solid;
    border-color:transparent transparent #ffffff transparent;
}"""
        pos = match.end()
        content = content[:pos] + bubble + content[pos:]
        print('Speech bubble added')
    else:
        print('ERROR: dialogue-box not found')
else:
    print('Speech bubble already present')

with open(path, 'w') as f:
    f.write(content)

print('Done')
