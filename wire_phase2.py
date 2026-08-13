base = '/Users/debraj/projects/craft-course-factory 2.0 copy'

# ── 1. Add COURSE_CONFIG to ccirProvider.js ───────────────────────────────────

ccir_path = base + '/src/providers/ccir/ccirProvider.js'

with open(ccir_path) as f:
    ccir = f.read()

if 'COURSE_CONFIG' in ccir:
    print('1. COURSE_CONFIG already in ccirProvider — skipping')
else:
    # Find where course title is parsed and add config parsing nearby
    old = """        const ccir = {

            version:"1.0",

            generatedAt:
            new Date().toISOString(),


            course:{

                id:null,

                title:
                this.findTitle(ast),

                version:null

            },"""

    new = """        // Parse COURSE_CONFIG tag
        const configNode = (ast.children ?? []).find(c => c.type === 'COURSE_CONFIG');
        const courseConfig = configNode ? {
            back:       (this.attr(configNode, 'back',       'BACK')       ?? 'true') !== 'false',
            replay:     (this.attr(configNode, 'replay',     'REPLAY')     ?? 'true') !== 'false',
            speed:      (this.attr(configNode, 'speed',      'SPEED')      ?? 'true') !== 'false',
            volume:     (this.attr(configNode, 'volume',     'VOLUME')     ?? 'true') !== 'false',
            fullscreen: (this.attr(configNode, 'fullscreen', 'FULLSCREEN') ?? 'true') !== 'false',
            pause:      (this.attr(configNode, 'pause',      'PAUSE')      ?? 'true') !== 'false',
        } : { back:true, replay:true, speed:true, volume:true, fullscreen:true, pause:true };

        const ccir = {

            version:"1.0",

            generatedAt:
            new Date().toISOString(),


            course:{

                id:null,

                title:
                this.findTitle(ast),

                version:null,

                config: courseConfig

            },"""

    assert ccir.count(old) == 1, f'ccir anchor count: {ccir.count(old)}'
    ccir = ccir.replace(old, new)

    with open(ccir_path, 'w') as f:
        f.write(ccir)
    print('1. COURSE_CONFIG added to ccirProvider')


# ── 2. Update runtimeBuilder.js — new chrome + all controls ──────────────────

rb_path = base + '/src/providers/rendering/runtime/runtimeBuilder.js'

with open(rb_path) as f:
    rb = f.read()

old_entry_start = "        const runtimeEntry = `\nimport BrowserRuntime from \"./browser/browserRuntime.js\";"
old_entry_end   = "mountPromise.catch(\n    error => console.error(error)\n);\n`;"

start_idx = rb.index(old_entry_start)
end_idx   = rb.index(old_entry_end) + len(old_entry_end)

old_entry = rb[start_idx:end_idx]

