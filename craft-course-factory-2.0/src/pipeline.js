import fs from 'fs';
import path from 'path';
import { parseScript } from './parser.js';
import { buildScormPackage } from './buildPlayer.js';

export async function runPipeline(jobDir, scormType = '1.2', outputDir) {
  const scriptPath = path.join(jobDir, 'script.docx');
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Script file not found at ${scriptPath}`);
  }

  // 1. Parse Word Script
  const parsedData = await parseScript(scriptPath);

  // 2. Build SCORM package using buildPlayer engine
  const result = await buildScormPackage(jobDir, parsedData);
  const generatedZipPath = result.zipPath;

  // 3. Copy output zip to requested outputDir if supplied
  if (outputDir && fs.existsSync(outputDir) && generatedZipPath) {
    const targetPath = path.join(outputDir, path.basename(generatedZipPath));
    if (generatedZipPath !== targetPath) {
      fs.copyFileSync(generatedZipPath, targetPath);
      return targetPath;
    }
  }

  return generatedZipPath;
}
