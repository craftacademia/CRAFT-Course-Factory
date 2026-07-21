const fs = require('fs-extra');
const path = require('path');
const mammoth = require('mammoth');

function extractTag(text, tag) {
  const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)(?=\\n\\[|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

async function parseDocxScript(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  const text = result.value;

  const rawScreens = text.split(/\[SCREEN:\s*(\d+)\]/i).slice(1);
  const screens = [];

  for (let i = 0; i < rawScreens.length; i += 2) {
    const screenId = rawScreens[i];
    const block = rawScreens[i + 1];

    const type = extractTag(block, 'TYPE').toUpperCase() || 'INFO';
    const screenData = {
      id: `screen_${screenId}`,
      number: parseInt(screenId, 10),
      type: type.toLowerCase(),
      title: extractTag(block, 'TITLE'),
      content: extractTag(block, 'CONTENT')
    };

    // Specific parsing for REFLECTION types
    if (type === 'REFLECTION') {
      screenData.prompt = extractTag(block, 'PROMPT');
      screenData.expertAnswer = extractTag(block, 'EXPERT_ANSWER');
      screenData.minChars = parseInt(extractTag(block, 'MIN_CHARS') || '30', 10);
      screenData.points = parseInt(extractTag(block, 'POINTS') || '10', 10);
    } 
    // Specific parsing for QUIZ types
    else if (type === 'QUIZ') {
      screenData.question = extractTag(block, 'QUESTION');
      screenData.options = extractTag(block, 'OPTIONS').split('\n').filter(Boolean);
      screenData.correctAnswer = extractTag(block, 'ANSWER');
      screenData.points = parseInt(extractTag(block, 'POINTS') || '10', 10);
    }

    screens.push(screenData);
  }

  return screens;
}

module.exports = { parseDocxScript };
