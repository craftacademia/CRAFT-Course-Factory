import shutil
import re

base = '/Users/debraj/projects/craft-course-factory 2.0 copy'

# ── 1. Copy scorm.js to src/runtime/ ─────────────────────────────────────────
shutil.copy2(base + '/scorm.js', base + '/src/runtime/scorm.js')
print('1. Copied scorm.js to src/runtime/')

# ── 2. Replace scormBuilder.js ────────────────────────────────────────────────
shutil.copy2(base + '/scormBuilder.js', base + '/src/providers/rendering/scorm/scormBuilder.js')
print('2. Replaced scormBuilder.js')

# ── 3. Add SCORM hooks to runtimeBuilder.js entry point ──────────────────────
rb_path = base + '/src/providers/rendering/runtime/runtimeBuilder.js'

with open(rb_path) as f:
    rb = f.read()

if 'CRAFT_SCORM' in rb:
    print('3. SCORM hooks already in runtimeBuilder — skipping')
else:
    old = 'const mountPromise = runtime.mount(course);\n\nruntime.navigation.on("afterNavigate", updateChrome);\n\nupdateChrome();'

    new = '''// ── SCORM integration ──────────────────────────────────────────────────────

const scorm = window.CRAFT_SCORM;

// Learner info
if (scorm && scorm.isActive()) {
    const learnerName = scorm.getLearnerName();
    if (learnerName && titleEl) {
        console.log('[SCORM] Learner:', learnerName, scorm.getLearnerId());
    }
}

// Bookmark: resume from last location
const savedLocation = scorm ? scorm.getLocation() : null;
const suspendRaw    = scorm ? scorm.getSuspendData() : null;
let   suspendData   = null;

try { suspendData = suspendRaw ? JSON.parse(suspendRaw) : null; } catch(e) {}

const mountPromise = runtime.mount(course);

// After mount, restore bookmark if resuming
mountPromise.then(() => {

    if (scorm && scorm.isResume() && savedLocation) {
        runtime.navigate(savedLocation).catch(() => {});
    }

    // Restore saved scores from suspend data
    if (suspendData && suspendData.variables && runtime.state && runtime.state.variables) {
        for (const [key, val] of Object.entries(suspendData.variables)) {
            runtime.state.variables.set(key, val);
        }
    }

}).catch(e => console.error(e));

// On every navigation: save bookmark + suspend data
runtime.navigation.on("afterNavigate", () => {

    updateChrome();

    if (!scorm || !scorm.isActive()) return;

    const currentPage = runtime.navigation.current();
    if (!currentPage) return;

    // Save bookmark
    scorm.setLocation(currentPage.id);

    // Save all scored variables as suspend data
    const allVars = runtime.state && runtime.state.variables && typeof runtime.state.variables.all === 'function'
        ? runtime.state.variables.all()
        : {};

    const scored = {};
    for (const [k, v] of Object.entries(allVars)) {
        if (k.startsWith('branching.') || k.startsWith('dragDrop.')) {
            scored[k] = v;
        }
    }

    scorm.setSuspendData({ variables: scored, location: currentPage.id });

    // Update score
    const total    = computeTotalScore();
    const maxScore = computeOverallMaxScore();
    scorm.setScore(total, maxScore);

    // Check if last page — mark complete
    if (!runtime.navigation.hasNext()) {
        const passScore = course.passScore || 70;
        const pct       = maxScore > 0 ? (total / maxScore) * 100 : 0;
        scorm.complete(pct >= passScore, total, maxScore);
    }

});

// Record interactions when branching choices are made
const origOnStateChange = updateChrome;
runtime.onStateChange = function() {
    origOnStateChange();

    if (!scorm || !scorm.isActive()) return;

    const allVars = runtime.state && runtime.state.variables && typeof runtime.state.variables.all === 'function'
        ? runtime.state.variables.all()
        : {};

    for (const [key, val] of Object.entries(allVars)) {
        if (!key.startsWith('branching.') && !key.startsWith('dragDrop.')) continue;
        if (val && !val._scormRecorded) {
            val._scormRecorded = true;
            const id       = key;
            const response = val.option ? (val.option.letter || val.option.text || '') : String(val);
            const score    = val.option ? Number(val.option.score || 0) : (val.score || 0);
            const maxOpt   = val.option ? 10 : 10;
            const correct  = val.option ? (score >= maxOpt ? val.option.letter : '') : '';
            const result   = score >= maxOpt ? 'correct' : 'incorrect';
            scorm.recordInteraction(id, 'choice', response, correct, result);
        }
    }
};

updateChrome();'''

    assert rb.count(old) == 1, f'anchor count: {rb.count(old)}'
    rb = rb.replace(old, new)

    with open(rb_path, 'w') as f:
        f.write(rb)
    print('3. SCORM hooks added to runtimeBuilder.js')

# ── 4. Check archiver dependency ──────────────────────────────────────────────
import subprocess, json
result = subprocess.run(['node', '-e', "try{require('archiver');console.log('ok')}catch(e){console.log('missing')}"],
                       cwd=base, capture_output=True, text=True)
if 'missing' in result.stdout:
    print('4. Installing archiver...')
    subprocess.run(['npm', 'install', 'archiver', '--save'], cwd=base)
    print('4. archiver installed')
else:
    print('4. archiver already available')

print('\nDone — restart Pane-1, rebuild, then test SCORM export')
