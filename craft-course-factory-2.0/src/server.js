import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { parseScript } from './parser.js';
import { runPipeline } from './pipeline.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Setup upload storage directory
const uploadDir = path.join(__dirname, '../uploads');
const outputDir = path.join(__dirname, '../output');

[uploadDir, outputDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Static assets
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API Endpoint for building SCORM package
app.post('/api/build', upload.fields([
  { name: 'script', maxCount: 1 },
  { name: 'assets', maxCount: 50 }
]), async (req, res) => {
  try {
    const scriptFile = req.files?.script?.[0];
    const assetFiles = req.files?.assets || [];
    const scormType = req.body.scormType || '1.2';

    if (!scriptFile) {
      return res.status(400).json({ error: 'Missing script file (.docx)' });
    }

    // 1. Create a unique temporary job folder for this build
    const jobId = `job_${Date.now()}`;
    const jobDir = path.join(uploadDir, jobId);
    fs.mkdirSync(jobDir, { recursive: true });

    // Normalize target file name to script.docx for the parser
    const scriptDest = path.join(jobDir, 'script.docx');
    fs.renameSync(scriptFile.path, scriptDest);

    // Move asset files into job directory
    if (assetFiles.length > 0) {
      const assetsDir = path.join(jobDir, 'assets');
      fs.mkdirSync(assetsDir, { recursive: true });
      assetFiles.forEach(f => {
        fs.renameSync(f.path, path.join(assetsDir, f.originalname));
      });
    }

    // 2. Parse .docx Script
    await parseScript(scriptDest);

    // 3. Run Pipeline to create SCORM package
    const zipPath = await runPipeline(jobDir, scormType, outputDir);

    // 4. Download zip to client and clean up
    res.download(zipPath, 'SCORM_Package.zip', (err) => {
      fs.rmSync(jobDir, { recursive: true, force: true });
      if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    });

  } catch (err) {
    console.error('Build Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error during package build' });
  }
});

// Fallback 404 handler for undefined API routes
app.use('/api/{*splat}', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} does not exist.` });
});

app.listen(PORT, () => {
  console.log(`🚀 CRAFT Course Factory server active on http://localhost:${PORT}`);
});
