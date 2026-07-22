import fs from 'fs-extra';
import path from 'path';
import mammoth from 'mammoth';

/**
 * Parses a .docx file or JSON script into structured slide data.
 * @param {string} filePath - Path to the file (.docx or .json)
 * @returns {Promise<Object>} Course payload with title and slides array
 */
export async function parseCourse(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.json') {
    const rawData = await fs.readJson(filePath);
    return rawData;
  }

  if (ext !== '.docx') {
    throw new Error(`Unsupported file type: ${ext}. Expected .docx or .json`);
  }

  const result = await mammoth.extractRawText({ path: filePath });
  const rawText = result.value || '';

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  let title = path.basename(filePath, ext);
  const slides = [];
  let currentSlide = null;
  let slideCounter = 1;

  for (const line of lines) {
    if (line.toLowerCase().startsWith('title:') || line.toLowerCase().startsWith('course title:')) {
      title = line.replace(/^(course title|title):/i, '').trim();
      continue;
    }

    if (line.toLowerCase().startsWith('module') || line.toLowerCase().startsWith('slide')) {
      if (currentSlide) {
        slides.push(currentSlide);
      }
      currentSlide = {
        id: `slide_${slideCounter++}`,
        title: line,
        content: [],
        audioText: ''
      };
      continue;
    }

    if (!currentSlide) {
      currentSlide = {
        id: `slide_${slideCounter++}`,
        title: 'Introduction',
        content: [],
        audioText: ''
      };
    }

    if (line.toLowerCase().startsWith('audio:') || line.toLowerCase().startsWith('narration:')) {
      const audioContent = line.replace(/^(audio|narration):/i, '').trim();
      currentSlide.audioText = currentSlide.audioText 
        ? `${currentSlide.audioText} ${audioContent}` 
        : audioContent;
    } else {
      currentSlide.content.push(line);
      // Fallback audio text if not explicitly designated
      if (!currentSlide.audioText) {
        currentSlide.audioText = line;
      }
    }
  }

  if (currentSlide) {
    slides.push(currentSlide);
  }

  return {
    title,
    slides: slides.length > 0 ? slides : [
      {
        id: 'slide_1',
        title: 'Welcome',
        content: ['Welcome to the course.'],
        audioText: 'Welcome to the course.'
      }
    ]
  };
}

export const parseDocx = parseCourse;
