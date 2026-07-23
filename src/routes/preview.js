import express from 'express';
import { buildPlayer } from '../buildPlayer.js';

const router = express.Router();

router.get('/', (req, res) => {
  const currentCourseData = req.app.locals.currentCourseData;
  if (!currentCourseData) {
    return res.status(400).send('No course data available. Please parse a script first.');
  }
  const playerHtml = buildPlayer(currentCourseData);
  res.send(playerHtml);
});

router.post('/render', (req, res) => {
  try {
    const courseData = req.body.courseData || req.app.locals.currentCourseData;
    if (!courseData) {
      return res.status(400).json({ error: 'No course JSON provided.' });
    }
    const html = buildPlayer(courseData);
    res.json({ success: true, html });
  } catch (err) {
    res.status(500).json({ error: 'Failed to render HTML5 preview: ' + err.message });
  }
});

export default router;
