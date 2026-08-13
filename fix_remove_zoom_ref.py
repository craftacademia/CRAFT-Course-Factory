path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/runtime/runtimeBuilder.js'

with open(path) as f:
    content = f.read()

old = """        await fs.copyFile(
            path.join(path.dirname(decodeURIComponent(new URL(import.meta.url).pathname)), '../../../runtime/characterZoomController.js'),
            path.join(outputDirectory, "characterZoomController.js")
        );


        """

if old not in content:
    # Try finding by grep result lines
    import re
    content = re.sub(r'\s*await fs\.copyFile\(\s*path\.join\([^)]*characterZoomController[^;]*\);\s*', '\n\n        ', content)

with open(path, 'w') as f:
    f.write(content)
print('Done')
