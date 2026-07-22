const express = require('express');
const router = express.Router();
const multer = require('multer');
const mammoth = require('mammoth');
const { parseScriptText } = require('../utils/scriptParser');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('script'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await mammoth.extractRawText({ path: req.file.path });
    const parsedData = parseScriptText(result.value);

    res.json({
      success: true,
      data: parsedData
    });
  } catch (err) {
    console.error('Error parsing script:', err);
    res.status(500).json({ error: 'Failed to process script file' });
  }
});

module.exports = router;
