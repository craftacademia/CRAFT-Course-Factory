import shutil
import os

base = '/Users/debraj/projects/craft-course-factory 2.0 copy'

# ── 1. Copy mcqRenderer.js to src/runtime/renderers/ ─────────────────────────

src  = os.path.join(base, 'mcqRenderer.js')
dest = os.path.join(base, 'src/runtime/renderers/mcqRenderer.js')
shutil.copy2(src, dest)
print('1. Copied mcqRenderer.js')


# ── 2. Register in registerDefaultRenderers.js ────────────────────────────────

reg_path = os.path.join(base, 'src/runtime/registerDefaultRenderers.js')

with open(reg_path) as f:
    reg = f.read()

if 'mcqRenderer' in reg:
    print('2. MCQRenderer already registered — skipping')
else:
    old = 'import BranchingRenderer from "./renderers/branchingRenderer.js";'
    new = ('import BranchingRenderer from "./renderers/branchingRenderer.js";\n'
           'import MCQRenderer from "./renderers/mcqRenderer.js";')
    assert reg.count(old) == 1, f'import anchor count: {reg.count(old)}'
    reg = reg.replace(old, new)

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
    assert reg.count(old2) == 1, f'register anchor count: {reg.count(old2)}'
    reg = reg.replace(old2, new2)

    with open(reg_path, 'w') as f:
        f.write(reg)
    print('2. Registered MCQRenderer as "MCQ"')


# ── 3. Route MCQ in renderBranchingOptions inside browserRuntime.js ───────────

rt_path = os.path.join(base, 'src/runtime/browser/browserRuntime.js')

with open(rt_path) as f:
    rt = f.read()

if 'MCQ_RENDERER_ROUTED' in rt:
    print('3. MCQ routing already in place — skipping')
else:
    old3 = ('            if (typeof branchingRenderer.bind === "function") {\n\n'
            '                branchingRenderer.bind(\n'
            '                    slot,\n'
            '                    component,\n'
            '                    this\n'
            '                );\n\n'
            '            }')

    new3 = ('            // MCQ uses its own 3-step renderer.\n'
            '            // instant and hotspot use branchingRenderer as before.\n'
            '            // MCQ_RENDERER_ROUTED\n'
            '            const componentStyle = component.properties?.style ?? "instant";\n\n'
            '            if (componentStyle === "mcq") {\n\n'
            '                const mcqRenderer = this.currentPlayer.registry.get("MCQ");\n\n'
            '                if (mcqRenderer && typeof mcqRenderer.bind === "function") {\n\n'
            '                    await mcqRenderer.bind(slot, component, this);\n\n'
            '                    continue;\n\n'
            '                }\n\n'
            '            }\n\n'
            '            if (typeof branchingRenderer.bind === "function") {\n\n'
            '                branchingRenderer.bind(\n'
            '                    slot,\n'
            '                    component,\n'
            '                    this\n'
            '                );\n\n'
            '            }')

    count = rt.count(old3)
    assert count == 1, f'bind anchor count: {count}'
    rt = rt.replace(old3, new3)

    with open(rt_path, 'w') as f:
        f.write(rt)
    print('3. Added MCQ routing in renderBranchingOptions')


print('\nDone — restart Pane-1 and rebuild.')
