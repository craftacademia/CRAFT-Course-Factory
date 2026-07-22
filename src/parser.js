import mammoth from 'mammoth';

/**
 * Parses the Word script document and extracts slides, interactions, 
 * quizzes (with detailed options & correct answer tracking), 
 * drag-and-drop matching pairs, and required media assets.
 */
export async function parseScript(docxPath) {
  const result = await mammoth.extractRawText({ path: docxPath });
  const rawText = result.value;

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  const slides = [];
  let currentSlide = null;
  let currentQuestion = null;

  const requiredAssets = {
    images: [],
    audio: []
  };

  for (const line of lines) {
    // 1. Detect Slide Headers (e.g., Slide 1: Intro, Screen 2 - Process, Module 1 - Quiz)
    const slideHeaderMatch = line.match(/^(Slide|Screen|Page|Module)\s*(\d+|[A-Z]+)[:\-]?\s*(.*)/i);
    if (slideHeaderMatch) {
      if (currentQuestion && currentSlide) {
        currentSlide.quizQuestions.push(currentQuestion);
        currentQuestion = null;
      }
      if (currentSlide) slides.push(currentSlide);

      currentSlide = {
        id: `slide_${slides.length + 1}`,
        title: slideHeaderMatch[0],
        type: 'content', // content, branching, quiz, drag_drop, report
        content: [],
        interactions: [],
        quizQuestions: [],
        dragDropPairs: [],
        requiredImage: null,
        requiredAudio: null,
        moduleName: 'General'
      };
      continue;
    }

    if (!currentSlide) {
      currentSlide = {
        id: 'slide_1',
        title: 'Introduction',
        type: 'content',
        content: [],
        interactions: [],
        quizQuestions: [],
        dragDropPairs: [],
        requiredImage: null,
        requiredAudio: null,
        moduleName: 'General'
      };
    }

    // 2. Detect Module Name tags (e.g., [Module: Safety Protocols])
    const moduleMatch = line.match(/\[Module:\s*(.*?)\]/i);
    if (moduleMatch) {
      currentSlide.moduleName = moduleMatch[1].trim();
      continue;
    }

    // 3. Detect Drag & Drop matching pairs
    // Formats supported:
    // [Match: Term -> Definition]
    // [Drag: Item => Target]
    // Item -> Target (when under Drag & Drop section)
    const matchTag = line.match(/\[(?:Match|Drag):\s*(.*?)\s*(?:->|=>|:)\s*(.*?)\]/i);
    if (matchTag) {
      currentSlide.type = 'drag_drop';
      currentSlide.dragDropPairs.push({
        drag: matchTag[1].trim(),
        drop: matchTag[2].trim()
      });
      continue;
    }

    const inlinePair = line.match(/^([A-Za-z0-9\s]+)\s*(?:->|=>|:=)\s*([A-Za-z0-9\s]+)$/);
    if (inlinePair && (currentSlide.type === 'drag_drop' || line.toLowerCase().includes('drag'))) {
      currentSlide.type = 'drag_drop';
      currentSlide.dragDropPairs.push({
        drag: inlinePair[1].trim(),
        drop: inlinePair[2].trim()
      });
      continue;
    }

    // 4. Detect Interactive Tool Types
    if (line.toLowerCase().includes('drag & drop') || line.toLowerCase().includes('drag and drop') || line.toLowerCase().includes('matching activity')) {
      currentSlide.type = 'drag_drop';
    }

    if (line.toLowerCase().includes('quiz') || line.toLowerCase().includes('knowledge check') || line.toLowerCase().startsWith('question:')) {
      if (currentSlide.type !== 'drag_drop') {
        currentSlide.type = 'quiz';
      }
    }

    if (line.toLowerCase().includes('branching') || line.toLowerCase().includes('decision point')) {
      currentSlide.type = 'branching';
    }

    if (line.toLowerCase().includes('final score') || line.toLowerCase().includes('module summary') || line.toLowerCase().includes('performance analysis')) {
      currentSlide.type = 'report';
    }

    // 5. Detect Asset Tags (Images & Audio/VO)
    const imgMatch = line.match(/\[(Image|Graphic|Photo):\s*(.*?)\]/i);
    if (imgMatch) {
      const imgName = imgMatch[2].trim();
      currentSlide.requiredImage = imgName;
      if (!requiredAssets.images.includes(imgName)) {
        requiredAssets.images.push(imgName);
      }
      continue;
    }

    const audioMatch = line.match(/\[(VO|Audio|Voiceover):\s*(.*?)\]/i);
    if (audioMatch) {
      const audioName = audioMatch[2].trim();
      currentSlide.requiredAudio = audioName;
      if (!requiredAssets.audio.includes(audioName)) {
        requiredAssets.audio.push(audioName);
      }
      continue;
    }

    // 6. Detect & Parse Quiz Questions and Options
    // Questions start with "Question:", "Q1:", or "1."
    const questionMatch = line.match(/^(?:Q\d+[:\.]|Question\s*\d*[:\.]?)\s*(.*)/i);
    if (questionMatch) {
      if (currentQuestion) {
        currentSlide.quizQuestions.push(currentQuestion);
      }
      currentSlide.type = 'quiz';
      currentQuestion = {
        question: questionMatch[1].trim(),
        options: [],
        correctAnswer: null
      };
      continue;
    }

    // Quiz options format: A) Option text, B) Option text (Correct), [x] Correct Option
    const optionMatch = line.match(/^([A-D])[\)\.]\s*(.*)/i);
    if (optionMatch) {
      const optionLetter = optionMatch[1].toUpperCase();
      let optionText = optionMatch[2].trim();
      const isCorrect = optionText.toLowerCase().includes('(correct)') || optionText.toLowerCase().includes('[correct]');

      optionText = optionText.replace(/\((correct)\)/gi, '').replace(/\[correct\]/gi, '').trim();

      if (!currentQuestion) {
        currentQuestion = {
          question: currentSlide.title || "Knowledge Check Question",
          options: [],
          correctAnswer: null
        };
        currentSlide.type = 'quiz';
      }

      currentQuestion.options.push({
        key: optionLetter,
        text: optionText,
        isCorrect: isCorrect
      });

      if (isCorrect) {
        currentQuestion.correctAnswer = optionLetter;
      }
      continue;
    }

    // Explicit Answer key line (e.g. "Answer: A" or "Correct Answer: B")
    const answerKeyMatch = line.match(/^(?:Correct\s*)?Answer:\s*([A-D])/i);
    if (answerKeyMatch && currentQuestion) {
      const correctKey = answerKeyMatch[1].toUpperCase();
      currentQuestion.correctAnswer = correctKey;
      currentQuestion.options.forEach(opt => {
        if (opt.key === correctKey) opt.isCorrect = true;
      });
      continue;
    }

    // Standard Slide Body Content
    currentSlide.content.push(line);
  }

  // Flush remaining quiz question
  if (currentQuestion && currentSlide) {
    currentSlide.quizQuestions.push(currentQuestion);
  }

  if (currentSlide) slides.push(currentSlide);

  // Mark last slide as the Final Report slide if not specified
  if (slides.length > 0) {
    slides[slides.length - 1].type = 'report';
    slides[slides.length - 1].title = 'Final Assessment & Performance Analysis';
  }

  return {
    slides,
    requiredAssets
  };
}
