/**
 * CRAFT Course Factory - Dual SCORM 1.2 / 2004 Engine
 */
class SCORMAdapter {
  constructor() {
    this.version = null; // '1.2' | '2004' | 'standalone'
    this.api = null;
    this.state = {
      currentScreen: 'S01',
      visitedScreens: [],
      score: 0,
      maxPossibleScore: 0,
      quizAnswers: {}
    };
  }

  init() {
    this.api = this.findAPI(window);
    if (this.api) {
      if (typeof this.api.LMSInitialize === 'function') {
        this.version = '1.2';
        this.api.LMSInitialize('');
      } else if (typeof this.api.Initialize === 'function') {
        this.version = '2004';
        this.api.Initialize('');
      }
    } else {
      this.version = 'standalone';
    }
    console.log(`[SCORM] Initialized in ${this.version.toUpperCase()} mode.`);
    this.loadState();
  }

  findAPI(win) {
    let retries = 0;
    while (win && retries < 10) {
      if (win.API) return win.API;                 // SCORM 1.2
      if (win.API_1484_11) return win.API_1484_11; // SCORM 2004
      if (win.parent && win.parent !== win) win = win.parent;
      else if (win.opener) win = win.opener;
      else break;
      retries++;
    }
    return null;
  }

  // --- BOOKMARKING & SUSPEND DATA ---
  saveBookmark(screenId) {
    this.state.currentScreen = screenId;
    if (!this.state.visitedScreens.includes(screenId)) {
      this.state.visitedScreens.push(screenId);
    }

    const payload = JSON.stringify(this.state);

    if (this.version === '1.2') {
      this.api.LMSSetValue('cmi.core.lesson_location', screenId);
      this.api.LMSSetValue('cmi.suspend_data', payload);
      this.api.LMSCommit('');
    } else if (this.version === '2004') {
      this.api.SetValue('cmi.location', screenId);
      this.api.SetValue('cmi.suspend_data', payload);
      this.api.Commit('');
    }
  }

  loadState() {
    try {
      let rawData = null;
      if (this.version === '1.2') {
        rawData = this.api.LMSGetValue('cmi.suspend_data');
      } else if (this.version === '2004') {
        rawData = this.api.GetValue('cmi.suspend_data');
      }

      if (rawData && rawData !== '') {
        this.state = Object.assign(this.state, JSON.parse(rawData));
        console.log('[SCORM] Restored state:', this.state);
      }
    } catch (e) {
      console.warn('[SCORM] Unable to parse suspend_data:', e);
    }
  }

  // --- QUIZ SCORING ---
  recordAnswer(questionId, pointsEarned, maxPoints) {
    // Avoid double counting if already answered
    if (!this.state.quizAnswers[questionId]) {
      this.state.maxPossibleScore += maxPoints;
    }
    
    // Update question state
    this.state.quizAnswers[questionId] = { points: pointsEarned, max: maxPoints };
    
    // Recalculate total score
    this.state.score = Object.values(this.state.quizAnswers).reduce((acc, q) => acc + q.points, 0);
    this.state.maxPossibleScore = Object.values(this.state.quizAnswers).reduce((acc, q) => acc + q.max, 0);
  }

  // --- AUTOMATED LMS REPORTING ---
  submitFinalResults(passingPercentage = 80) {
    const totalPossible = this.state.maxPossibleScore || 100;
    const rawPercentage = Math.round((this.state.score / totalPossible) * 100);
    const isPassed = rawPercentage >= passingPercentage;

    console.log(`[SCORM] Reporting Score: ${rawPercentage}% (${isPassed ? 'PASS' : 'FAIL'})`);

    if (this.version === '1.2') {
      this.api.LMSSetValue('cmi.core.score.raw', rawPercentage.toString());
      this.api.LMSSetValue('cmi.core.score.max', '100');
      this.api.LMSSetValue('cmi.core.score.min', '0');
      this.api.LMSSetValue('cmi.core.lesson_status', isPassed ? 'passed' : 'failed');
      this.api.LMSCommit('');
    } else if (this.version === '2004') {
      this.api.SetValue('cmi.score.raw', rawPercentage.toString());
      this.api.SetValue('cmi.score.scaled', (rawPercentage / 100).toFixed(2));
      this.api.SetValue('cmi.success_status', isPassed ? 'passed' : 'failed');
      this.api.SetValue('cmi.completion_status', 'completed');
      this.api.Commit('');
    }

    return { percentage: rawPercentage, passed: isPassed };
  }

  finish() {
    if (this.version === '1.2') this.api.LMSFinish('');
    if (this.version === '2004') this.api.Terminate('');
  }
}

if (typeof module !== 'undefined') {
  module.exports = SCORMAdapter;
}
