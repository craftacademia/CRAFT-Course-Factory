const mammoth = require('mammoth');

/**
 * Parses raw text from .docx into structured screen blocks, characters, and locations
 */
function parseScriptText(rawText) {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  const screens = [];
  const charactersSet = new Set();
  const locationsSet = new Set();

  let currentScreen = null;
  let currentSpeaker = null;

  lines.forEach((line) => {
    // 1. Detect Screen Location
    const locMatch = line.match(/\[SCREEN\s+LOCATION\s*=\s*([^\]]+)\]/i);
    if (locMatch) {
      const locationName = locMatch[1].trim();
      locationsSet.add(locationName);

      if (currentScreen) {
        screens.push(currentScreen);
      }

      currentScreen = {
        screenNumber: screens.length + 1,
        location: locationName,
        content: []
      };
      return;
    }

    // 2. Detect Speaker
    const speakerMatch = line.match(/\[LINE\s+SPEAKER\s*=\s*([^\]]+)\]/i);
    if (speakerMatch) {
      const speakerName = speakerMatch[1].trim();
      charactersSet.add(speakerName);
      currentSpeaker = speakerName;
      return;
    }

    // 3. Process Content Lines
    if (currentScreen) {
      if (currentSpeaker) {
        currentScreen.content.push({
          type: 'dialogue',
          speaker: currentSpeaker,
          text: line
        });
        currentSpeaker = null; // reset for next line
      } else {
        currentScreen.content.push({
          type: 'action',
          text: line
        });
      }
    }
  });

  if (currentScreen) {
    screens.push(currentScreen);
  }

  return {
    screens,
    characters: Array.from(charactersSet),
    locations: Array.from(locationsSet)
  };
}

module.exports = { parseScriptText };
