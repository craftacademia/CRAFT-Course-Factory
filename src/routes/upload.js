import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Upload Word Document
router.post('/docx', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No .docx file uploaded.' });
  }
  res.json({
    success: true,
    message: 'Word document uploaded successfully.',
    file: {
      path: req.file.path,
      originalname: req.file.originalname,
      size: req.file.size
    }
  });
});

// Upload Voice Overs (VO) / Audio
router.post('/vo', upload.array('audio', 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No audio files uploaded.' });
  }
  const uploadedFiles = req.files.map(f => ({ path: f.path, originalname: f.originalname }));
  res.json({ success: true, count: uploadedFiles.length, files: uploadedFiles });
});

// Upload Images / Visual Assets
router.post('/images', upload.array('images', 50), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No image files uploaded.' });
  }
  const uploadedFiles = req.files.map(f => ({ path: f.path, originalname: f.originalname }));
  res.json({ success: true, count: uploadedFiles.length, files: uploadedFiles });
});

export default router;
