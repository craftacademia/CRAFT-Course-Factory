import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { parseScript } from './parser.js';

// Resolve CommonJS / ESM interop for 'archiver'
const require = createRequire(import.meta.url);
const rawArchiver = require('archiver');

/**
 * Normalizes 'archiver' initialization regardless of module structure
 */
function createZipArchive(options) {
  if (typeof rawArchiver === 'function') {
    return rawArchiver('zip', options);
  }
  if (typeof rawArchiver.default === 'function') {
    return rawArchiver.default('zip', options);
  }
  if (typeof rawArchiver.create === 'function') {
    return rawArchiver.create('zip', options);
  }
  if (rawArchiver.ZipArchive) {
    return new rawArchiver.ZipArchive(options);
  }
  throw new Error(`Unable to resolve archiver module instance. Received: ${JSON.stringify(Object.keys(rawArchiver))}`);
}

/**
 * Safely zips a folder into a destination file.
 */
function zipFolder(sourceFolder, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      const output = fs.createWriteStream(outputPath);
      const archive = createZipArchive({ zlib: { level: 9 } });

      output.on('close', () => resolve(outputPath));
      archive.on('error', (err) => reject(err));

      archive.pipe(output);
      archive.directory(sourceFolder, false);
      archive.finalize();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Helper to safely copy files without trying to read directories as files.
 */
function copyDirectoryContents(sourceDir, targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const items = fs.readdirSync(sourceDir);

  for (const item of items) {
    if (item.startsWith('.')) continue;

    const srcPath = path.join(sourceDir, item);
    const destPath = path.join(targetDir, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirectoryContents(srcPath, destPath);
    } else if (stat.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Runs the SCORM packaging pipeline.
 */
export async function runPipeline(jobDir, scormType = '1.2', outputDir) {
  const scriptPath = path.join(jobDir, 'script.docx');
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Script file not found at ${scriptPath}`);
  }

  // 1. Parse Script
  const parsedData = await parseScript(scriptPath);

  // 2. Prepare temporary build staging folder
  const buildStageDir = path.join(jobDir, 'build_stage');
  if (fs.existsSync(buildStageDir)) {
    fs.rmSync(buildStageDir, { recursive: true, force: true });
  }
  fs.mkdirSync(buildStageDir, { recursive: true });

  // 3. Copy uploaded media assets safely into build staging directory
  const filesInJob = fs.readdirSync(jobDir);
  for (const file of filesInJob) {
    const fullPath = path.join(jobDir, file);
    const stat = fs.statSync(fullPath);

    // Skip subdirectories (e.g. build_stage)
    if (stat.isFile() && !file.startsWith('.')) {
      fs.copyFileSync(fullPath, path.join(buildStageDir, file));
    }
  }

  // 4. Generate Course HTML Data/Manifest JSON
  const courseDataPath = path.join(buildStageDir, 'courseData.json');
  fs.writeFileSync(courseDataPath, JSON.stringify(parsedData, null, 2), 'utf-8');

  // 5. Build Final Output Zip
  const zipFileName = `SCORM_${scormType}_${path.basename(jobDir)}.zip`;
  const finalZipPath = path.join(outputDir, zipFileName);

  await zipFolder(buildStageDir, finalZipPath);

  return finalZipPath;
}
