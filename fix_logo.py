import os

# ── 1. Fix logo src path in server.js ────────────────────────────────────────
server_path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/server.js'

with open(server_path) as f:
    content = f.read()

old = """                assetManifest.branding.logo = {
                    name:
                        logo.originalname,
                    path:
                        `assets/branding/${logo.originalname}`,
                    src:
                        logo.path
                };"""

new = """                assetManifest.branding.logo = {
                    name:
                        logo.originalname,
                    path:
                        `assets/${logo.originalname}`,
                    src:
                        `assets/${logo.originalname}`,
                    uploadPath:
                        logo.path
                };"""

assert content.count(old) == 1, f'anchor count: {content.count(old)}'
content = content.replace(old, new)

with open(server_path, 'w') as f:
    f.write(content)
print('1. Fixed logo src path in server.js')


# ── 2. Copy logo in html5Builder.js ──────────────────────────────────────────
hb_path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/html5/html5Builder.js'

with open(hb_path) as f:
    content = f.read()

if 'branding' in content:
    print('2. Logo copy already in html5Builder — skipping')
else:
    old2 = '    async copyRuntimeTree('
    new2 = '''    async copyBranding(pir, outputDirectory) {
        const logo = pir?.branding?.logo;
        if (!logo?.uploadPath) return;
        const assetsDir = path.join(outputDirectory, 'assets');
        await fs.mkdir(assetsDir, { recursive: true });
        await fs.copyFile(logo.uploadPath, path.join(assetsDir, logo.name));
    }



    async copyRuntimeTree('''

    assert content.count(old2) == 1
    content = content.replace(old2, new2)

    # Call copyBranding in the build method
    old3 = '        await this.copyRuntimeTree('
    new3 = '        await this.copyBranding(pir, outputDirectory);\n        await this.copyRuntimeTree('
    assert content.count(old3) == 1
    content = content.replace(old3, new3)

    with open(hb_path, 'w') as f:
        f.write(content)
    print('2. Logo copy added to html5Builder.js')

print('\nDone — restart Pane-1, rebuild with logo uploaded, check window.PIR.branding.logo')
