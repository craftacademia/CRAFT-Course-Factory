import path from 'path';
import fs from 'fs-extra';
import { randomUUID } from 'crypto';

/**
 * Creates and initializes an isolated workspace directory for a job run.
 * @param {string} [customJobId] - Optional user-defined job ID.
 * @returns {Promise<object>} Job metadata and paths.
 */
export async function createJobWorkspace(customJobId = null) {
  const jobId = customJobId || `job_${Date.now()}_${randomUUID().substring(0, 8)}`;
  const jobsRootDir = path.resolve(process.cwd(), 'output', 'jobs');
  const jobDir = path.join(jobsRootDir, jobId);

  // Define standard subdirectories
  const audioDir = path.join(jobDir, 'audio');
  const buildDir = path.join(jobDir, 'build');
  const scormDir = path.join(jobDir, 'scorm');

  // Create isolated structure
  await fs.ensureDir(audioDir);
  await fs.ensureDir(buildDir);
  await fs.ensureDir(scormDir);

  const parsedJsonPath = path.join(jobDir, 'parsed_course.json');

  return {
    jobId,
    jobDir,
    audioDir,
    buildDir,
    scormDir,
    parsedJsonPath
  };
}
