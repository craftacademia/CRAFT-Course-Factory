import os

route_code = """import express from 'express';
import path from 'path';
import fs from 'fs';
import { createScormPackage } from '../scormExporter.js';
import { buildPlayer } from '../buildPlayer.js';

const router = express.Router();

const getFallbackPlayerHtml = (courseData) => {
  const safeData = JSON.stringify(courseData || {}, null, 2);
  const safeTitle = (courseData && courseData.title) ? courseData.title : 'CRAFT SCORM Course';

  return '<!DOCTYPE html>\\n' +
'<html lang="en">\\n' +
'<head>\\n' +
'  <meta charset="UTF-8">\\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">\\n' +
'  <title>' + safeTitle + '</title>\\n' +
'  <style>\\n' +
'    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background: #0f172a; color: #f8fafc; }\\n' +
'    .container { max-width: 900px; margin: 0 auto; padding: 2rem; }\\n' +
'    header { border-bottom: 1px solid #334155; padding-bottom: 1rem; margin-bottom: 2rem; }\\n' +
'    h1 { color: #38bdf8; margin: 0 0 0.5rem 0; }\\n' +
'    .slide-card { background: #1e293b; border-radius: 12px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); }\\n' +
'    .slide-title { font-size: 1.5rem; color: #f1f5f9; margin-top: 0; }\\n' +
'    .slide-content { font-size: 1.1rem; line-height: 1.6; color: #cbd5e1; }\\n' +
'    .media-img { max-width: 100%; border-radius: 8px; margin-top: 1rem; }\\n' +
'    .nav-controls { display: flex; justify-content: space-between; margin-top: 2rem; }\\n' +
'    button { background: #0284c7; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: bold; cursor: pointer; }\\n' +
'    button:disabled { opacity: 0.4; cursor: not-allowed; }\\n' +
'  </style>\\n' +
'</head>\\n' +
'<body>\\n' +
'  <div class="container">\\n' +
'    <header>\\n' +
'      <h1 id="course-title">' + safeTitle + '</h1>\\n' +
'      <div id="progress">Slide <span id="current-slide">1</span> of <span id="total-slides">1</span></div>\\n' +
'    </header>\\n' +
'    <main id="slide-container"></main>\\n' +
'    <div class="nav-controls">\\n' +
'      <button id="prev-btn" onclick="prevSlide()">Previous</button>\\n' +
'      <button id="next-btn" onclick="nextSlide()">Next</button>\\n' +
'    </div>\\n' +
'  </div>\\n' +
'  <script>\\n' +
'    let rawData = ' + safeData + ';\\n' +
'    let currentIndex = 0;\\n' +
'    function extractSlides(obj) {\\n' +
'      if (!obj) return [];\\n' +
'      if (Array.isArray(obj)) return obj;\\n' +
'      if (Array.isArray(obj.slides)) return obj.slides;\\n' +
'      if (Array.isArray(obj.pages)) return obj.pages;\\n' +
'      if (Array.isArray(obj.lessons)) return obj.lessons;\\n' +
'      if (Array.isArray(obj.modules)) return obj.modules;\\n' +
'      if (obj.course && Array.isArray(obj.course.slides)) return obj.course.slides;\\n' +
'      if (obj.courseData && Array.isArray(obj.courseData.slides)) return obj.courseData.slides;\\n' +
'      if (obj.data && Array.isArray(obj.data.slides)) return obj.data.slides;\\n' +
'      return [];\\n' +
'    }\\n' +
'    function renderSlide() {\\n' +
'      const slides = extractSlides(rawData);\\n' +
'      if (slides.length === 0) {\\n' +
'        document.getElementById("slide-container").innerHTML = "<div class=\\"slide-card\\"><h2>No Slide Content Found</h2><p>Check terminal logs for the received payload structure.</p></div>";\\n' +
'        return;\\n' +
'      }\\n' +
'      const slide = slides[currentIndex];\\n' +
'      document.getElementById("current-slide").innerText = currentIndex + 1;\\n' +
'      document.getElementById("total-slides").innerText = slides.length;\\n' +
'      document.getElementById("prev-btn").disabled = currentIndex === 0;\\n' +
'      document.getElementById("next-btn").disabled = currentIndex === slides.length - 1;\\n' +
'      let imageHtml = "";\\n' +
'      const imgSrc = slide.image || slide.backgroundImage || slide.img || slide.media;\\n' +
'      if (imgSrc) {\\n' +
'        imageHtml = "<img class=\\"media-img\\" src=\\"" + imgSrc + "\\" alt=\\"Slide media\\" />";\\n' +
'      }\\n' +
'      document.getElementById("slide-container").innerHTML = \\n' +
'        "<div class=\\"slide-card\\"><h2 class=\\"slide-title\\">" + (slide.title || slide.heading || ("Slide " + (currentIndex + 1))) + "</h2><div class=\\"slide-content\\">" + (slide.content || slide.text || slide.description || slide.body || "") + "</div>" + imageHtml + "</div>";\\n' +
'    }\\n' +
'    function nextSlide() {\\n' +
'      const slides = extractSlides(rawData);\\n' +
'      if (currentIndex < slides.length - 1) {\\n' +
'        currentIndex++;\\n' +
'        renderSlide();\\n' +
'      }\\n' +
'    }\\n' +
'    function prevSlide() {\\n' +
'      if (currentIndex > 0) {\\n' +
'        currentIndex--;\\n' +
'        renderSlide();\\n' +
'      }\\n' +
'    }\\n' +
'    window.onload = renderSlide;\\n' +
'  </script>\\n' +
'</body>\\n' +
'</html>';
};

const handleExport = async (req, res) => {
  try {
    console.log("=== SCORM EXPORT REQUEST RECEIVED ===");
    console.log("Keys in req.body:", Object.keys(req.body || {}));

    let courseData = req.body;
    if (req.body?.courseData) courseData = req.body.courseData;
    if (req.body?.course) courseData = req.body.course;
    if (req.body?.data) courseData = req.body.data;

    console.log("Resolved Course Title:", courseData?.title);
    
    const version = req.body?.version || "2004";
    const playerHtml = getFallbackPlayerHtml(courseData);
    const zipBuffer = await createScormPackage(courseData, playerHtml, version);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="scorm-course.zip"');
    return res.send(zipBuffer);

  } catch (err) {
    console.error("Error exporting SCORM:", err);
    return res.status(500).json({ error: err.message });
  }
};

router.post('/export', handleExport);
router.post('/api/export', handleExport);
router.post('/', handleExport);

export default router;
"""

with open('src/routes/scorm.js', 'w', encoding='utf-8') as f:
    f.write(route_code)
print('Successfully updated src/routes/scorm.js with deep payload extraction and logging.')
