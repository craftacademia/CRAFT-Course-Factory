import shutil

base = '/Users/debraj/projects/craft-course-factory 2.0 copy'

# ── 1. Copy renderer ──────────────────────────────────────────────────────────
shutil.copy2(base + '/courseAnalyticsRenderer.js', base + '/src/runtime/renderers/courseAnalyticsRenderer.js')
print('1. Copied courseAnalyticsRenderer.js')


# ── 2. ccirProvider.js — parse COURSE_ANALYTICS + SCORE_BAND ─────────────────
ccir_path = base + '/src/providers/ccir/ccirProvider.js'

with open(ccir_path) as f:
    ccir = f.read()

if 'COURSE_ANALYTICS' in ccir:
    print('2. Already in ccirProvider — skipping')
else:
    old = """            const scoreCheckpoint =
                (screenType ?? "").toUpperCase() === "SCORE_CHECKPOINT"
                ? {

                    checkpointId:
                    this.attr(node, "checkpoint_id", "CHECKPOINT_ID"),


                    moduleName:
                    this.attr(node, "module_name", "MODULE_NAME") ?? "",


                    max:
                    Number(
                        this.attr(node, "max", "MAX")
                    ) || 0

                }
                : null;"""

    new = """            const scoreCheckpoint =
                (screenType ?? "").toUpperCase() === "SCORE_CHECKPOINT"
                ? {

                    checkpointId:
                    this.attr(node, "checkpoint_id", "CHECKPOINT_ID"),


                    moduleName:
                    this.attr(node, "module_name", "MODULE_NAME") ?? "",


                    max:
                    Number(
                        this.attr(node, "max", "MAX")
                    ) || 0

                }
                : null;


            // COURSE_ANALYTICS screen
            const isCourseAnalytics =
                (screenType ?? "").toUpperCase() === "COURSE_ANALYTICS";

            const courseAnalyticsBands =
                isCourseAnalytics
                ? (node.children ?? [])
                    .filter(c => c.type === "SCORE_BAND")
                    .map(b => ({
                        min:    Number(this.attr(b, "min", "MIN") ?? 0),
                        max:    Number(this.attr(b, "max", "MAX") ?? 100),
                        remark: this.attr(b, "remark", "REMARK") ?? ""
                    }))
                : null;

            const courseAnalyticsPassScore =
                isCourseAnalytics
                ? Number(this.attr(node, "pass_score", "PASS_SCORE") ?? 70)
                : null;"""

    count = ccir.count(old)
    assert count == 1, f'scoreCheckpoint anchor count: {count}'
    ccir = ccir.replace(old, new)

    # Add to screens.push()
    old2 = """                scoreCheckpoint,"""
    new2 = """                scoreCheckpoint,

                courseAnalytics: isCourseAnalytics ? {
                    passScore: courseAnalyticsPassScore,
                    bands: courseAnalyticsBands
                } : null,"""

    count2 = ccir.count(old2)
    assert count2 == 1, f'scoreCheckpoint push anchor count: {count2}'
    ccir = ccir.replace(old2, new2)

    with open(ccir_path, 'w') as f:
        f.write(ccir)
    print('2. ccirProvider updated')


# ── 3. pageBuilder.js — emit COURSE_ANALYTICS component ──────────────────────
pb_path = base + '/src/providers/presentation/builders/pageBuilder.js'

with open(pb_path) as f:
    pb = f.read()

if 'COURSE_ANALYTICS' in pb:
    print('3. Already in pageBuilder — skipping')
else:
    old3 = """            if (screen.hotspotItems && screen.hotspotItems.length > 0) {"""

    new3 = """            if (screen.courseAnalytics) {

                components.push(
                    this.componentBuilder.build("COURSE_ANALYTICS", {
                        id: `COURSE_ANALYTICS_${screen.id}`,
                        properties: {
                            passScore: screen.courseAnalytics.passScore,
                            bands:     screen.courseAnalytics.bands ?? []
                        }
                    })
                );

            }


            if (screen.hotspotItems && screen.hotspotItems.length > 0) {"""

    count3 = pb.count(old3)
    assert count3 == 1, f'hotspotItems anchor count: {count3}'
    pb = pb.replace(old3, new3)

    with open(pb_path, 'w') as f:
        f.write(pb)
    print('3. pageBuilder updated')


# ── 4. registerDefaultRenderers.js ───────────────────────────────────────────
reg_path = base + '/src/runtime/registerDefaultRenderers.js'

with open(reg_path) as f:
    reg = f.read()

if 'courseAnalyticsRenderer' in reg:
    print('4. Already registered — skipping')
else:
    old4 = 'import HotspotRenderer from "./renderers/hotspotRenderer.js";'
    new4 = ('import HotspotRenderer from "./renderers/hotspotRenderer.js";\n'
            'import CourseAnalyticsRenderer from "./renderers/courseAnalyticsRenderer.js";')
    assert reg.count(old4) == 1
    reg = reg.replace(old4, new4)

    old5 = ('    registry.register(\n'
            '        "HOTSPOT_PANEL",\n'
            '        new HotspotRenderer()\n'
            '    );')
    new5 = ('    registry.register(\n'
            '        "HOTSPOT_PANEL",\n'
            '        new HotspotRenderer()\n'
            '    );\n\n\n'
            '    registry.register(\n'
            '        "COURSE_ANALYTICS",\n'
            '        new CourseAnalyticsRenderer()\n'
            '    );')
    assert reg.count(old5) == 1
    reg = reg.replace(old5, new5)

    with open(reg_path, 'w') as f:
        f.write(reg)
    print('4. Registered CourseAnalyticsRenderer')


# ── 5. browserRuntime.js — wire renderCourseAnalytics ────────────────────────
rt_path = base + '/src/runtime/browser/browserRuntime.js'

with open(rt_path) as f:
    rt = f.read()

if 'COURSE_ANALYTICS_ROUTED' in rt:
    print('5. Already wired — skipping')
else:
    old6 = '        await this.renderHotspotPanel(page);'
    new6 = ('        await this.renderCourseAnalytics(page);\n\n'
            '        await this.renderHotspotPanel(page);')
    assert rt.count(old6) == 1
    rt = rt.replace(old6, new6)

    old7 = '    async renderHotspotPanel(page) {'
    new7 = '''    async renderCourseAnalytics(page) {

        // COURSE_ANALYTICS_ROUTED
        const analyticsQueue = [...(this.currentPlayer?.componentIndex?.values() ?? [])]
            .filter(c => c.type === "COURSE_ANALYTICS");

        if (analyticsQueue.length === 0) return;

        const slot = this.rootElement.querySelector("#branching-slot");
        if (!slot) return;

        const renderer = this.currentPlayer.registry.get("COURSE_ANALYTICS");
        if (!renderer) return;

        // Hide scene image, set white background
        const sceneImage = document.querySelector("#craft-stage .image-component");
        if (sceneImage) sceneImage.style.display = "none";
        const stage = document.querySelector("#craft-stage");
        if (stage) stage.style.background = "#f0f4f8";

        for (const component of analyticsQueue) {
            await renderer.bind(slot, component, this);
        }

    }



    async renderHotspotPanel(page) {'''

    assert rt.count(old7) == 1
    rt = rt.replace(old7, new7)

    with open(rt_path, 'w') as f:
        f.write(rt)
    print('5. Added renderCourseAnalytics to browserRuntime.js')


print('\nDone — restart Pane-1, rebuild, test COURSE_ANALYTICS screen')
