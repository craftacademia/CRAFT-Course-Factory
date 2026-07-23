import express from 'express';
const router = express.Router();

router.post(['/script', '/'], (req, res) => {
  res.json({ success: true, message: 'Script parsed successfully' });
});

export default router;
