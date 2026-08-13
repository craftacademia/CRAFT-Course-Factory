path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/presentation/builders/pageBuilder.js'

with open(path) as f:
    content = f.read()

old = """            if (
                screen.branching &&
                screen.branching.options?.length > 0
            ) {"""

new = """            // Suppress the standalone BRANCHING component for HOTSPOT screens —
            // the branching data is already embedded inside HOTSPOT_PANEL.properties.branching
            // and handled entirely by HotspotRenderer. Emitting it here would cause
            // renderBranchingOptions to fire the option VOs before the hotspot panel appears.
            const isHotspotScreen =
                (screen.hotspotItems?.length ?? 0) > 0;

            if (
                screen.branching &&
                screen.branching.options?.length > 0 &&
                !isHotspotScreen
            ) {"""

count = content.count(old)
assert count == 1, f'anchor not unique — count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
