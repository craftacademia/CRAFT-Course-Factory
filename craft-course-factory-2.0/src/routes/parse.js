import express from 'express';
import multer from 'multer';
import { parseDocx } from '../parser.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Direct parse via uploaded file
const handleParse = async (req, res) => {
  try {
    const file = req.files && req.files.length > 0 ? req.files[0] : req.file;
    if (!file) {
      return res.status(400).json({ error: 'No script file provided for parsing.' });
    }

    const courseData = await parseDocx(file.path);
    // Attach current course data globally or pass back in response
    req.app.locals.currentCourseData = courseData;

    res.json({ success: true, courseData });
  } catch (err) {
    console.error('Parsing API Error:', err);
    res.status(500).json({ error: 'Failed to parse script: ' + err.message });
  }
};

router.post('/script', upload.any(), handleParse);
router.post('/', upload.any(), handleParse); // Support /api/parse directly

export default router;
