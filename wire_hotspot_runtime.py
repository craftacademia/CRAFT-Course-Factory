import shutil

base = '/Users/debraj/projects/craft-course-factory 2.0 copy'

shutil.copy2(base + '/hotspotRenderer.js', base + '/src/runtime/renderers/hotspotRenderer.js')
print('1. Copied hotspotRenderer.js')

reg_path = base + '/src/runtime/registerDefaultRenderers.js'
with open(reg_path) as f:
    reg = f.read()

if 'hotspotRenderer' in reg:
    print('2. Already registered — skipping')
else:
    old = 'import MCQRenderer from "./renderers/mcqRenderer.js";'
    new = 'import MCQRenderer from "./renderers/mcqRenderer.js";\nimport HotspotRenderer from "./renderers/hotspotRenderer.js";'
    assert reg.count(old) == 1
    reg = reg.replace(old, new)

    old2 = '    registry.register(\n        "MCQ",\n        new MCQRenderer()\n    );'
    new2 = '    registry.register(\n        "MCQ",\n        new MCQRenderer()\n    );\n\n\n    registry.register(\n        "HOTSPOT_PANEL",\n        new HotspotRenderer()\n    );'
    assert reg.count(old2) == 1
    reg = reg.replace(old2, new2)

    with open(reg_path, 'w') as f:
        f.write(reg)
    print('2. Registered HotspotRenderer')

rt_path = base + '/src/runtime/browser/browserRuntime.js'
with open(rt_path) as f:
    rt = f.read()

if 'HOTSPOT_PANEL_ROUTED' in rt:
    print('3. Already wired — skipping')
else:
    old3 = '        await this.renderBranchingOptions(page);'
    new3 = '        await this.renderHotspotPanel(page);\n\n        await this.renderBranchingOptions(page);'
    assert rt.count(old3) == 1
    rt = rt.replace(old3, new3)

    old4 = '    renderTabPanel(page) {'
    new4 = '''    async renderHotspotPanel(page) {

        // HOTSPOT_PANEL_ROUTED
        const hotspotQueue = [...(this.currentPlayer?.componentIndex?.values() ?? [])]
            .filter(c => c.type === "HOTSPOT_PANEL");

        if (hotspotQueue.length === 0) return;

        const slot = this.rootElement.querySelector("#branching-slot");
        if (!slot) return;

        const renderer = this.currentPlayer.registry.get("HOTSPOT_PANEL");
        if (!renderer) return;

        for (const component of hotspotQueue) {
            await renderer.bind(slot, component, this);
        }

    }



    renderTabPanel(page) {'''

    assert rt.count(old4) == 1
    rt = rt.replace(old4, new4)

    with open(rt_path, 'w') as f:
        f.write(rt)
    print('3. Added renderHotspotPanel to browserRuntime.js')

print('\nDone — restart Pane-1, rebuild, test S15')
