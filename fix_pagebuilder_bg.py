path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/presentation/builders/pageBuilder.js'

with open(path) as f:
    content = f.read()

old = """            // Any screen presenting an options-selection interaction
            // (Branching, in any of its "instant"/"mcq"/"hotspot"
            // styles) is intentionally clean — no background image,
            // just the question and options on white. This applies
            // even if the script provides a SCENE=/LOCATION=/ASSET_REF=
            // for that screen — the reference is deliberately ignored.
            const hasOptionsSelection =
                (screen.branching?.options?.length ?? 0) > 0;


            if (screenImage && !hasOptionsSelection) {"""

new = """            // MCQ and Hotspot are standalone decision screens with no
            // surrounding scene narrative — clean white panel, no image,
            // even if the script provides a SCENE=/LOCATION=/ASSET_REF=.
            // instant-style branching is different: it is a choice
            // presented mid-conversation, layered over dialogue that is
            // still playing out in the scene, so the background image
            // stays for that style.
            const isStandaloneDecisionScreen =
                ["mcq", "hotspot"].includes(
                    screen.branching?.style ?? ""
                );


            if (screenImage && !isStandaloneDecisionScreen) {"""

count = content.count(old)
assert count == 1, f'anchor not found or not unique — count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
