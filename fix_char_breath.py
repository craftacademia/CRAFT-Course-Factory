path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/html/htmlBuilder.js'

with open(path) as f:
    content = f.read()

old = """.image-component {

    position:absolute;

    inset:0;

    width:100%;

    height:100%;

    object-fit:contain;

    display:block;

    z-index:1;

}"""

new = """.image-component {

    position:absolute;

    inset:0;

    width:100%;

    height:100%;

    object-fit:contain;

    display:block;

    z-index:1;

    animation: charBreath 3s ease-in-out infinite;

    transform-origin: center center;

}

@keyframes charBreath {

    0%, 100% { transform: scale(1.0); }

    50%       { transform: scale(1.10); }

}"""

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
