path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/server.js'

with open(path) as f:
    content = f.read()

old = """            // Inject course config from UI into PIR
            const courseConfig = req.body?.courseConfig || req.body?.fields?.courseConfig;
            if (courseConfig) {
                try {
                    const cfg = typeof courseConfig === 'string' ? JSON.parse(courseConfig) : courseConfig;
                    if (pir && typeof pir === 'object' && pir.course) {
                        pir.course.config = cfg;
                        pir.course.passScore = cfg.passScore || 70;
                    }
                } catch(e) { console.warn('Could not parse courseConfig:', e.message); }
            }"""

new = """            // Inject course config from UI into PIR and rewrite index.html
            const courseConfig = req.body?.courseConfig;
            if (courseConfig) {
                try {
                    const cfg = typeof courseConfig === 'string' ? JSON.parse(courseConfig) : courseConfig;
                    if (pir && typeof pir === 'object' && pir.course) {
                        pir.course.config   = cfg;
                        pir.course.passScore = cfg.passScore || 70;
                        // Rewrite window.PIR in index.html with updated config
                        const indexPath = path.join(buildDir, 'html5', 'index.html');
                        let html = fs.readFileSync(indexPath, 'utf8');
                        const pirJson = JSON.stringify(pir, null, 2);
                        html = html.replace(
                            /window\.PIR =[\s\S]*?;(\s*<\/script>)/,
                            'window.PIR =\\n' + pirJson + ';$1'
                        );
                        fs.writeFileSync(indexPath, html, 'utf8');
                    }
                } catch(e) { console.warn('Could not inject courseConfig:', e.message); }
            }"""

count = content.count(old)
assert count == 1, f'anchor count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
