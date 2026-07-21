(function () {
  let scormVersion = '1.2';
  let isInitialized = false;

  function initSCORM() {
    if (typeof pipwerks !== 'undefined' && pipwerks.SCORM) {
      isInitialized = pipwerks.SCORM.init();
      if (isInitialized) {
        scormVersion = pipwerks.SCORM.version;
        console.log(`✅ SCORM Engine Active (${scormVersion})`);
      }
    }
  }

  function recordAnswer(questionId, score, maxScore) {
    if (!isInitialized) return;
    
    if (scormVersion === '1.2') {
      pipwerks.SCORM.set('cmi.core.score.raw', score.toString());
      pipwerks.SCORM.set('cmi.core.score.max', maxScore.toString());
    } else {
      pipwerks.SCORM.set('cmi.score.raw', score.toString());
      pipwerks.SCORM.set('cmi.score.max', maxScore.toString());
      pipwerks.SCORM.set('cmi.score.scaled', (score / maxScore).toFixed(2));
    }
    pipwerks.SCORM.save();
  }

  function recordInteraction(id, responseText, isCorrect, points) {
    if (!isInitialized) return;

    try {
      const count = parseInt(pipwerks.SCORM.get('cmi.interactions._count') || '0', 10);
      const prefix = `cmi.interactions.${count}.`;

      if (scormVersion === '1.2') {
        pipwerks.SCORM.set(`${prefix}id`, id);
        pipwerks.SCORM.set(`${prefix}type`, 'fill-in');
        pipwerks.SCORM.set(`${prefix}student_response`, responseText.substring(0, 255));
        pipwerks.SCORM.set(`${prefix}result`, isCorrect ? 'correct' : 'wrong');
      } else {
        pipwerks.SCORM.set(`${prefix}id`, id);
        pipwerks.SCORM.set(`${prefix}type`, 'long-fill-in');
        pipwerks.SCORM.set(`${prefix}learner_response`, responseText);
        pipwerks.SCORM.set(`${prefix}result`, isCorrect ? 'correct' : 'incorrect');
      }
      pipwerks.SCORM.save();
    } catch (e) {
      console.warn('⚠️ Interaction logging warning:', e);
    }
  }

  function completeCourse(passed) {
    if (!isInitialized) return;
    
    const status = passed ? 'passed' : 'failed';
    if (scormVersion === '1.2') {
      pipwerks.SCORM.set('cmi.core.lesson_status', status);
    } else {
      pipwerks.SCORM.set('cmi.completion_status', 'completed');
      pipwerks.SCORM.set('cmi.success_status', status);
    }
    pipwerks.SCORM.save();
    pipwerks.SCORM.quit();
  }

  window.scormEngine = {
    init: initSCORM,
    recordAnswer: recordAnswer,
    recordInteraction: recordInteraction,
    completeCourse: completeCourse
  };

  document.addEventListener('DOMContentLoaded', initSCORM);
})();
