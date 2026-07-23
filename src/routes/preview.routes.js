import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const previewDir = path.join(__dirname, '../../public/preview-build');
const playerEngineDir = path.join(__dirname, '../../output/dist/scorm12');

if (!fs.existsSync(previewDir)) {
  fs.mkdirSync(previewDir, { recursive: true });
}

// Helper function to recursively copy player assets
const copyFolderRecursive = (source, target) => {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursive(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  });
};

const preparePreview = (data) => {
  // Sync HTML5 Player assets from engine build
  if (fs.existsSync(playerEngineDir)) {
    copyFolderRecursive(playerEngineDir, previewDir);
  }

  // Write course data for player to consume
  if (data) {
    fs.writeFileSync(path.join(previewDir, 'data.json'), JSON.stringify(data, null, 2));
    fs.writeFileSync(path.join(previewDir, 'course.json'), JSON.stringify(data, null, 2));
  }
};

// GET /preview -> Directly serve the SCORM HTML5 Player
router.get('/', (req, res) => {
  preparePreview(req.app.locals.currentCourseData);
  const previewIndexPath = path.join(previewDir, 'index.html');

  if (fs.existsSync(previewIndexPath)) {
    return res.sendFile(previewIndexPath);
  }
  return res.status(404).send('Preview engine missing in output/dist/scorm12');
});

// POST /api/preview -> Update preview payload & return player URL
router.post('/', (req, res) => {
  try {
    const bodyData = req.body?.slides || req.body?.courseData || req.body;
    const hasBodyData = bodyData && typeof bodyData === 'object' && Object.keys(bodyData).length > 0;
    
    const payload = hasBodyData ? bodyData : req.app.locals.currentCourseData;

    preparePreview(payload);

    return res.json({
      success: true,
      message: 'Preview generated successfully',
      previewUrl: '/preview-build/index.html',
      data: payload
    });
  } catch (error) {
    console.error('Preview Generation Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate preview',
      details: error.message
    });
  }
});

export default router;
