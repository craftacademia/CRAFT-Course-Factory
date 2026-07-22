import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { parseScript } from './parser.js';
import { runPipeline } from './pipeline.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Log incoming API requests for debugging
app.use('/api', (req, res, next) => {
  console.log(`📡 [API Call] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.static(path.join(projectRoot, 'public')));

// Ensure required directories exist
const uploadsDir = path.join(projectRoot, 'uploads');
const outputDir = path.join(projectRoot, 'output');
const tempDir = path.join(uploadsDir, 'temp');

[uploadsDir, outputDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Configure Multer safely checking for jobId existence
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const jobId = req.params.jobId || req.jobId;
    if (jobId) {
      const jobDir = path.join(uploadsDir, jobId);
      if (!fs.existsSync(jobDir)) fs.mkdirSync(jobDir, { recursive: true });
      cb(null, jobDir);
    } else {
      // Fallback destination for initial script upload before job ID creation
      cb(null, tempDir);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });
const jobs = new Map();

// 1. Upload Script Endpoint
app.post('/api/upload-script', upload.single('script'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No script file uploaded.' });

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const jobDir = path.join(uploadsDir, jobId);
    
    if (!fs.existsSync(jobDir)) fs.mkdirSync(jobDir, { recursive: true });
    
    const targetScriptPath = path.join(jobDir, 'script.docx');
    
    // Move uploaded file from tempDir to jobDir
    fs.renameSync(req.file.path, targetScriptPath);

    const parsed = await parseScript(targetScriptPath);
    
    jobs.set(jobId, {
      id: jobId,
      title: parsed.title,
      manifests: parsed.manifests,
      slidesCount: parsed.slides.length,
      dir: jobDir
    });

    console.log(`✅ Script parsed successfully. Created Job ID: ${jobId}`);

    res.json({
      success: true,
      jobId,
      title: parsed.title,
      slidesCount: parsed.slides.length,
      manifests: parsed.manifests
    });
  } catch (err) {
    next(err);
  }
});

// 2. Upload Assets Endpoint
app.post('/api/jobs/:jobId/assets', (req, res, next) => {
  req.jobId = req.params.jobId;
  next();
}, upload.fields([{ name: 'audio' }, { name: 'images' }]), (req, res) => {
  res.json({ success: true, message: 'Assets uploaded successfully.' });
});

// 3. Pre-flight Validation Endpoint
app.get('/api/jobs/:jobId/validate', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job session expired or not found. Please re-upload your script.' });
  }

  const filesInDir = fs.readdirSync(job.dir);

  const missingVOs = job.manifests.vo.filter(m => !filesInDir.includes(m.requiredFile));
  const missingImages = job.manifests.images.filter(m => !filesInDir.includes(m.requiredFile));

  res.json({
    isReady: missingVOs.length === 0 && missingImages.length === 0,
    missingVOs,
    missingImages
  });
});

// 4. Build SCORM Package Endpoint
app.post('/api/jobs/:jobId/build', async (req, res, next) => {
  try {
    const job = jobs.get(req.params.jobId);
    if (!job) {
      console.error(`❌ Build attempt failed: Job ID ${req.params.jobId} not found in memory.`);
      return res.status(404).json({ error: 'Job session expired or server restarted. Please re-upload your script document.' });
    }

    const scormType = req.body.scormType || '1.2';
    console.log(`\n⚙️ Triggering SCORM ${scormType} build for Job: ${job.id}...`);

    const result = await runPipeline(job.dir, scormType, outputDir);
    
    let fileName = `${job.id}_SCORM_${scormType}.zip`;
    if (typeof result === 'string') {
      fileName = path.basename(result);
    } else if (result && result.outputPath) {
      fileName = path.basename(result.outputPath);
    }

    console.log(`🎉 SCORM package generated: ${fileName}`);

    res.json({
      success: true,
      scormType,
      fileName,
      downloadUrl: `/api/download/${fileName}`
    });
  } catch (err) {
    next(err);
  }
});

// 5. Direct Stream Download Endpoint
app.get('/api/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(outputDir, fileName);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).json({ error: `File ${fileName} not found in output directory.` });
  }
});

// Catch-all route for missing API endpoints
app.all('/api/*path', (req, res) => {
  res.status(404).json({ error: `API route ${req.originalUrl} does not exist.` });
});

// Global Error Handler guaranteeing JSON output
app.use((err, req, res, next) => {
  console.error('❌ Internal Server Error:', err.stack || err.message || err);
  res.status(500).json({ error: err.message || 'An internal pipeline build error occurred.' });
});

app.listen(PORT, () => {
  console.log(`\n🌐 CRAFT Course Factory Web Server running clean at http://localhost:${PORT}`);
});
