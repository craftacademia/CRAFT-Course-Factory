import fs from 'fs';
import path from 'path';

// --- 1. Update src/scormExporter.js ---
const scormExporterCode = `import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateScorm12Manifest(title, resourceFiles = []) {
  const safeTitle = title || "CRAFT Course";
  const fileTags = resourceFiles.map(file => '      <file href="' + file + '"/>').join('\n');
  
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
'<manifest identifier="MANIFEST_1" version="1.0"\n' +
'          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"\n' +
'          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"\n' +
'          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
'          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd\n' +
'                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">\n' +
'  <metadata>\n' +
'    <schema>ADL SCORM</schema>\n' +
'    <schemaversion>1.2</schemaversion>\n' +
'  </metadata>\n' +
'  <organizations default="org_1">\n' +
'    <organization identifier="org_1">\n' +
'      <title>' + safeTitle + '</title>\n' +
'      <item identifier="item_1" identifierref="resource_1">\n' +
'        <title>' + safeTitle + '</title>\n' +
'      </item>\n' +
'    </organization>\n' +
'  </organizations>\n' +
'  <resources>\n' +
'    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">\n' +
'      <file href="index.html"/>\n' +
'      <file href="data.json"/>\n' +
fileTags + '\n' +
'    </resource>\n' +
'  </resources>\n' +
'</manifest>';
}

function generateScorm2004Manifest(title, resourceFiles = []) {
  const safeTitle = title || "CRAFT Course";
  const fileTags = resourceFiles.map(file => '      <file href="' + file + '"/>').join('\n');

  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
'<manifest identifier="MANIFEST_1" version="1"\n' +
'          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"\n' +
'          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"\n' +
'          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"\n' +
'          xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"\n' +
'          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
'          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd\n' +
'                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd">\n' +
'  <metadata>\n' +
'    <schema>ADL SCORM</schema>\n' +
'    <schemaversion>2004 4th Edition</schemaversion>\n' +
'  </metadata>\n' +
'  <organizations default="org_1">\n' +
'    <organization identifier="org_1">\n' +
'      <title>' + safeTitle + '</title>\n' +
'      <item identifier="item_1" identifierref="resource_1">\n' +
'        <title>' + safeTitle + '</title>\n' +
'      </item>\n' +
'    </organization>\n' +
'  </organizations>\n' +
'  <resources>\n' +
'    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">\n' +
'      <file href="index.html"/>\n' +
'      <file href="data.json"/>\n' +
fileTags + '\n' +
'    </resource>\n' +
'  </resources>\n' +
'</manifest>';
}

export async function createScormPackage(courseData, playerHtml, version = "2004") {
  return new Promise(async (resolve, reject) => {
    try {
      const archiverPkg = require("archiver");
      const ZipClass = archiverPkg.ZipArchive || archiverPkg;

      const archive = typeof ZipClass === 'function' ? new ZipClass({ zlib: { level: 9 } }) : archiverPkg('zip', { zlib: { level: 9 } });
      const buffers = [];

      archive.on("data", (data) => buffers.push(data));
      archive.on("end", () => resolve(Buffer.concat(buffers)));
      archive.on("error", (err) => reject(err));

      const title = courseData && courseData.title ? courseData.title : "CRAFT Course";

      // 1. Bundle index.html and data.json
      const safePlayerHtml = typeof playerHtml === 'string' ? playerHtml : '<html><body>CRAFT Course</body></html>';
      archive.append(safePlayerHtml, { name: "index.html" });
      
      const safeDataJson = JSON.stringify(courseData || {}, null, 2);
      archive.append(safeDataJson, { name: "data.json" });

      const resourceFiles = [];
      const addedFiles = new Set(['data.json', 'index.html', 'imsmanifest.xml', 'course.json', '.ds_store']);

      const addDirectoryToZip = (sourceDir, zipPrefix = '') => {
        if (!sourceDir || !fs.existsSync(sourceDir)) return;
        const entries = fs.readdirSync(sourceDir) || [];

        for (const entry of entries) {
          if (!entry || entry.startsWith('.')) continue;
          const fullPath = path.join(sourceDir, entry);
          if (!fs.existsSync(fullPath)) continue;

          const stat = fs.statSync(fullPath);
          const zipPath = zipPrefix ? zipPrefix + '/' + entry : entry;

          if (addedFiles.has(zipPath.toLowerCase())) continue;

          if (stat.isDirectory()) {
            addDirectoryToZip(fullPath, zipPath);
          } else {
            archive.file(fullPath, { name: zipPath });
            resourceFiles.push(zipPath);
            addedFiles.add(zipPath.toLowerCase());
          }
        }
      };

      // 2. Scan public directory for images (CHAR-*, LOC-*, SCENE-*, slide_*)
      const publicDir = path.resolve(__dirname, '../public');
      if (fs.existsSync(publicDir)) {
        const publicEntries = fs.readdirSync(publicDir) || [];
        for (const entry of publicEntries) {
          if (entry === 'preview-build' || entry.startsWith('.')) continue;
          const entryPath = path.join(publicDir, entry);
          const stat = fs.statSync(entryPath);
          if (!stat.isDirectory()) {
            const ext = path.extname(entry).toLowerCase();
            if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.mp3', '.wav', '.ogg'].includes(ext)) {
              if (!addedFiles.has(entry.toLowerCase())) {
                archive.file(entryPath, { name: entry });
                resourceFiles.push(entry);
                addedFiles.add(entry.toLowerCase());
              }
            }
          }
        }
      }

      // 3. Scan preview-build directory (for audio folder and assets)
      const previewBuildDir = path.resolve(__dirname, '../public/preview-build');
      if (fs.existsSync(previewBuildDir)) {
        addDirectoryToZip(previewBuildDir, '');
      }

      // 4. Generate manifest with all verified resources
      const manifestXml = version === "1.2" 
        ? generateScorm12Manifest(title, resourceFiles) 
        : generateScorm2004Manifest(title, resourceFiles);

      archive.append(manifestXml, { name: "imsmanifest.xml" });

      await archive.finalize();
    } catch (err) {
      reject(err);
    }
  });
}
`;

