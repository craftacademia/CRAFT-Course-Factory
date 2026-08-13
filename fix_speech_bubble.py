path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/html/htmlBuilder.js'

with open(path) as f:
    content = f.read()

# Find the closing brace of .dialogue-box and add ::before and ::after after it
old = """.dialogue-box {
    position:absolute;
    left:10%;
    right:10%;
    bottom:2%;"""

new = """.dialogue-box {
    position:absolute;
    left:10%;
    right:10%;
    bottom:2%;"""

# Just append bubble tail CSS after the dialogue-box closing brace
bubble_css = """

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

# Find end of .dialogue-box block and insert after it
import re
pattern = r'(\.dialogue-box \{[^}]*\})'
match = re.search(pattern, content)
if match:
    insert_pos = match.end()
    content = content[:insert_pos] + bubble_css + content[insert_pos:]
    with open(path, 'w') as f:
        f.write(content)
    print('Done')
else:
    print('ERROR: could not find .dialogue-box block')
