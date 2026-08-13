import fs      from 'fs/promises';
import path    from 'path';
import archiver from 'archiver';
import { createWriteStream } from 'fs';


export default class ScormBuilder {


    async build(html5Directory, outputDirectory, courseTitle, scormVersion) {

        scormVersion = scormVersion || '1.2';  // '1.2' or '2004'
        courseTitle  = courseTitle  || 'CRAFT Course';

        await fs.mkdir(outputDirectory, { recursive: true });

        // ── 1. Inject scorm.js into index.html ─────────────────────────────

        const indexPath    = path.join(html5Directory, 'index.html');
        const scormJsPath  = path.join(html5Directory, 'scorm.js');
        const scormSrcPath = path.resolve('src/runtime/scorm.js');

        await fs.copyFile(scormSrcPath, scormJsPath);

        let html = await fs.readFile(indexPath, 'utf8');

        if (!html.includes('scorm.js')) {
            html = html.replace(
                '<script type="module" src="runtime.js"></script>',
                '<script src="scorm.js"></script>\n\n<script type="module" src="runtime.js"></script>'
            );
            await fs.writeFile(indexPath, html, 'utf8');
        }

        // ── 2. Collect all files for the manifest ──────────────────────────

        const allFiles = await this.collectFiles(html5Directory, html5Directory);

        // ── 3. Generate manifest ───────────────────────────────────────────

        const manifest = scormVersion === '2004'
            ? this.manifest2004(courseTitle, allFiles)
            : this.manifest12(courseTitle, allFiles);

        await fs.writeFile(
            path.join(html5Directory, 'imsmanifest.xml'),
            manifest,
            'utf8'
        );

        // ── 4. Zip everything ──────────────────────────────────────────────

        const zipPath = path.join(outputDirectory, 'course-scorm.zip');

        await this.zipDirectory(html5Directory, zipPath);

        return zipPath;

    }


    async collectFiles(directory, base) {

        const entries = await fs.readdir(directory, { withFileTypes: true });
        const files   = [];

        for (const entry of entries) {
            const full     = path.join(directory, entry.name);
            const relative = path.relative(base, full).replace(/\\/g, '/');

            if (entry.isDirectory()) {
                const sub = await this.collectFiles(full, base);
                files.push(...sub);
            } else {
                files.push(relative);
            }
        }

        return files;

    }


    manifest12(title, files) {

        const fileElements = files
            .map(f => `    <file href="${this.escapeXml(f)}"/>`)
            .join('\n');

        return `<?xml version="1.0" encoding="UTF-8"?>
<manifest
    identifier="CRAFT_COURSE_${Date.now()}"
    version="1.2"
    xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
    xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">

  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>

  <organizations default="ORG1">
    <organization identifier="ORG1">
      <title>${this.escapeXml(title)}</title>
      <item identifier="ITEM1" identifierref="RES1">
        <title>${this.escapeXml(title)}</title>
        <adlcp:masteryscore>70</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>

  <resources>
    <resource
        identifier="RES1"
        type="webcontent"
        adlcp:scormtype="sco"
        href="index.html">
${fileElements}
    </resource>
  </resources>

</manifest>`;

    }


    manifest2004(title, files) {

        const fileElements = files
            .map(f => `      <file href="${this.escapeXml(f)}"/>`)
            .join('\n');

        return `<?xml version="1.0" encoding="UTF-8"?>
<manifest
    identifier="CRAFT_COURSE_${Date.now()}"
    xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
    xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3p2"
    xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3p2"
    xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3p2"
    xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd">

  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>

  <organizations default="ORG1">
    <organization identifier="ORG1" adlseq:objectivesGlobalToSystem="false">
      <title>${this.escapeXml(title)}</title>
      <item identifier="ITEM1" identifierref="RES1">
        <title>${this.escapeXml(title)}</title>
        <imsss:sequencing>
          <imsss:deliveryControls completionSetByContent="true" objectiveSetByContent="true"/>
        </imsss:sequencing>
      </item>
    </organization>
  </organizations>

  <resources>
    <resource
        identifier="RES1"
        type="webcontent"
        adlcp:scormType="sco"
        href="index.html">
${fileElements}
    </resource>
  </resources>

</manifest>`;

    }


    escapeXml(str) {
        return String(str)
            .replace(/&/g,  '&amp;')
            .replace(/</g,  '&lt;')
            .replace(/>/g,  '&gt;')
            .replace(/"/g,  '&quot;')
            .replace(/'/g,  '&apos;');
    }


    zipDirectory(sourceDir, zipPath) {

        return new Promise((resolve, reject) => {

            const output  = createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 6 } });

            output.on('close', resolve);
            archive.on('error', reject);

            archive.pipe(output);
            archive.directory(sourceDir, false);
            archive.finalize();

        });

    }


}
