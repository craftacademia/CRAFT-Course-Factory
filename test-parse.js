import path from 'path';
import { parseScript } from './src/parser.js';

async function testDirect() {
  try {
    const docxPath = path.join('uploads', 'job_1784741046544', 'Test Script.docx');
    console.log("Parsing script at:", docxPath);
    
    const parsedData = await parseScript(docxPath);
    console.log("\n--- JSON KEYS FOUND ---");
    console.log(Object.keys(parsedData || {}));
    
    console.log("\n--- JSON SAMPLE ---");
    console.log(JSON.stringify(parsedData, null, 2).slice(0, 1500));
  } catch (err) {
    console.error("Error running parser:", err);
  }
}

testDirect();
