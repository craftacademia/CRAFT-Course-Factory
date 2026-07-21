const fs = require('fs-extra');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '../output/manifests/manifest.json');
const AUDIO_CACHE_DIR = path.join(__dirname, '../audio_cache');
const PUBLIC_INDEX_PATH = path.join(__dirname, '../public/index.html');
const DIST_BASE_DIR = path.join(__dirname, '../output/dist');

function generateScorm12Manifest(title = "Loan Officer Training Course") {
  return `<?xml version="1.0" standalone="no" ?>
<manifest identifier="CraftCourseFactory_Course" version="1.0"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="default_org">
    <organization identifier="default_org"><title>${title}</title><item identifier="item_1" identifierref="resource_1"><title>${title}</title></item></organization>
  </organizations>
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html"><file href="index.html" /></resource>
  </resources>
</manifest>`;
}

function generateScorm2004Manifest(title = "Loan Officer Training Course") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="CraftCourseFactory_Course" version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v13"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 http://www.imsglobal.org/xsd/imscp_v1p1.xsd http://www.adlnet.org/xsd/adlcp_v13 http://www.adlnet.org/xsd/adlcp_v13.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>2004 4th Edition</schemaversion></metadata>
  <organizations default="default_org">
    <organization identifier="default_org"><title>${title}</title><item identifier="item_1" identifierref="resource_1"><title>${title}</title></item></organization>
  </organizations>
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html"><file href="index.html" /></resource>
  </resources>
</manifest>`;
}

async function buildDistributablePackages() {
  const targets = [
    { name: 'SCORM 1.2', dir: path.join(DIST_BASE_DIR, 'scorm12'), manifestGen: generateScorm12Manifest },
    { name: 'SCORM 2004 4th Edition', dir: path.join(DIST_BASE_DIR, 'scorm2004'), manifestGen: generateScorm2004Manifest }
  ];

  for (const target of targets) {
    await fs.emptyDir(target.dir);
    const audioDistDir = path.join(target.dir, 'audio');
    await fs.ensureDir(audioDistDir);

    if (await fs.pathExists(AUDIO_CACHE_DIR)) {
      await fs.copy(AUDIO_CACHE_DIR, audioDistDir);
    }

    if (await fs.pathExists(PUBLIC_INDEX_PATH)) {
      await fs.copy(PUBLIC_INDEX_PATH, path.join(target.dir, 'index.html'));
    }

    await fs.writeFile(path.join(target.dir, 'imsmanifest.xml'), target.manifestGen());
    console.log(`✅ Package Prepared -> ${target.name}`);
  }
}

if (require.main === module) {
  buildDistributablePackages();
}

module.exports = { buildDistributablePackages };
