path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/registerDefaultRenderers.js'

with open(path) as f:
    content = f.read()

if 'mcqRenderer' in content:
    print('Already registered')
else:
    old = 'import BranchingRenderer from "./renderers/branchingRenderer.js";'
    new = ('import BranchingRenderer from "./renderers/branchingRenderer.js";\n'
           'import MCQRenderer from "./renderers/mcqRenderer.js";')
    assert content.count(old) == 1
    content = content.replace(old, new)

    old2 = ('    registry.register(\n'
            '        "BRANCHING",\n'
            '        new BranchingRenderer()\n'
            '    );')
    new2 = ('    registry.register(\n'
            '        "BRANCHING",\n'
            '        new BranchingRenderer()\n'
            '    );\n\n\n'
            '    registry.register(\n'
            '        "MCQ",\n'
            '        new MCQRenderer()\n'
            '    );')
    assert content.count(old2) == 1
    content = content.replace(old2, new2)

    with open(path, 'w') as f:
        f.write(content)
    print('Done')