// --- 2. Update src/routes/scorm.js ---
const scormRouteCode = `import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createScormPackage } from '../scormExporter.js';
import { buildPlayer } from '../buildPlayer.js';

const router = express.Router();

const getFallbackPlayerHtml = (courseData) => {
  const safeTitle = (courseData && courseData.title) ? courseData.title : 'CRAFT SCORM Course';
  return '<!DOCTYPE html>\n' +
'<lang="en">\n' +
'<head>\n' +
'  <meta charset="UTF-8">\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'  <title>' + safeTitle + '</title>\n' +
'  <style>\n' +
'    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background: #0f172a; color: #f8fafc; }\n' +
'    .container { max-width: 900px; margin: 0 auto; padding: 2rem; }\n' +
'    header { border-bottom: 1px solid #334155; padding-bottom: 1rem; margin-bottom: 2rem; }\n' +
'    h1 { color: #38bdf8; margin: 0 0 0.5rem 0; }\n' +
'    .slide-card { background: #1e293b; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); }\n' +
'    .slide-title { font-size: 1.5rem; color: #f1f5f9; margin-top: 0; }\n' +
'    .slide-content { font-size: 1.1rem; line-height: 1.6; color: #cbd5e1; }\n' +
'    .media-img { max-width: 100%; border-radius: 8px; margin-top: 1rem; }\n' +
'    .nav-controls { display: flex; justify-content: space-between; margin-top: 2rem; }\n' +
'    button { background: #0284c7; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: bold; cursor: pointer; }\n' +
'    button:disabled { opacity: 0.4; cursor: not-allowed; }\n' +
'  </style>\n' +
'</head>\n' +
'<body>\n' +
'  <div class="container">\n' +
'    <header>\n' +
'      <h1 id="course-title">' + safeTitle + '</h1>\n' +
'      <div id="progress">Slide <span id="current-slide">1</span> of <span id="total-slides">1</span></div>\n' +
'    </header>\n' +
'    <main id="slide-container"></main>\n' +
'    <div class="nav-controls">\n' +
'      <button id="prev-btn" onclick="prevSlide()">Previous</button>\n' +
'      <button id="next-btn" onclick="nextSlide()">Next</button>\n' +
'    </div>\n' +
'  </div>\n' +
'  <script>\n' +
'    let courseData = null;\n' +
'    let currentIndex = 0;\n' +
'    async function initCourse() {\n' +
'      try {\n' +
'        const res = await fetch("data.json");\n' +
'        courseData = await res.json();\n' +
'        renderSlide();\n' +
'      } catch (err) {\n' +
'        document.getElementById("slide-container").innerHTML = "<div class=\\"slide-card\\"><h2>Error Loading Course</h2><p>" + err.message + "</p></div>";\n' +
'      }\n' +
'    }\n' +
'    function renderSlide() {\n' +
'      if (!courseData || !courseData.slides || courseData.slides.length === 0) {\n' +
'        document.getElementById("slide-container").innerHTML = "<div class=\\"slide-card\\"><p>No slides found in data.json</p></div>";\n' +
'        return;\n' +
'      }\n' +
'      const slides = courseData.slides;\n' +
'      const slide = slides[currentIndex];\n' +
'      document.getElementById("current-slide").innerText = currentIndex + 1;\n' +
'      document.getElementById("total-slides").innerText = slides.length;\n' +
'      document.getElementById("prev-btn").disabled = currentIndex === 0;\n' +
'      document.getElementById("next-btn").disabled = currentIndex === slides.length - 1;\n' +
'      let imageHtml = "";\n' +
'      if (slide.image || slide.backgroundImage) {\n' +
'        const imgSrc = slide.image || slide.backgroundImage;\n' +
'        imageHtml = "<img class=\\"media-img\\" src=\\"" + imgSrc + "\\" alt=\\"Slide image\\" />";\n' +
'      }\n' +
'      document.getElementById("slide-container").innerHTML = \n' +
'        \'<div class="slide-card"><h2 class="slide-title">\' + (slide.title || ("Slide " + (currentIndex + 1))) + \'</h2><div class="slide-content">\' + (slide.content || slide.text || "") + \'</div>\' + imageHtml + \'</div>\';\n' +
'    }\n' +
'    function nextSlide() {\n' +
'      if (courseData && currentIndex < courseData.slides.length - 1) {\n' +
'        currentIndex++;\n' +
'        renderSlide();\n' +
'      }\n' +
'    }\n' +
'    function prevSlide() {\n' +
'      if (currentIndex > 0) {\n' +
'        currentIndex--;\n' +
'        renderSlide();\n' +
'      }\n' +
'    }\n' +
'    window.onload = initCourse;\n' +
'  </script>\n' +
'</body>\n' +
'</html>';
};

const handleExport = async (req, res) => {
  try {
    const courseData = req.body?.courseData || req.body || {};
    const version = req.body?.version || "2004";

    let playerHtml = "";
    try {
      if (typeof buildPlayer === 'function') {
        playerHtml = await buildPlayer(courseData);
      }
    } catch (buildErr) {
      console.warn("buildPlayer warning, falling back to clean standalone player HTML:", buildErr.message);
    }

    if (!playerHtml || typeof playerHtml !== 'string' || playerHtml.includes('src/main.jsx')) {
      playerHtml = getFallbackPlayerHtml(courseData);
    }

    const zipBuffer = await createScormPackage(courseData, playerHtml, version);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="' + ((courseData.title || 'scorm-course').toLowerCase().replace(/[^a-z0-9]/g, '-')) + '.zip"');
    return res.send(zipBuffer);

  } catch (err) {
    console.error("Error exporting SCORM:", err);
    return res.status(500).json({ 
      error: "Failed to export SCORM package: " + (err.message || "Unknown error") 
    });
  }
};

router.post('/export', handleExport);
router.post('/api/export', handleExport);
router.post('/', handleExport);

export default router;
`;

fs.writeFileSync('./src/scormExporter.js', scormExporterCode, 'utf8');
console.log('Successfully written src/scormExporter.js');

fs.writeFileSync('./src/routes/scorm.js', scormRouteCode, 'utf8');
console.log('Successfully written src/routes/scorm.js');
