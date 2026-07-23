import mammoth from 'mammoth';

export async function parseDocx(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    const rawText = result.value || '';

    // Extract Course Title
    let title = 'CRAFT Course Package';
    const titleMatch = rawText.match(/MODULE\s*TITLE:\s*(.+)/i) || rawText.match(/TITLE:\s*(.+)/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    }

    // Split screens by [SCREEN or [CHARACTER tags or double breaks
    const rawBlocks = rawText.split(/(?=\[SCREEN|\n\n\s*\[SCREEN|\n\n(?=[A-Z0-9_-]+\.))/gi);
    const slides = [];

    rawBlocks.forEach((block) => {
      // Strip raw [ASSET ...] blocks entirely from preview text
      const cleanedBlock = block.replace(/\[ASSET[^\]]*\][\s\S]*?\[\/ASSET\]/gi, '')
                                .replace(/\[ASSETS\]|\[\/ASSETS\]|\[SCREENS\]|\[\/SCREENS\]/gi, '')
                                .trim();

      if (!cleanedBlock) return;

      // Extract Screen ID or Title
      let slideTitle = 'Slide ' + (slides.length + 1);
      const idMatch = block.match(/\[SCREEN\s+ID=([^\s\]]+)/i);
      if (idMatch && idMatch[1]) {
        slideTitle = idMatch[1].replace(/_/g, ' ');
      }

      // Format dialogue lines cleanly
      const cleanLines = cleanedBlock
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          return line.replace(/\[LINE\s+SPEAKER=([^\s\]]+)[^\]]*\]/gi, '$1: ')
                     .replace(/\[\/LINE\]/gi, '');
        });

      if (cleanLines.length > 0) {
        slides.push({
          id: 'slide_' + (slides.length + 1),
          title: slideTitle,
          content: cleanLines
        });
      }
    });

    if (slides.length === 0) {
      slides.push({
        id: 'slide_1',
        title: 'Overview',
        content: [rawText]
      });
    }

    return {
      title,
      slides
    };
  } catch (err) {
    console.error('Error in parseDocx:', err);
    throw err;
  }
}
