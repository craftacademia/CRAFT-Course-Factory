path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/lexer/lexerProvider.js'

with open(path) as f:
    content = f.read()

if 'HOTSPOT_ITEM_INLINE' in content:
    print('Already patched')
else:
    old = """            if (!text) {
                continue;
            }



            if (tagRegex.test(text)) {"""

    new = """            if (!text) {
                continue;
            }


            // HOTSPOT_ITEM_INLINE
            // Handle inline tags: [TAG attrs]content[/TAG] all on one line.
            // tagRegex only matches pure-tag lines so inline patterns would
            // otherwise be lost. Split into OPEN_TAG + TEXT + CLOSE_TAG.
            const inlineMatch = text.match(
                /^(\\[[A-Z_][A-Z0-9_]*[^\\]]*\\])(.+?)(\\[\\/[A-Z_][A-Z0-9_]*\\])$/
            );

            if (inlineMatch) {

                const parsedOpen = this.tagParser.parse(inlineMatch[1]);
                const innerText  = inlineMatch[2].trim();
                const closeName  = inlineMatch[3].replace('[/', '').replace(']', '').trim();

                tokens.push({ type: 'OPEN_TAG',  line: line.number, name: parsedOpen.tag, attributes: parsedOpen.attributes });
                if (innerText) tokens.push({ type: 'TEXT', line: line.number, value: innerText });
                tokens.push({ type: 'CLOSE_TAG', line: line.number, name: closeName });

                continue;

            }


            if (tagRegex.test(text)) {"""

    count = content.count(old)
    assert count == 1, f'anchor not unique — count: {count}'
    content = content.replace(old, new)

    with open(path, 'w') as f:
        f.write(content)

    print('Done — lexer patched')
