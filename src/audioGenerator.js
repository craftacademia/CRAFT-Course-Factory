const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

const SPEAKER_VOICE_MAP = {
  RAV: 'amartya',
  SUR: 'arvind',
  SHA: 'arvind',
  NAR: 'meera',
  DEFAULT: 'meera'
};

const SARVAM_API_URL = 'https://api.sarvam.ai/text-to-speech';
const UPLOAD_DIR = path.join(__dirname, '../assets/audio');
const CACHE_DIR = path.join(__dirname, '../audio_cache');
const MANIFEST_PATH = path.join(__dirname, '../output/manifests/manifest.json');

function generateHash(voId, speaker, text) {
  return crypto.createHash('md5').update(`${voId}_${speaker}_${text.trim()}`).digest('hex');
}

function extractAllVoiceLines(manifest) {
  const voList = [];
  (manifest.screens || []).forEach((screen) => {
    (screen.dialogues || []).forEach((line) => {
      if (line.text) {
        voList.push({
          voId: line.voId || `${screen.id}_line`,
          screenId: screen.id,
          speaker: line.speaker,
          text: line.text
        });
      }
    });

    (screen.branchPoints || []).forEach((bp) => {
      (bp.options || []).forEach((opt) => {
        if (opt.text) {
          voList.push({
            voId: opt.voId || `${screen.id}_opt_${opt.letter}`,
            screenId: screen.id,
            speaker: 'RAV',
            text: opt.text
          });
        }
      });
    });
  });
  return voList;
}

/**
 * Checks assets/audio/ for uploaded VO matching voId or screenId (.mp3 / .wav)
 */
async function findCustomUploadedAudio(voId, screenId) {
  if (!await fs.pathExists(UPLOAD_DIR)) return null;

  const possibleNames = [
    `${voId}.mp3`, `${voId}.wav`,
    `${screenId}.mp3`, `${screenId}.wav`,
    `${voId.toLowerCase()}.mp3`, `${screenId.toLowerCase()}.mp3`
  ];

  for (const name of possibleNames) {
    const filePath = path.join(UPLOAD_DIR, name);
    if (await fs.pathExists(filePath)) {
      return filePath;
    }
  }
  return null;
}

async function generateAudioFromSarvam(text, speaker, apiKey) {
  const voice = SPEAKER_VOICE_MAP[speaker] || SPEAKER_VOICE_MAP.DEFAULT;
  if (!apiKey || apiKey === 'your_sarvam_api_key_here') {
    return Buffer.from(`MOCK_AUDIO_BUFFER_FOR: ${text}`);
  }

  const response = await fetch(SARVAM_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-subscription-key': apiKey },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: 'hi-IN',
      speaker: voice,
      pitch: 0,
      pace: 1.0,
      loudness: 1.5,
      speech_sample_rate: 22050,
      enable_preprocessing: true,
      model: 'bulbul:v1'
    })
  });

  if (!response.ok) throw new Error(`Sarvam API Error: ${await response.text()}`);
  const data = await response.json();
  return Buffer.from(data.audios[0], 'base64');
}

async function generateAudioForManifest() {
  const apiKey = process.env.SARVAM_API_KEY;
  await fs.ensureDir(CACHE_DIR);
  await fs.ensureDir(UPLOAD_DIR);

  if (!await fs.pathExists(MANIFEST_PATH)) {
    console.log(`ℹ️  No manifest found at ${MANIFEST_PATH}. Skipping audio sync.`);
    return;
  }

  const manifest = await fs.readJson(MANIFEST_PATH);
  const voiceLines = extractAllVoiceLines(manifest);

  let uploadedCount = 0;
  let cachedCount = 0;
  let generatedCount = 0;

  for (const item of voiceLines) {
    const hash = generateHash(item.voId, item.speaker, item.text);
    const targetCachePath = path.join(CACHE_DIR, `${item.voId}_${hash.slice(0, 8)}.mp3`);

    // 1. Priority check: Custom uploaded file in assets/audio/
    const customUpload = await findCustomUploadedAudio(item.voId, item.screenId);
    if (customUpload) {
      await fs.copy(customUpload, targetCachePath);
      uploadedCount++;
      continue;
    }

    // 2. Secondary check: Local MD5 cache
    if (await fs.pathExists(targetCachePath)) {
      cachedCount++;
      continue;
    }

    // 3. Fallback: Generate via Sarvam AI TTS
    try {
      const audioBuffer = await generateAudioFromSarvam(item.text, item.speaker, apiKey);
      await fs.writeFile(targetCachePath, audioBuffer);
      generatedCount++;
    } catch (err) {
      console.error(`❌ Audio Gen Failed [${item.voId}]:`, err.message);
    }
  }

  console.log(`\n🎧 AUDIO SYNC SUMMARY:`);
  console.log(`   ├─ Custom Uploads Ingested : ${uploadedCount}`);
  console.log(`   ├─ Cached (Skipped API)    : ${cachedCount}`);
  console.log(`   └─ Fresh Sarvam AI Generated: ${generatedCount}\n`);
}

if (require.main === module) {
  require('dotenv').config();
  generateAudioForManifest();
}

module.exports = { generateAudioForManifest };
