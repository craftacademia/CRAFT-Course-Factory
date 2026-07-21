const fs = require('fs-extra');
const path = require('path');
const mammoth = require('mammoth');

function parseAttributes(attrStr) {
  const attrs = {};
  const attrRegex = /(\w+)=([^\s"]+|"[^"]*")/g;
  let match;
  while ((match = attrRegex.exec(attrStr)) !== null) {
    attrs[match[1]] = match[2].replace(/^"|"$/g, '');
  }
  return attrs;
}

function parseLines(text) {
  const lines = [];
  const lineRegex = /\[LINE\s+([^\]]+)\]([\s\S]*?)\[\/LINE\]/g;
  let match;
  while ((match = lineRegex.exec(text)) !== null) {
    const attr = parseAttributes(match[1]);
    lines.push({
      speaker: attr.SPEAKER || null,
      expression: attr.EXPRESSION || null,
      voId: attr.VO_ID || null,
      text: match[2].trim()
    });
  }
  return lines;
}

function parseScreenBody(body) {
  const branchPoints = [];
  const paths = [];

  const bpRegex = /\[BRANCH_POINT\s+([^\]]+)\]([\s\S]*?)\[\/BRANCH_POINT\]/g;
  let bpMatch;
  while ((bpMatch = bpRegex.exec(body)) !== null) {
    const bpAttr = parseAttributes(bpMatch[1]);
    const bpContent = bpMatch[2];

    const options = [];
    const optRegex = /\[OPTION\s+([^\]]+)\]([\s\S]*?)\[\/OPTION\]/g;
    let optMatch;
    while ((optMatch = optRegex.exec(bpContent)) !== null) {
      const optAttr = parseAttributes(optMatch[1]);
      options.push({
        letter: optAttr.LETTER || null,
        score: parseInt(optAttr.SCORE, 10) || 0,
        next: optAttr.NEXT || null,
        voId: optAttr.VO_ID || null,
        text: optMatch[2].trim()
      });
    }

    branchPoints.push({
      id: bpAttr.ID,
      options
    });
  }

  const pathRegex = /\[PATH\s+([^\]]+)\]([\s\S]*?)\[\/PATH\]/g;
  let pathMatch;
  while ((pathMatch = pathRegex.exec(body)) !== null) {
    const pathAttr = parseAttributes(pathMatch[1]);
    const pathContent = pathMatch[2];

    paths.push({
      id: pathAttr.ID,
      dialogues: parseLines(pathContent)
    });
  }

  const cleanBody = body
    .replace(/\[BRANCH_POINT[\s\S]*?\[\/BRANCH_POINT\]/g, '')
    .replace(/\[PATH[\s\S]*?\[\/PATH\]/g, '');

  const dialogues = parseLines(cleanBody);

  return { dialogues, branchPoints, paths };
}

async function parseDocxScript(docxFilePath) {
  const result = await mammoth.extractRawText({ path: docxFilePath });
  const text = result.value;

  const screens = [];
  const screenRegex = /\[SCREEN\s+([^\]]+)\]([\s\S]*?)\[\/SCREEN\]/g;
  let match;

  while ((match = screenRegex.exec(text)) !== null) {
    const attrStr = match[1];
    const screenBody = match[2];

    const screenAttr = parseAttributes(attrStr);
    const parsedBody = parseScreenBody(screenBody);

    screens.push({
      id: screenAttr.ID,
      type: screenAttr.TYPE || 'STATIC',
      scene: screenAttr.SCENE || null,
      location: screenAttr.LOCATION || null,
      assetRef: screenAttr.ASSET_REF || null,
      dialogues: parsedBody.dialogues,
      branchPoints: parsedBody.branchPoints,
      paths: parsedBody.paths
    });
  }

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      totalScreens: screens.length
    },
    screens
  };
}

if (require.main === module) {
  const inputDocx = path.join(__dirname, '../scripts/script.docx');
  const outputManifest = path.join(__dirname, '../output/manifests/manifest.json');

  if (fs.existsSync(inputDocx)) {
    parseDocxScript(inputDocx)
      .then(async (manifest) => {
        await fs.ensureDir(path.dirname(outputManifest));
        await fs.writeJson(outputManifest, manifest, { spaces: 2 });
        console.log(`\n✅ Manifest generated successfully! Total Screens: ${manifest.screens.length}`);
      })
      .catch((err) => console.error('Error parsing script:', err));
  } else {
    console.log(`ℹ️  [parser.js] Drop 'script.docx' inside ./scripts/ to enable Word script parsing.`);
  }
}

module.exports = { parseDocxScript };
