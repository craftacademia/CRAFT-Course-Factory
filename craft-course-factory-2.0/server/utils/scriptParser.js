/**
 * Utility script to parse plain text scripts with flat attribute tags into structured JSON.
 */

function parseAttributes(attrString) {
  const attrs = {};
  if (!attrString) return attrs;

  // Regex to match KEY=VALUE or KEY="VALUE"
  const regex = /([A-Z0-9_]+)=(?:"([^"]*)"|'([^']*)'|([^\s\]]+))/gi;
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    const key = match[1].toUpperCase();
    const value = match[2] ?? match[3] ?? match[4];
    attrs[key] = value;
  }
  return attrs;
}

function parseScriptText(text) {
  if (!text || typeof text !== 'string') {
    return { characters: [], locations: [], screens: [] };
  }

  const characters = [];
  const locations = [];
  const screens = [];

  const charMap = new Map();
  const locMap = new Map();

  // 1. Process explicit [CHARACTER ...] tags if present
  const charRegex = /\[CHARACTER\s+([^\]]+)\]/gi;
  let charMatch;
  while ((charMatch = charRegex.exec(text)) !== null) {
    const attrs = parseAttributes(charMatch[1]);
    if (attrs.ID && !charMap.has(attrs.ID)) {
      const charObj = { id: attrs.ID, name: attrs.NAME || attrs.ID };
      charMap.set(attrs.ID, charObj);
    }
  }

  // 2. Process explicit [LOCATION ...] tags if present
  const locRegex = /\[LOCATION\s+([^\]]+)\]/gi;
  let locMatch;
  while ((locMatch = locRegex.exec(text)) !== null) {
    const attrs = parseAttributes(locMatch[1]);
    if (attrs.ID && !locMap.has(attrs.ID)) {
      const locObj = { id: attrs.ID, name: attrs.NAME || attrs.ID };
      locMap.set(attrs.ID, locObj);
    }
  }

  // 3. Process [SCREEN ...] ... [/SCREEN] blocks
  const screenBlockRegex = /\[SCREEN\s+([^\]]+)\]([\s\S]*?)\[\/SCREEN\]/gi;
  let screenMatch;

  while ((screenMatch = screenBlockRegex.exec(text)) !== null) {
    const screenAttrs = parseAttributes(screenMatch[1]);
    const screenBody = screenMatch[2];

    const screenObj = {
      id: screenAttrs.ID || `S_${screens.length + 1}`,
      type: screenAttrs.TYPE || 'STATIC',
      scene: screenAttrs.SCENE || '',
      location: screenAttrs.LOCATION || '',
      lines: [],
      branchPoints: []
    };

    // Auto-derive location if present in SCREEN tag
    if (screenAttrs.LOCATION && !locMap.has(screenAttrs.LOCATION)) {
      locMap.set(screenAttrs.LOCATION, {
        id: screenAttrs.LOCATION.replace(/\s+/g, '_').toUpperCase(),
        name: screenAttrs.LOCATION
      });
    }

    // Parse lines within screen
    const lineRegex = /\[LINE\s+([^\]]+)\]([\s\S]*?)\[\/LINE\]/gi;
    let lineMatch;
    while ((lineMatch = lineRegex.exec(screenBody)) !== null) {
      const lineAttrs = parseAttributes(lineMatch[1]);
      const dialogText = lineMatch[2].trim();

      const speakerId = lineAttrs.SPEAKER || 'UNKNOWN';
      if (speakerId !== 'UNKNOWN' && !charMap.has(speakerId)) {
        charMap.set(speakerId, { id: speakerId, name: speakerId });
      }

      screenObj.lines.push({
        speaker: speakerId,
        voId: lineAttrs.VO_ID || '',
        expression: lineAttrs.EXPRESSION || 'NEUTRAL',
        text: dialogText
      });
    }

    // Parse branch points within screen
    const bpRegex = /\[BRANCH_POINT\s+([^\]]+)\]([\s\S]*?)\[\/BRANCH_POINT\]/gi;
    let bpMatch;
    while ((bpMatch = bpRegex.exec(screenBody)) !== null) {
      const bpAttrs = parseAttributes(bpMatch[1]);
      const bpBody = bpMatch[2];

      const bpObj = {
        id: bpAttrs.ID || '',
        options: []
      };

      const optRegex = /\[OPTION\s+([^\]]+)\]([\s\S]*?)\[\/OPTION\]/gi;
      let optMatch;
      while ((optMatch = optRegex.exec(bpBody)) !== null) {
        const optAttrs = parseAttributes(optMatch[1]);
        const optText = optMatch[2].trim();

        bpObj.options.push({
          letter: optAttrs.LETTER || '',
          score: optAttrs.SCORE ? parseInt(optAttrs.SCORE, 10) : 0,
          next: optAttrs.NEXT || '',
          voId: optAttrs.VO_ID || '',
          text: optText
        });
      }

      screenObj.branchPoints.push(bpObj);
    }

    screens.push(screenObj);
  }

  return {
    characters: Array.from(charMap.values()),
    locations: Array.from(locMap.values()),
    screens
  };
}

module.exports = {
  parseScriptText
};
