import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Allow up to 50MB files and accept any field name
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

const handleFileUpload = (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file = files[0];
  const fileUrl = `/uploads/${file.filename}`;

  return res.json({
    success: true,
    message: 'File uploaded successfully',
    filePath: fileUrl,
    url: fileUrl,
    filename: file.filename,
  });
};

const uploadAny = upload.any();

router.post('/', uploadAny, handleFileUpload);
router.post('/images', uploadAny, handleFileUpload);
router.post('/upload-images', uploadAny, handleFileUpload);
router.post('/audio', uploadAny, handleFileUpload);
router.post('/upload-audio', uploadAny, handleFileUpload);
router.post('/vo', uploadAny, handleFileUpload);

export default router;
