import path from 'path';
import fs from 'fs-extra';
import https from 'https';

/**
 * Generates an audio clip using OpenAI TTS API or fallback mock audio.
 */
async function generateAudioFile(text, outputPath) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'alloy'
      });

      const req = https.request(
        'https://api.openai.com/v1/audio/speech',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        },
        (res) => {
          if (res.statusCode !== 200) {
            return reject(new Error(`OpenAI TTS Error: HTTP ${res.statusCode}`));
          }
          const fileStream = fs.createWriteStream(outputPath);
          res.pipe(fileStream);
          fileStream.on('finish', () => resolve());
          fileStream.on('error', reject);
        }
      );

      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  }

  // Fallback: Write a placeholder valid MP3 frame header if no API key is provided
  const dummyHeader = Buffer.from([0xFF, 0xFB, 0x90, 0x64]);
  await fs.writeFile(outputPath, dummyHeader);
}

/**
 * Generates audio assets for course slides.
 * @param {object} parsedData - Parsed course structure.
 * @param {string} outputDir - Directory to output generated audio assets.
 * @returns {Promise<object>} Generated audio mapping metadata.
 */
export async function generateAudioForCourse(parsedData, outputDir) {
  const audioDir = path.join(outputDir, 'audio');
  await fs.ensureDir(audioDir);

  const manifestFiles = [];

  for (const slide of parsedData.slides || []) {
    const textToSynthesize = (slide.audioText || slide.content || '').trim();

    if (!textToSynthesize) {
      continue;
    }

    const audioFilename = `${slide.id}.mp3`;
    const audioFilePath = path.join(audioDir, audioFilename);

    try {
      await generateAudioFile(textToSynthesize, audioFilePath);
      
      manifestFiles.push({
        slideId: slide.id,
        filename: audioFilename,
        text: textToSynthesize,
        durationSeconds: 5
      });
    } catch (err) {
      console.warn(`[audioGenerator] Failed to generate audio for ${slide.id}: ${err.message}`);
    }
  }

  const manifestPath = path.join(audioDir, 'audio_manifest.json');
  const manifestData = {
    generatedAt: new Date().toISOString(),
    totalAudios: manifestFiles.length,
    files: manifestFiles
  };

  await fs.writeJson(manifestPath, manifestData, { spaces: 2 });

  return {
    audioDir,
    manifestPath,
    totalGenerated: manifestFiles.length
  };
}
