import fs from 'fs';
import path from 'path';

/**
 * Checks if a string line is a compiler/metadata header or instruction tag.
 */
function isMetadataLine(trimmed) {
  if (!trimmed) return true;
  if (trimmed.startsWith('===')) return true;
  if (trimmed.startsWith('SCRIPT COMPILER PROCESSING')) return true;
  if (trimmed.startsWith('Source Document:')) return true;
  if (trimmed.startsWith('Target Engine:')) return true;
  if (trimmed.startsWith('Rule Enforcement:')) return true;
  if (trimmed.startsWith('System Prompt:')) return true;
  if (trimmed.startsWith('Compiler output:')) return true;
  if (trimmed.startsWith('[CHARACTERS]')) return true;
  if (trimmed.startsWith('[CHARACTER')) return true;
  if (trimmed.startsWith('[EXPRESSION')) return true;
  if (trimmed.startsWith('[PROMPT]')) return true;
  if (trimmed.startsWith('[SETTING]')) return true;
  return false;
}

/**
 * Recursively cleans strings, arrays, and objects by filtering out compiler metadata.
 */
export function cleanCompilerMetadata(data) {
  if (typeof data === 'string') {
    const lines = data.split('\n').filter(line => !isMetadataLine(line.trim()));
    return lines.join('\n').trim();
  }

  if (Array.isArray(data)) {
    return data
      .map(item => cleanCompilerMetadata(item))
      .filter(item => {
        if (typeof item === 'string') {
          return !isMetadataLine(item.trim());
        }
        return true;
      });
  }

  if (data !== null && typeof data === 'object') {
    const cleanedObj = {};
    for (const key in data) {
      cleanedObj[key] = cleanCompilerMetadata(data[key]);
    }
    return cleanedObj;
  }

  return data;
}

export function buildPlayer(courseData, outputDir) {
  const cleanedData = cleanCompilerMetadata(courseData);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const jsonPath = path.join(outputDir, 'data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(cleanedData, null, 2), 'utf8');

  return cleanedData;
}

export default buildPlayer;
