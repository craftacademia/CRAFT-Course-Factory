path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/html5/html5Builder.js'

with open(path) as f:
    lines = f.readlines()

# Add copyBranding call in build method
for i, line in enumerate(lines):
    if 'await this.copyRuntimeTree(' in line:
        lines.insert(i, '        await this.copyBranding(pir, outputDirectory);\n')
        break

# Add copyBranding method before copyRuntimeTree method
for i, line in enumerate(lines):
    if 'async copyRuntimeTree(' in line:
        new_method = [
            '    async copyBranding(pir, outputDirectory) {\n',
            '        const logo = pir && pir.branding && pir.branding.logo;\n',
            '        if (!logo || !logo.uploadPath) return;\n',
            '        const assetsDir = path.join(outputDirectory, "assets");\n',
            '        await fs.mkdir(assetsDir, { recursive: true });\n',
            '        await fs.copyFile(logo.uploadPath, path.join(assetsDir, logo.name));\n',
            '    }\n',
            '\n',
            '\n',
        ]
        for j, ml in enumerate(new_method):
            lines.insert(i + j, ml)
        break

with open(path, 'w') as f:
    f.writelines(lines)
print('Done')