new_entry = r"""        const runtimeEntry = `
import BrowserRuntime from "./browser/browserRuntime.js";

console.log("CRAFT Runtime Loaded");

const course  = window.PIR;
const config  = course?.course?.config ?? {};
const BACK        = config.back       !== false;
const REPLAY      = config.replay     !== false;
const SPEED       = config.speed      !== false;
const VOLUME      = config.volume     !== false;
const FULLSCREEN  = config.fullscreen !== false;
const PAUSE       = config.pause      !== false;

const app = document.getElementById("app");

app.innerHTML = \`
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
        \${FULLSCREEN  ? '<button class="craft-icon-btn" id="craft-fullscreen-btn" title="Fullscreen">&#x26F6;</button>' : ''}
        \${SPEED       ? '<select class="craft-icon-btn" id="craft-speed-select" title="Speed"><option value="0.75">0.75x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option></select>' : ''}
        \${VOLUME      ? '<input type="range" id="craft-volume-slider" min="0" max="1" step="0.05" value="1" title="Volume" style="width:80px;">' : ''}
    </div>
</div>

<div class="craft-progress-track">
    <div class="craft-progress-fill" id="craft-progress-fill"></div>
</div>

<div class="craft-player-stage" id="craft-stage"></div>

<div class="craft-player-footer">
    \${BACK   ? '<button class="craft-nav-btn" id="craft-back-btn">&larr; Back</button>'       : '<span></span>'}
    <div style="display:flex;gap:8px;">
        \${REPLAY ? '<button class="craft-nav-btn" id="craft-replay-btn">&#8635; Replay</button>' : ''}
        \${PAUSE  ? '<button class="craft-nav-btn" id="craft-pause-btn">&#10073;&#10073; Pause</button>' : ''}
    </div>
    <button class="craft-nav-btn" id="craft-next-btn">Next &rarr;</button>
</div>
\`;

const stage = document.getElementById("craft-stage");
const runtime = new BrowserRuntime(stage);

// ── Control handlers ──────────────────────────────────────────────────────────

// Pause / Play
let isPaused = false;
const pauseBtn = document.getElementById("craft-pause-btn");
if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
        isPaused = !isPaused;
        if (isPaused) {
            if (runtime.currentAudio) runtime.currentAudio.pause();
            pauseBtn.innerHTML = "&#9654; Play";
        } else {
            if (runtime.currentAudio) runtime.currentAudio.play().catch(() => {});
            pauseBtn.innerHTML = "&#10073;&#10073; Pause";
        }
    });
}

// Speed
const speedSelect = document.getElementById("craft-speed-select");
if (speedSelect) {
    speedSelect.addEventListener("change", () => {
        const rate = parseFloat(speedSelect.value);
        if (runtime.currentAudio) runtime.currentAudio.playbackRate = rate;
        // Store for future audio
        runtime._playbackRate = rate;
    });
}

// Volume
const volumeSlider = document.getElementById("craft-volume-slider");
if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
        const vol = parseFloat(volumeSlider.value);
        if (runtime.currentAudio) runtime.currentAudio.volume = vol;
        runtime._volume = vol;
    });
}

// Replay — restart current page
const replayBtn = document.getElementById("craft-replay-btn");
if (replayBtn) {
    replayBtn.addEventListener("click", () => {
        isPaused = false;
        if (pauseBtn) pauseBtn.innerHTML = "&#10073;&#10073; Pause";
        if (runtime.currentAudio) { runtime.currentAudio.pause(); runtime.currentAudio = null; }
        runtime.renderCurrentPage();
    });
}

// Fullscreen
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

// Apply playback rate and volume to each new audio element
const origFindDialogueAudio = runtime.findDialogueAudio.bind(runtime);
runtime.findDialogueAudio = function(voiceId) {
    const asset = origFindDialogueAudio(voiceId);
    return asset;
};

// Patch currentAudio setter to apply rate/volume
const _runtimeAudioProxy = new Proxy(runtime, {
    set(target, prop, value) {
        if (prop === 'currentAudio' && value instanceof Audio) {
            if (target._playbackRate) value.playbackRate = target._playbackRate;
            if (target._volume !== undefined) value.volume = target._volume;
        }
        target[prop] = value;
        return true;
    }
});

// ── Gating functions ──────────────────────────────────────────────────────────

function currentPageHasUnreadTabPanel() {
    const currentPage = runtime.navigation.current();
    for (const layer of currentPage?.layers ?? []) {
        for (const component of layer.components ?? []) {
            if (component.type !== "TAB_PANEL") continue;
            const isRead = runtime.state.variables.get(\`tabPanel.\${component.id}\`) === true;
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
            const isRead = runtime.state.variables.get(\`revealPanel.\${component.id}\`) === true;
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
            const isResolved = runtime.state.variables.get(\`dragDrop.\${component.id}\`)?.resolved === true;
            if (!isResolved) return true;
        }
    }
    return false;
}

function computeTotalScore() {
    const allVars = runtime.state.variables.all();
    let total = 0;
    for (const [key, value] of Object.entries(allVars)) {
        if (key.startsWith("branching.")) {
            total += Number(value?.option?.score) || 0;
        } else if (key.startsWith("dragDrop.")) {
            total += Number(value?.score) || 0;
        }
    }
    return total;
}

function computeOverallMaxScore() {
    let total = 0;
    for (const page of runtime.course?.pages ?? []) {
        for (const layer of page.layers ?? []) {
            for (const component of layer.components ?? []) {
                if (component.type === "SCORE_CHECKPOINT") {
                    total += Number(component.properties?.max) || 0;
                }
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
            const alreadyChosen = runtime.state.variables.has(\`branching.\${component.id}\`);
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
    if (counterEl) counterEl.textContent = \`Scene \${index + 1} of \${total}\`;

    const fillEl = document.getElementById("craft-progress-fill");
    if (fillEl) fillEl.style.width = \`\${progress}%\`;

    const scoreEl = document.getElementById("craft-score-display");
    if (scoreEl) scoreEl.textContent = \`Score: \${computeTotalScore()}/\${computeOverallMaxScore()}\`;

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

runtime.onStateChange = updateChrome;
runtime.computeTotalScore = computeTotalScore;

if (BACK) {
    const backBtn = document.getElementById("craft-back-btn");
    if (backBtn) backBtn.addEventListener("click", () => runtime.previous());
}
document.getElementById("craft-next-btn").addEventListener("click", () => runtime.next());

const titleEl = document.getElementById("craft-course-title");
if (titleEl) titleEl.textContent = course?.course?.title ?? "Course";

const logoEl = document.getElementById("craft-logo");
const logoSrc = course?.branding?.logo?.src;
if (logoEl) {
    if (logoSrc) {
        logoEl.innerHTML = \`<img src="./\${logoSrc}" alt="">\`;
    } else {
        logoEl.textContent = "LOGO";
    }
}

// ── SCORM integration ──────────────────────────────────────────────────────────

const scorm = window.CRAFT_SCORM;

if (scorm && scorm.isActive()) {
    const learnerName = scorm.getLearnerName();
    if (learnerName && titleEl) {
        console.log('[SCORM] Learner:', learnerName, scorm.getLearnerId());
    }
}

const savedLocation = scorm ? scorm.getLocation() : null;
const suspendRaw    = scorm ? scorm.getSuspendData() : null;
let   suspendData   = null;
try { suspendData = suspendRaw ? JSON.parse(suspendRaw) : null; } catch(e) {}

const mountPromise = runtime.mount(course);

mountPromise.then(() => {
    if (scorm && scorm.isResume() && savedLocation) {
        runtime.navigate(savedLocation).catch(() => {});
    }
    if (suspendData && suspendData.variables && runtime.state && runtime.state.variables) {
        for (const [key, val] of Object.entries(suspendData.variables)) {
            runtime.state.variables.set(key, val);
        }
    }
}).catch(e => console.error(e));

runtime.navigation.on("afterNavigate", () => {
    updateChrome();
    if (!scorm || !scorm.isActive()) return;
    const currentPage = runtime.navigation.current();
    if (!currentPage) return;
    scorm.setLocation(currentPage.id);
    const allVars = runtime.state && runtime.state.variables && typeof runtime.state.variables.all === 'function'
        ? runtime.state.variables.all() : {};
    const scored = {};
    for (const [k, v] of Object.entries(allVars)) {
        if (k.startsWith('branching.') || k.startsWith('dragDrop.')) scored[k] = v;
    }
    scorm.setSuspendData({ variables: scored, location: currentPage.id });
    const total    = computeTotalScore();
    const maxScore = computeOverallMaxScore();
    scorm.setScore(total, maxScore);
    if (!runtime.navigation.hasNext()) {
        const passScore = course.passScore || 70;
        const pct       = maxScore > 0 ? (total / maxScore) * 100 : 0;
        scorm.complete(pct >= passScore, total, maxScore);
    }
});

const origOnStateChange = updateChrome;
runtime.onStateChange = function() {
    origOnStateChange();
    if (!scorm || !scorm.isActive()) return;
    const allVars = runtime.state && runtime.state.variables && typeof runtime.state.variables.all === 'function'
        ? runtime.state.variables.all() : {};
    for (const [key, val] of Object.entries(allVars)) {
        if (!key.startsWith('branching.') && !key.startsWith('dragDrop.')) continue;
        if (val && !val._scormRecorded) {
            val._scormRecorded = true;
            const response = val.option ? (val.option.letter || val.option.text || '') : String(val);
            const score    = val.option ? Number(val.option.score || 0) : (val.score || 0);
            const maxOpt   = 10;
            const correct  = score >= maxOpt ? (val.option ? val.option.letter : '') : '';
            const result   = score >= maxOpt ? 'correct' : 'incorrect';
            scorm.recordInteraction(key, 'choice', response, correct, result);
        }
    }
};

updateChrome();

mountPromise.catch(
    error => console.error(error)
);
`;"""

assert rb.count(old_entry) == 1, f'runtimeEntry anchor count: {rb.count(old_entry)}'
rb = rb.replace(old_entry, new_entry)

with open(rb_path, 'w') as f:
    f.write(rb)
print('2. runtimeBuilder.js updated with all Phase 2 controls')

print('\nDone — restart Pane-1, rebuild, test all controls')
