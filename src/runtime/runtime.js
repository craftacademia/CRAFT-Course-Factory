import BrowserRuntime from "./browser/browserRuntime.js";

console.log("CRAFT Runtime Loaded");

const app = document.getElementById("app");

// Course data — try window.PIR first, fall back to course.json
async function loadCourse() {
    try {
        const res = await fetch("./data/course.json");
        if (res.ok) return res.json();
    } catch(e) {}
    if (window.PIR) return window.PIR;
    throw new Error("No course data found");
}

loadCourse().then(course => {

    const config     = course?.course?.config ?? {};
    const BACK       = config.back       !== false;
    const PAUSE      = config.pause      !== false;
    const REPLAY     = config.replay     !== false;
    const SPEED      = config.speed      !== false;
    const VOLUME     = config.volume     !== false;
    const FULLSCREEN = config.fullscreen !== false;

    app.innerHTML = `
<div class="craft-player-header">
    <div class="craft-header-left">
        <div class="craft-logo" id="craft-logo"></div>
        <div class="craft-header-text">
            <div class="craft-course-title" id="craft-course-title">Course</div>
            <div class="craft-scene-counter" id="craft-scene-counter">Scene 1 of 1</div>
        </div>
    </div>
    <div class="craft-score-display" id="craft-score-display">Score: 0</div>
    <div class="craft-actions">
        ${FULLSCREEN ? '<button class="craft-icon-btn" id="craft-fullscreen-btn" title="Fullscreen">&#x26F6;</button>' : ''}
        ${SPEED      ? '<select class="craft-icon-btn" id="craft-speed-select" title="Speed"><option value="0.75">0.75x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option></select>' : ''}
        ${VOLUME     ? '<input type="range" id="craft-volume-slider" min="0" max="1" step="0.05" value="1" title="Volume" style="width:80px;cursor:pointer;">' : ''}
    </div>
</div>

<div class="craft-progress-track">
    <div class="craft-progress-fill" id="craft-progress-fill"></div>
</div>

<div class="craft-player-stage" id="craft-stage"></div>

<div class="craft-player-footer">
    ${BACK   ? '<button class="craft-nav-btn" id="craft-back-btn">&larr; Back</button>'           : '<span></span>'}
    <div style="display:flex;gap:8px;align-items:center;">
        ${REPLAY ? '<button class="craft-nav-btn" id="craft-replay-btn">&#8635; Replay</button>' : ''}
        ${PAUSE  ? '<button class="craft-nav-btn" id="craft-pause-btn">&#10073;&#10073; Pause</button>' : ''}
    </div>
    <button class="craft-nav-btn" id="craft-next-btn">Next &rarr;</button>
</div>
`;

    // Tilt overlay for portrait phones
    const tiltOverlay = document.createElement('div');
    tiltOverlay.id = 'craft-tilt-overlay';
    tiltOverlay.innerHTML = '<div class="craft-tilt-icon">📱</div><div class="craft-tilt-text">Please rotate your device<br>for the best experience</div>';
    document.body.appendChild(tiltOverlay);

    function checkOrientation() {
        const isPhone   = window.innerWidth < 768 || window.innerHeight < 768;
        const isPortrait = window.innerHeight > window.innerWidth;
        if (isPhone && isPortrait) {
            tiltOverlay.classList.add('visible');
        } else {
            tiltOverlay.classList.remove('visible');
        }
    }

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    const stage   = document.getElementById("craft-stage");
    const runtime = new BrowserRuntime(stage);
    window.__craftRuntime = runtime;

    // ── Pause ──────────────────────────────────────────────────────────────────
    // Pause — disabled until a safe implementation is built
    // Pausing mid-sequence causes VO jumbling across interactions
    const pauseBtn = document.getElementById("craft-pause-btn");
    if (pauseBtn) {
        pauseBtn.addEventListener("click", () => {
            if (runtime._paused) {
                runtime.resume();
                pauseBtn.innerHTML = "&#10073;&#10073; Pause";
            } else {
                runtime.pause();
                pauseBtn.innerHTML = "&#9654; Play";
            }
        });
    }

    // ── Speed ──────────────────────────────────────────────────────────────────
    const speedSelect = document.getElementById("craft-speed-select");
    if (speedSelect) {
        speedSelect.addEventListener("change", () => {
            const rate = parseFloat(speedSelect.value);
            if (runtime.currentAudio) runtime.currentAudio.playbackRate = rate;
            runtime._playbackRate = rate;
        });
    }

    // ── Volume ─────────────────────────────────────────────────────────────────
    const volumeSlider = document.getElementById("craft-volume-slider");
    if (volumeSlider) {
        volumeSlider.addEventListener("input", () => {
            const vol = parseFloat(volumeSlider.value);
            if (runtime.currentAudio) runtime.currentAudio.volume = vol;
            runtime._volume = vol;
        });
    }

    // ── Replay ─────────────────────────────────────────────────────────────────
    const replayBtn = document.getElementById("craft-replay-btn");
    if (replayBtn) {
        replayBtn.style.opacity = '0.4';
        replayBtn.style.cursor = 'not-allowed';
        replayBtn.title = 'Coming soon';
    }

    // ── Fullscreen ─────────────────────────────────────────────────────────────
    const fullscreenBtn = document.getElementById("craft-fullscreen-btn");
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
                fullscreenBtn.innerHTML = "&#x2715;";
            } else {
                document.exitFullscreen().catch(() => {});
                fullscreenBtn.innerHTML = "&#x26F6;";
            }
        });
    }

    // ── Gating functions ───────────────────────────────────────────────────────

    function currentPageHasUnreadTabPanel() {
        const currentPage = runtime.navigation.current();
        for (const layer of currentPage?.layers ?? []) {
            for (const component of layer.components ?? []) {
                if (component.type !== "TAB_PANEL") continue;
                const isRead = runtime.state.variables.get(`tabPanel.${component.id}`) === true;
                if (!isRead) return true;
            }
        }
        return false;
    }

    function currentPageHasUnreadRevealPanel() {
        const currentPage = runtime.navigation.current();
        for (const layer of currentPage?.layers ?? []) {
            for (const component of layer.components ?? []) {
                if (component.type !== "REVEAL_PANEL") continue;
                const isRead = runtime.state.variables.get(`revealPanel.${component.id}`) === true;
                if (!isRead) return true;
            }
        }
        return false;
    }

    function currentPageHasUnresolvedDragDrop() {
        const currentPage = runtime.navigation.current();
        for (const layer of currentPage?.layers ?? []) {
            for (const component of layer.components ?? []) {
                if (component.type !== "DRAG_DROP") continue;
                const isResolved = runtime.state.variables.get(`dragDrop.${component.id}`)?.resolved === true;
                if (!isResolved) return true;
            }
        }
        return false;
    }

    function computeTotalScore() {
        const allVars = runtime.state.variables.all();
        let total = 0;
        for (const [key, value] of Object.entries(allVars)) {
            if (key.startsWith("branching.")) total += Number(value?.option?.score) || 0;
            else if (key.startsWith("dragDrop.")) total += Number(value?.score) || 0;
        }
        return total;
    }

    function computeOverallMaxScore() {
        let total = 0;
        for (const page of runtime.course?.pages ?? []) {
            for (const layer of page.layers ?? []) {
                for (const component of layer.components ?? []) {
                    if (component.type === "SCORE_CHECKPOINT") total += Number(component.properties?.max) || 0;
                }
            }
        }
        return total;
    }

    function currentPageHasUnresolvedBranching() {
        const currentPage = runtime.navigation.current();
        for (const layer of currentPage?.layers ?? []) {
            for (const component of layer.components ?? []) {
                if (component.type !== "BRANCHING") continue;
                const alreadyChosen = runtime.state.variables.has(`branching.${component.id}`);
                if (!alreadyChosen) return true;
            }
        }
        return false;
    }

    function updateChrome() {
        const total    = runtime.navigation.totalPages();
        const index    = runtime.navigation.currentIndex();
        const progress = runtime.navigation.progress();

        const counterEl = document.getElementById("craft-scene-counter");
        if (counterEl) counterEl.textContent = `Scene ${index + 1} of ${total}`;

        const fillEl = document.getElementById("craft-progress-fill");
        if (fillEl) fillEl.style.width = `${progress}%`;

        const scoreEl = document.getElementById("craft-score-display");
        if (scoreEl) scoreEl.textContent = `Score: ${computeTotalScore()}/${computeOverallMaxScore()}`;

        const backBtn = document.getElementById("craft-back-btn");
        if (backBtn) {
            backBtn.disabled = !runtime.dialogueComplete || !runtime.navigation.hasPrevious();
        }

        const nextBtn = document.getElementById("craft-next-btn");
        if (nextBtn) {
            nextBtn.disabled =
                !runtime.dialogueComplete ||
                currentPageHasUnresolvedBranching() ||
                currentPageHasUnreadTabPanel() ||
                currentPageHasUnreadRevealPanel() ||
                currentPageHasUnresolvedDragDrop() ||
                !runtime.navigation.hasNext();
        }
    }

    runtime.onStateChange    = updateChrome;
    runtime.computeTotalScore = computeTotalScore;

    if (BACK) {
        const backBtn = document.getElementById("craft-back-btn");
        if (backBtn) backBtn.addEventListener("click", () => runtime.previous());
    }
    document.getElementById("craft-next-btn").addEventListener("click", () => runtime.next());

    // ── Branding ───────────────────────────────────────────────────────────────

    const titleEl = document.getElementById("craft-course-title");
    if (titleEl) titleEl.textContent = course?.course?.title ?? "Course";

    const logoEl  = document.getElementById("craft-logo");
    const logoSrc = course?.branding?.logo?.src;
    if (logoEl) {
        if (logoSrc) logoEl.innerHTML = `<img src="./${logoSrc}" alt="">`;
        else logoEl.textContent = "LOGO";
    }

    // ── SCORM ──────────────────────────────────────────────────────────────────

    const scorm = window.CRAFT_SCORM;

    if (scorm && scorm.isActive()) {
        console.log("[SCORM] Learner:", scorm.getLearnerName(), scorm.getLearnerId());
    }

    const savedLocation = scorm ? scorm.getLocation() : null;
    let suspendData = null;
    try { suspendData = scorm ? JSON.parse(scorm.getSuspendData() || "null") : null; } catch(e) {}

    const mountPromise = runtime.mount(course);

    mountPromise.then(() => {
        if (scorm && scorm.isResume() && savedLocation) {
            runtime.navigate(savedLocation).catch(() => {});
        }
        if (suspendData?.variables && runtime.state?.variables) {
            for (const [k, v] of Object.entries(suspendData.variables)) {
                runtime.state.variables.set(k, v);
            }
        }
    }).catch(e => console.error(e));

    runtime.navigation.on("afterNavigate", () => {
        updateChrome();
        if (!scorm || !scorm.isActive()) return;
        const currentPage = runtime.navigation.current();
        if (!currentPage) return;
        scorm.setLocation(currentPage.id);
        const allVars = runtime.state?.variables?.all?.() ?? {};
        const scored = {};
        for (const [k, v] of Object.entries(allVars)) {
            if (k.startsWith("branching.") || k.startsWith("dragDrop.")) scored[k] = v;
        }
        scorm.setSuspendData({ variables: scored, location: currentPage.id });
        const total = computeTotalScore();
        const max   = computeOverallMaxScore();
        scorm.setScore(total, max);
        if (!runtime.navigation.hasNext()) {
            const passScore = course?.course?.config?.passScore || 70;
            const pct       = max > 0 ? (total / max) * 100 : 0;
            scorm.complete(pct >= passScore, total, max);
        }
    });

    runtime.onStateChange = function() {
        updateChrome();
        if (!scorm || !scorm.isActive()) return;
        const allVars = runtime.state?.variables?.all?.() ?? {};
        for (const [key, val] of Object.entries(allVars)) {
            if (!key.startsWith("branching.") && !key.startsWith("dragDrop.")) continue;
            if (val && !val._scormRecorded) {
                val._scormRecorded = true;
                const response = val.option ? (val.option.letter || "") : String(val);
                const score    = val.option ? Number(val.option.score || 0) : (val.score || 0);
                const correct  = score >= 10 ? response : "";
                scorm.recordInteraction(key, "choice", response, correct, score >= 10 ? "correct" : "incorrect");
            }
        }
    };

    updateChrome();
    mountPromise.catch(error => console.error(error));

}).catch(error => console.error("Failed to load course:", error));
