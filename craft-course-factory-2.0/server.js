import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure preview output directory exists inside public
const previewDir = path.join(__dirname, 'public', 'preview');
if (!fs.existsSync(previewDir)) {
  fs.mkdirSync(previewDir, { recursive: true });
}

// ---------------------------------------------------------
// 1. HTML5 Preview API Endpoint
// ---------------------------------------------------------
app.post('/api/build-preview', (req, res) => {
  try {
    const previewHtmlPath = path.join(previewDir, 'index.html');

    // Simple HTML5 output structure for preview
    const previewContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CRAFT Course - HTML5 Preview</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      background: #1e293b;
      padding: 40px;
      border-radius: 12px;
      border: 1px solid #334155;
      text-align: center;
      max-width: 600px;
    }
    h1 { color: #38bdf8; margin-bottom: 12px; }
    p { color: #94a3b8; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>HTML5 Course Preview</h1>
    <p>This is a live preview of your generated course content before exporting to SCORM.</p>
  </div>
</body>
</html>`;

    fs.writeFileSync(previewHtmlPath, previewContent, 'utf8');

    return res.json({
      success: true,
      previewUrl: '/preview/index.html'
    });
  } catch (error) {
    console.error('Preview Build Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------------------------------------------
// 2. SCORM Export API Endpoint
// ---------------------------------------------------------
app.post('/api/export-scorm', (req, res) => {
  try {
    const { version } = req.body || { version: '1.2' };
    const zip = new AdmZip();

    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="CRAFT_COURSE" version="1">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>${version === '2004' ? '2004 4th Edition' : '1.2'}</schemaversion>
  </metadata>
  <organizations default="org1">
    <organization identifier="org1">
      <title>CRAFT Generated Course</title>
      <item identifier="item1" identifierref="res1">
        <title>Course Overview</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res1" type="webcontent" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`;

    const indexHtml = `<!DOCTYPE html>
<html>
<head><title>SCORM Course</title></head>
<body>
  <h1>SCORM ${version} Package</h1>
  <p>Course content loaded successfully.</p>
</body>
</html>`;

    zip.addFile('imsmanifest.xml', Buffer.from(manifestXml, 'utf8'));
    zip.addFile('index.html', Buffer.from(indexHtml, 'utf8'));

    const buffer = zip.toBuffer();

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="scorm_${version}.zip"`);
    return res.send(buffer);
  } catch (error) {
    console.error('SCORM Export Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
