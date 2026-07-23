import express from 'express';
import { generateScormPackage } from '../scormExporter.js';

const router = express.Router();

router.post('/export', async (req, res) => {
  try {
    console.log("=== SCORM Export API Invoked ===");
    console.log("Received Body Keys:", Object.keys(req.body));
    console.log("Raw Payload Snapshot:", JSON.stringify(req.body).substring(0, 300));

    const courseData = req.body;

    if (!courseData || Object.keys(courseData).length === 0) {
      console.error("❌ ERROR: Empty payload received at /api/scorm/export");
      return res.status(400).json({ error: "Empty course data received" });
    }

    const zipBuffer = await generateScormPackage(courseData);

    const safeTitle = (courseData.title || 'course')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_');

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${safeTitle}_scorm.zip"`,
      'Content-Length': zipBuffer.length
    });

    return res.send(zipBuffer);
  } catch (error) {
    console.error("❌ SCORM Export Server Error:", error);
    return res.status(500).json({ 
      error: "Failed to generate SCORM package", 
      details: error.message 
    });
  }
});

export default router;
