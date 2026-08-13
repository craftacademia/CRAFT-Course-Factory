import shutil
import os

base = '/Users/debraj/projects/craft-course-factory 2.0 copy'

# ── 1. Copy mcqRenderer.js into the renderers folder ─────────────────────────

src  = os.path.join(base, 'mcqRenderer.js')
dest = os.path.join(base, 'src/runtime/renderers/mcqRenderer.js')

shutil.copy2(src, dest)
print('1. Copied mcqRenderer.js to renderers folder')


# ── 2. Register MCQ_FLOW in registerDefaultRenderers.js ──────────────────────

reg_path = os.path.join(base, 'src/runtime/registerDefaultRenderers.js')

with open(reg_path) as f:
    reg = f.read()

if 'mcqRenderer' not in reg:

    old_import = 'import BranchingRenderer from "./renderers/branchingRenderer.js";'
    new_import = ('import BranchingRenderer from "./renderers/branchingRenderer.js";\n'
                  'import MCQRenderer from "./renderers/mcqRenderer.js";')

    assert reg.count(old_import) == 1, f'import anchor not unique'
    reg = reg.replace(old_import, new_import)

    old_register = ('    registry.register(\n'
                    '        "BRANCHING",\n'
                    '        new BranchingRenderer()\n'
                    '    );')
    new_register  = ('    registry.register(\n'
                     '        "BRANCHING",\n'
                     '        new BranchingRenderer()\n'
                     '    );\n\n\n'
                     '    registry.register(\n'
                     '        "MCQ_FLOW",\n'
                     '        new MCQRenderer()\n'
                     '    );')

    assert reg.count(old_register) == 1, f'register anchor not unique'
    reg = reg.replace(old_register, new_register)

    with open(reg_path, 'w') as f:
        f.write(reg)

    print('2. Registered MCQRenderer in registerDefaultRenderers.js')

else:
    print('2. MCQRenderer already registered — skipping')


# ── 3. Update browserRuntime.js: route MCQ through MCQRenderer.bind() ────────
#    Replace the hasMCQ block to call the renderer's bind() method directly,
#    same pattern as branchingRenderer.bind() which already works for instant/hotspot.

rt_path = os.path.join(base, 'src/runtime/browser/browserRuntime.js')

with open(rt_path) as f:
    rt = f.read()

old_block = """        // MCQ uses a dedicated 3-step flow (question → options → feedback).
        // All other branching styles (instant, hotspot) use the standard path.
        const hasMCQ =
            (this.currentPlayer?.branchingQueue ?? [])
            .some(c => c.properties?.style === "mcq");

        if (hasMCQ) {
            await this.renderMCQFlow(page);
        } else {
            await this.renderBranchingOptions(page);
        }"""

new_block = """        await this.renderBranchingOptions(page);"""

assert rt.count(old_block) == 1, f'hasMCQ block not unique — count: {rt.count(old_block)}'
rt = rt.replace(old_block, new_block)

with open(rt_path, 'w') as f:
    f.write(rt)

print('3. Removed hasMCQ routing — MCQ now handled inside renderBranchingOptions via renderer')


# ── 4. Update renderBranchingOptions to call MCQRenderer.bind() for mcq style ─

with open(rt_path) as f:
    rt = f.read()

# Find the bind call inside renderBranchingOptions and add MCQ routing
old_bind = """            if (typeof branchingRenderer.bind === "function") {

                branchingRenderer.bind(
                    slot,
                    component,
                    this
                );

            }"""

new_bind = """            // MCQ uses its own renderer with a full async 3-step flow.
            // instant and hotspot use branchingRenderer as before.
            const componentStyle =
                component.properties?.style ?? "instant";

            if (componentStyle === "mcq") {

                const mcqRenderer =
                    this.currentPlayer.registry.get("MCQ_FLOW");

                if (mcqRenderer && typeof mcqRenderer.bind === "function") {

                    // Skip the option VO loop below — MCQRenderer handles it
                    await mcqRenderer.bind(slot, component, this);

                    continue;

                }

            }

            if (typeof branchingRenderer.bind === "function") {

                branchingRenderer.bind(
                    slot,
                    component,
                    this
                );

            }"""

assert rt.count(old_bind) == 1, f'bind anchor not unique — count: {rt.count(old_bind)}'
rt = rt.replace(old_bind, new_bind)

with open(rt_path, 'w') as f:
    f.write(rt)

print('4. Added MCQ routing inside renderBranchingOptions')
print()
print('Done — restart Pane-1 and rebuild.')
