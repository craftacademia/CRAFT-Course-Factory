/**
 * CRAFT SCORM Bridge
 * Supports SCORM 1.2 and SCORM 2004 (3rd/4th edition)
 * No external dependencies — raw LMS API calls only
 */
(function () {

    'use strict';

    // ── LMS API Discovery ────────────────────────────────────────────────────

    function findAPI(win) {
        var attempts = 0;
        while (win.API == null && win.API_1484_11 == null && win.parent != null && win.parent != win) {
            attempts++;
            if (attempts > 10) return null;
            win = win.parent;
        }
        return win.API_1484_11 || win.API || null;
    }

    function getAPI() {
        var api = findAPI(window);
        if (!api && window.opener) api = findAPI(window.opener);
        return api;
    }


    // ── State ─────────────────────────────────────────────────────────────────

    var api          = null;
    var version      = null;   // '1.2' or '2004'
    var initialized  = false;
    var startTime    = null;
    var interactionCount = 0;


    // ── Init ──────────────────────────────────────────────────────────────────

    function init() {
        api = getAPI();
        if (!api) {
            console.warn('[SCORM] No LMS API found — running in standalone mode');
            return false;
        }

        var result12   = typeof api.LMSInitialize   === 'function' ? api.LMSInitialize('')   : null;
        var result2004 = typeof api.Initialize       === 'function' ? api.Initialize('')       : null;

        if (result2004 === 'true' || result2004 === true) {
            version = '2004';
        } else if (result12 === 'true' || result12 === true) {
            version = '1.2';
        } else {
            console.warn('[SCORM] LMSInitialize failed');
            return false;
        }

        initialized = true;
        startTime   = new Date();
        console.log('[SCORM] Initialized — version', version);
        return true;
    }


    // ── Get / Set ─────────────────────────────────────────────────────────────

    function get(key) {
        if (!initialized) return '';
        try {
            return version === '2004' ? api.GetValue(key) : api.LMSGetValue(key);
        } catch (e) { return ''; }
    }

    function set(key, value) {
        if (!initialized) return false;
        try {
            var result = version === '2004'
                ? api.SetValue(key, value)
                : api.LMSSetValue(key, value);
            return result === 'true' || result === true;
        } catch (e) { return false; }
    }

    function save() {
        if (!initialized) return;
        try {
            version === '2004' ? api.Commit('') : api.LMSCommit('');
        } catch (e) {}
    }


    // ── Learner Info ──────────────────────────────────────────────────────────

    function getLearnerName() {
        if (!initialized) return '';
        return version === '2004'
            ? get('cmi.learner_name')
            : get('cmi.core.student_name');
    }

    function getLearnerId() {
        if (!initialized) return '';
        return version === '2004'
            ? get('cmi.learner_id')
            : get('cmi.core.student_id');
    }


    // ── Time ─────────────────────────────────────────────────────────────────

    function formatTime12(seconds) {
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = Math.floor(seconds % 60);
        return pad(h) + ':' + pad(m) + ':' + pad(s);
    }

    function formatTime2004(seconds) {
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = Math.floor(seconds % 60);
        return 'PT' + h + 'H' + m + 'M' + s + 'S';
    }

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function setTimeSpent() {
        if (!startTime) return;
        var seconds = Math.floor((new Date() - startTime) / 1000);
        if (version === '2004') {
            set('cmi.session_time', formatTime2004(seconds));
        } else {
            set('cmi.core.session_time', formatTime12(seconds));
        }
    }


    // ── Score ─────────────────────────────────────────────────────────────────

    function setScore(raw, max, min) {
        min = min || 0;
        if (version === '2004') {
            set('cmi.score.raw',    String(raw));
            set('cmi.score.max',    String(max));
            set('cmi.score.min',    String(min));
            set('cmi.score.scaled', max > 0 ? (raw / max).toFixed(4) : '0');
        } else {
            set('cmi.core.score.raw', String(raw));
            set('cmi.core.score.max', String(max));
            set('cmi.core.score.min', String(min));
        }
        save();
    }


    // ── Interactions ──────────────────────────────────────────────────────────

    function recordInteraction(id, type, response, correct, result, latency) {
        if (!initialized) return;
        var n = interactionCount++;
        var p = 'cmi.interactions.' + n + '.';

        if (version === '2004') {
            set(p + 'id',               id.substring(0, 4096));
            set(p + 'type',             type || 'choice');
            set(p + 'learner_response', String(response).substring(0, 4096));
            set(p + 'correct_responses.0.pattern', String(correct));
            set(p + 'result',           result || 'unknown');
            if (latency) set(p + 'latency', latency);
        } else {
            set(p + 'id',               id.substring(0, 255));
            set(p + 'type',             'choice');
            set(p + 'student_response', String(response).substring(0, 255));
            set(p + 'correct_responses.0.pattern', String(correct));
            set(p + 'result',           result === 'correct' ? 'correct' : 'wrong');
        }
        save();
    }


    // ── Bookmark / Suspend ────────────────────────────────────────────────────

    function getSuspendData() {
        return get(version === '2004' ? 'cmi.suspend_data' : 'cmi.suspend_data') || '';
    }

    function setSuspendData(data) {
        var str = typeof data === 'object' ? JSON.stringify(data) : String(data);
        set('cmi.suspend_data', str.substring(0, 4096));
        save();
    }

    function getLocation() {
        return version === '2004'
            ? get('cmi.location')
            : get('cmi.core.lesson_location');
    }

    function setLocation(loc) {
        if (version === '2004') {
            set('cmi.location', String(loc).substring(0, 1000));
        } else {
            set('cmi.core.lesson_location', String(loc).substring(0, 255));
        }
        save();
    }


    // ── Completion ────────────────────────────────────────────────────────────

    function complete(passed, score, max) {
        if (!initialized) return;

        setTimeSpent();

        if (score !== undefined && max !== undefined) {
            setScore(score, max);
        }

        if (version === '2004') {
            set('cmi.completion_status', 'completed');
            set('cmi.success_status',    passed ? 'passed' : 'failed');
        } else {
            set('cmi.core.lesson_status', passed ? 'passed' : 'failed');
        }

        save();
        try {
            version === '2004' ? api.Terminate('') : api.LMSFinish('');
        } catch (e) {}
    }


    // ── Entry status (new / resume) ───────────────────────────────────────────

    function isResume() {
        var entry = version === '2004'
            ? get('cmi.entry')
            : get('cmi.core.entry');
        return entry === 'resume';
    }


    // ── Public API ────────────────────────────────────────────────────────────

    window.CRAFT_SCORM = {
        init:              init,
        getLearnerName:    getLearnerName,
        getLearnerId:      getLearnerId,
        setScore:          setScore,
        recordInteraction: recordInteraction,
        getSuspendData:    getSuspendData,
        setSuspendData:    setSuspendData,
        getLocation:       getLocation,
        setLocation:       setLocation,
        complete:          complete,
        isResume:          isResume,
        isActive:          function() { return initialized; }
    };

    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Save time on unload
    window.addEventListener('beforeunload', function() {
        setTimeSpent();
        save();
    });

})();
