const express = require('express');
const router = express.Router();
const multer = require('multer');
const mammoth = require('mammoth');
const { parseScriptText } = require('../utils/scriptParser');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('scriptFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { value: rawText } = await mammoth.extractRawText({
      buffer: req.file.buffer
    });

    const parsedScript = parseScriptText(rawText);

    res.json({
      success: true,
      filename: req.file.originalname,
      data: parsedScript
    });
  } catch (err) {
    console.error('Script Parse Error:', err);
    res.status(500).json({ success: false, error: 'Failed to process docx script' });
  }
});

module.exports = router;
