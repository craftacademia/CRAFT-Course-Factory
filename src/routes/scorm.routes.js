import express from 'express';
const router = express.Router();

router.get('/1.2', (req, res) => {
  res.json({ success: true, message: 'SCORM 1.2 package' });
});

router.get('/2004', (req, res) => {
  res.json({ success: true, message: 'SCORM 2004 package' });
});

export default router;
