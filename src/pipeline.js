const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'output/dist');
const OUTPUT_DIR = path.join(ROOT_DIR, 'output');

function logStep(stepNumber, title) {
  console.log(`\n==================================================`);
  console.log(`🚀 STEP ${stepNumber}: ${title}`);
  console.log(`==================================================\n`);
}

async function runPipeline() {
  const startTime = Date.now();

  try {
    logStep(1, 'Parsing DOCX Script');
    execSync('node src/parser.js', { stdio: 'inherit' });

    logStep(2, 'Generating & Caching Audio Files');
    execSync('node src/audioGenerator.js', { stdio: 'inherit' });

    logStep(3, 'Building SCORM Distribution Packages');
    execSync('node src/buildPlayer.js', { stdio: 'inherit' });

    logStep(4, 'Compressing Packages into LMS Deployment ZIPs');
    const scorm12Dir = path.join(DIST_DIR, 'scorm12');
    const scorm2004Dir = path.join(DIST_DIR, 'scorm2004');

    if (await fs.pathExists(scorm12Dir)) {
      const scorm12Zip = path.join(OUTPUT_DIR, 'scorm12_course.zip');
      execSync(`cd "${scorm12Dir}" && zip -r "${scorm12Zip}" .`);
      console.log(`📦 Generated: output/scorm12_course.zip`);
    }

    if (await fs.pathExists(scorm2004Dir)) {
      const scorm2004Zip = path.join(OUTPUT_DIR, 'scorm2004_course.zip');
      execSync(`cd "${scorm2004Dir}" && zip -r "${scorm2004Zip}" .`);
      console.log(`📦 Generated: output/scorm2004_course.zip`);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 PIPELINE COMPLETED SUCCESSFULLY IN ${duration}s!\n`);

  } catch (error) {
    console.error('\n❌ Pipeline execution failed:', error.message);
    process.exit(1);
  }
}

runPipeline();
