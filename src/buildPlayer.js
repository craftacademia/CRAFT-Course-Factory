const fs = require('fs-extra');
const path = require('path');

async function buildPlayer() {
  const outputDir = path.join(__dirname, '../output');
  const scormEngineSrc = path.join(__dirname, 'scormEngine.js');
  const resultsTemplateSrc = path.join(__dirname, 'resultsTemplate.html');

  console.log('🔄 Building SCORM Player packages...');

  // Ensure SCORM Engine and Results Template exist
  if (!await fs.pathExists(scormEngineSrc) || !await fs.pathExists(resultsTemplateSrc)) {
    throw new Error('Missing scormEngine.js or resultsTemplate.html in src/ directory.');
  }

  const scormScript = await fs.readFile(scormEngineSrc, 'utf8');
  const resultsHTML = await fs.readFile(resultsTemplateSrc, 'utf8');

  const targets = ['scorm12', 'scorm2004'];

  for (const target of targets) {
    const targetDir = path.join(outputDir, target);
    await fs.ensureDir(targetDir);

    // 1. Write scormEngine.js directly into the output directory
    await fs.writeFile(path.join(targetDir, 'scormEngine.js'), scormScript);

    // 2. Inject SCORM engine script tag and Results modal HTML into index.html
    const htmlPath = path.join(targetDir, 'index.html');
    if (await fs.pathExists(htmlPath)) {
      let htmlContent = await fs.readFile(htmlPath, 'utf8');

      if (!htmlContent.includes('scormEngine.js')) {
        htmlContent = htmlContent.replace(
          '</head>',
          '  <script src="scormEngine.js"></script>\n</head>'
        );
      }

      if (!htmlContent.includes('id="results-screen"')) {
        htmlContent = htmlContent.replace('</body>', `${resultsHTML}\n</body>`);
      }

      await fs.writeFile(htmlPath, htmlContent);
    }
  }

  console.log('✅ Integrated SCORM Engine & Results Modal into SCORM packages!');
}

if (require.main === module) {
  buildPlayer().catch(err => {
    console.error('❌ Build failed:', err);
    process.exit(1);
  });
}

module.exports = buildPlayer;
