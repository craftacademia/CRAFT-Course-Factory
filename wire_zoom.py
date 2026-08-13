import shutil

base = '/Users/debraj/projects/craft-course-factory 2.0 copy'

# ── 1. Copy characterZoomController.js to src/runtime/ ───────────────────────
shutil.copy2(
    base + '/characterZoomController.js',
    base + '/src/runtime/characterZoomController.js'
)
print('1. Copied characterZoomController.js to src/runtime/')


# ── 2. Add script tag to htmlBuilder.js ──────────────────────────────────────
hb_path = base + '/src/providers/rendering/html/htmlBuilder.js'

with open(hb_path) as f:
    content = f.read()

if 'characterZoomController' in content:
    print('2. Already in htmlBuilder — skipping')
else:
    old = '<script type="module" src="runtime.js"></script>'
    new = ('<script type="module" src="runtime.js"></script>\n\n\n'
           '<script src="characterZoomController.js"></script>')
    assert content.count(old) == 1, f'anchor count: {content.count(old)}'
    content = content.replace(old, new)
    with open(hb_path, 'w') as f:
        f.write(content)
    print('2. Added script tag to htmlBuilder.js')


# ── 3. Add characterZoomController.js to runtimeBuilder copy list ─────────────
rb_path = base + '/src/providers/rendering/runtime/runtimeBuilder.js'

with open(rb_path) as f:
    rb = f.read()

if 'characterZoomController' in rb:
    print('3. Already in runtimeBuilder — skipping')
else:
    old2 = "        await fs.copyFile(\n            path.resolve(\n                \"src/runtime/browser/browserRuntime.js\"\n            ),"
    new2 = """        await fs.copyFile(
            path.resolve("src/runtime/characterZoomController.js"),
            path.join(outputDirectory, "characterZoomController.js")
        );


        await fs.copyFile(
            path.resolve(
                "src/runtime/browser/browserRuntime.js"
            ),"""
    assert rb.count(old2) == 1, f'runtimeBuilder anchor count: {rb.count(old2)}'
    rb = rb.replace(old2, new2)
    with open(rb_path, 'w') as f:
        f.write(rb)
    print('3. Added copy step to runtimeBuilder.js')


print('\nDone — restart Pane-1, rebuild, test any dialogue screen')
