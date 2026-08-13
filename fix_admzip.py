path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/rendering/scorm/scormBuilder.js'

with open(path) as f:
    content = f.read()

# Replace the import
old_import = ("import { createWriteStream } from 'fs';\n"
              "import * as archiverModule from 'archiver';\n"
              "const archiver = archiverModule.default || archiverModule;")

new_import = "import AdmZip from 'adm-zip';"

assert content.count(old_import) == 1, f'import anchor count: {content.count(old_import)}'
content = content.replace(old_import, new_import)

# Replace the zipDirectory method
old_zip = """    zipDirectory(sourceDir, zipPath) {

        return new Promise((resolve, reject) => {

            const output  = createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 6 } });

            output.on('close', resolve);
            archive.on('error', reject);

            archive.pipe(output);
            archive.directory(sourceDir, false);
            archive.finalize();

        });

    }"""

new_zip = """    async zipDirectory(sourceDir, zipPath) {

        const zip   = new AdmZip();
        const files = await this.collectFiles(sourceDir, sourceDir);

        for (const file of files) {
            const fullPath = path.join(sourceDir, file);
            const dir      = path.dirname(file);
            zip.addLocalFile(fullPath, dir === '.' ? '' : dir);
        }

        await zip.writeZipPromise(zipPath);

    }"""

assert content.count(old_zip) == 1, f'zip method anchor count: {content.count(old_zip)}'
content = content.replace(old_zip, new_zip)

with open(path, 'w') as f:
    f.write(content)

print('Done')
