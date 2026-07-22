import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/**
 * Creates a zip archive stream compatible with both archiver <v8 and archiver >=v8.
 */
function createZipInstance(options) {
  const loaded = require('archiver');

  // 1. Standard / Legacy archiver function: archiver('zip', options)
  if (typeof loaded === 'function') {
    return loaded('zip', options);
  }
  if (typeof loaded?.default === 'function') {
    return loaded.default('zip', options);
  }
  if (typeof loaded?.create === 'function') {
    return loaded.create('zip', options);
  }

  // 2. Archiver v8+ class export: new ZipArchive(options)
  const ZipArchiveClass = loaded?.ZipArchive || loaded?.default?.ZipArchive;
  if (typeof ZipArchiveClass === 'function') {
    return new ZipArchiveClass(options);
  }

  throw new Error(`Unable to instantiate archiver. Keys found: ${Object.keys(loaded || {}).join(', ')}`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Builds the standalone SCORM HTML player directory and packages it into a zip.
 * @param {string} jobDir - Path to the job directory.
 * @param {object} parsedCourseData - The parsed JSON structure of the course.
 * @returns {Promise<object>} Status and path of created package.
 */
export async function buildScormPackage(jobDir, parsedCourseData) {
  if (!jobDir) {
    throw new Error('jobDir path is required for buildScormPackage');
  }

  const scormOutputDir = path.join(jobDir, 'scorm');
  const audioDir = path.join(jobDir, 'audio');
  await fs.ensureDir(scormOutputDir);

  // 1. Write the course data JSON into the output scorm folder
  const courseDataPath = path.join(scormOutputDir, 'course_data.json');
  await fs.writeJson(courseDataPath, parsedCourseData || {}, { spaces: 2 });

  // 2. Copy audio files if present
  const scormAudioDir = path.join(scormOutputDir, 'audio');
  await fs.ensureDir(scormAudioDir);
  if (await fs.pathExists(audioDir)) {
    await fs.copy(audioDir, scormAudioDir);
  }

  // 3. Create index.html player file
  const indexPath = path.join(scormOutputDir, 'index.html');
  const htmlContent = generatePlayerHtml(parsedCourseData);
  await fs.writeFile(indexPath, htmlContent, 'utf8');

  // 4. Create imsmanifest.xml for SCORM compliance
  const manifestPath = path.join(scormOutputDir, 'imsmanifest.xml');
  const manifestContent = generateManifest(parsedCourseData?.title || 'Course');
  await fs.writeFile(manifestPath, manifestContent, 'utf8');

  // 5. Zip the directory
  const zipPath = path.join(jobDir, `${path.basename(jobDir)}.zip`);
  await createZipArchive(scormOutputDir, zipPath);

  return {
    scormDir: scormOutputDir,
    zipPath
  };
}

function generatePlayerHtml(courseData) {
  const title = courseData?.title || 'SCORM Course';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: sans-serif; margin: 20px; line-height: 1.6; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div id="content">
    <p>Course player loaded successfully.</p>
  </div>
</body>
</html>`;
}

function generateManifest(title) {
  return `<?xml version="1.0" standalone="no" ?>
<manifest identifier="com.craftcourse.factory" version="1.0"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org_1">
    <organization identifier="org_1">
      <title>${title}</title>
      <item identifier="item_1" identifierref="resource_1">
        <title>${title}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`;
}

function createZipArchive(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    try {
      const output = fs.createWriteStream(outPath);
      const archive = createZipInstance({ zlib: { level: 9 } });

      output.on('close', () => resolve());
      archive.on('error', (err) => reject(err));

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    } catch (err) {
      reject(err);
    }
  });
}
