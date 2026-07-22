import path from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createRequire } from 'module';
import { parseCourse } from './parser.js';
import { generateAudioForCourse } from './audioGenerator.js';

const execAsync = promisify(exec);
const require = createRequire(import.meta.url);

async function zipDirectory(sourceDir, outPath) {
  // Attempt using node archiver first, fallback to native zip on macOS/Linux
  try {
    const archiverModule = require('archiver');
    const archiverFunc = typeof archiverModule === 'function' 
      ? archiverModule 
      : (archiverModule.default || archiverModule.create);

    if (typeof archiverFunc === 'function') {
      return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outPath);
        const archive = archiverFunc('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve());
        archive.on('error', (err) => reject(err));

        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();
      });
    }
  } catch (err) {
    // If archiver fails to load or run, fall through to native zip
  }

  // Native CLI zip fallback (macOS / Linux)
  const sourceName = path.basename(sourceDir);
  const parentDir = path.dirname(sourceDir);
  await execAsync(`zip -r "${outPath}" "${sourceName}"`, { cwd: parentDir });
}

async function runPipeline() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node src/pipeline.js <path-to-script.docx|path-to-script.json>');
    process.exit(1);
  }

  const inputFile = path.resolve(args[0]);
  if (!await fs.pathExists(inputFile)) {
    console.error(`Error: File not found at ${inputFile}`);
    process.exit(1);
  }

  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  const jobDir = path.resolve('./output/jobs', jobId);
  await fs.ensureDir(jobDir);

  console.log(`\n🚀 Starting pipeline run for Job: ${jobId}`);
  console.log(`📁 Job Directory: ${jobDir}\n`);

  // 1. Parse Script
  console.log(`[1/3] Parsing script: ${inputFile}...`);
  const parsedData = await parseCourse(inputFile);
  const parsedJsonPath = path.join(jobDir, 'parsed_course.json');
  await fs.writeJson(parsedJsonPath, parsedData, { spaces: 2 });
  console.log(`✓ Parsed course: "${parsedData.title || 'Untitled Course'}"`);

  // 2. Generate Audio Assets
  console.log(`\n[2/3] Generating audio assets...`);
  const audioResult = await generateAudioForCourse(parsedData, jobDir);
  console.log(`✓ Audio processing complete. Total tracks: ${audioResult.totalGenerated}`);

  // 3. Build SCORM Package Payload
  console.log(`\n[3/3] Building SCORM player package...`);
  const payloadDir = path.join(jobDir, 'scorm_payload');
  await fs.ensureDir(payloadDir);

  // Copy parsed metadata & audio into payload
  await fs.copy(parsedJsonPath, path.join(payloadDir, 'parsed_course.json'));
  if (await fs.pathExists(audioResult.audioDir)) {
    await fs.copy(audioResult.audioDir, path.join(payloadDir, 'audio'));
  }

  // Copy HTML player template
  const playerTemplatePath = path.resolve('./templates/player.html');
  if (await fs.pathExists(playerTemplatePath)) {
    await fs.copy(playerTemplatePath, path.join(payloadDir, 'index.html'));
  }

  // Create SCORM 1.2 manifest
  const imsmanifestContent = `<manifest identifier="COURSE_${jobId}" version="1.0">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="org1"><organization identifier="org1"><title>${parsedData.title || 'Course'}</title></organization></organizations>
  <resources><resource identifier="res1" type="webcontent" href="index.html"></resource></resources>
</manifest>`;
  await fs.writeFile(path.join(payloadDir, 'imsmanifest.xml'), imsmanifestContent);

  // Archive payload into final SCORM Zip file
  const zipPath = path.join(jobDir, `${jobId}.zip`);
  await zipDirectory(payloadDir, zipPath);

  console.log(`✓ SCORM package build complete!`);
  console.log(`\n🎉 Pipeline completed successfully!`);
  console.log(`SCORM Zip created at: ${zipPath}`);
  console.log(`Latest Job Output: ${jobDir}\n`);
}

runPipeline().catch((err) => {
  console.error('❌ Pipeline failed:', err);
  process.exit(1);
});
