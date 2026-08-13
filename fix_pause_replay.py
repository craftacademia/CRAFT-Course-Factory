import re

base = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime'

# ── 1. Add pause/resume/waitIfPaused to browserRuntime.js ────────────────────

br_path = base + '/browser/browserRuntime.js'

with open(br_path) as f:
    br = f.read()

if 'waitIfPaused' in br:
    print('1. waitIfPaused already in browserRuntime — skipping')
else:
    old = '    createAudio(src) {'
    new = '''    // ── Pause / Resume ────────────────────────────────────────────────────────

    pause() {
        this._paused = true;
        if (this.currentAudio) this.currentAudio.pause();
    }

    resume() {
        this._paused = false;
        if (this.currentAudio) {
            this.currentAudio.play().catch(() => {});
        }
        // Resolve all waiting promises
        const callbacks = this._pauseCallbacks ?? [];
        this._pauseCallbacks = [];
        callbacks.forEach(cb => cb());
    }

    async waitIfPaused() {
        while (this._paused) {
            await new Promise(resolve => {
                if (!this._pauseCallbacks) this._pauseCallbacks = [];
                this._pauseCallbacks.push(resolve);
            });
        }
    }



    createAudio(src) {'''

    assert br.count(old) == 1, f'createAudio anchor: {br.count(old)}'
    br = br.replace(old, new)

    # Insert waitIfPaused at start of each dialogue loop iteration
    old2 = '        for (const component of dialogueQueue) {\n\n\n            const dialogueRenderer ='
    new2 = '        for (const component of dialogueQueue) {\n\n\n            await this.waitIfPaused();\n\n\n            const dialogueRenderer ='
    assert br.count(old2) == 1, f'dialogueQueue loop anchor: {br.count(old2)}'
    br = br.replace(old2, new2)

    with open(br_path, 'w') as f:
        f.write(br)
    print('1. waitIfPaused() added to browserRuntime.js')


# ── 2. Wire Pause/Replay in runtime.js ────────────────────────────────────────

rt_path = base + '/runtime.js'

with open(rt_path) as f:
    rt = f.read()

# Replace the disabled pause stub with real implementation
old_pause = """    if (pauseBtn) {
        pauseBtn.style.opacity = '0.4';
        pauseBtn.style.cursor = 'not-allowed';
        pauseBtn.title = 'Coming soon';
    }"""

new_pause = """    if (pauseBtn) {
        pauseBtn.addEventListener("click", () => {
            if (runtime._paused) {
                runtime.resume();
                pauseBtn.innerHTML = "&#10073;&#10073; Pause";
            } else {
                runtime.pause();
                pauseBtn.innerHTML = "&#9654; Play";
            }
        });
    }"""

assert rt.count(old_pause) == 1, f'pause stub anchor: {rt.count(old_pause)}'
rt = rt.replace(old_pause, new_pause)

# Replace the disabled replay stub with real implementation
old_replay = """    if (replayBtn) {
        replayBtn.style.opacity = '0.4';
        replayBtn.style.cursor = 'not-allowed';
        replayBtn.title = 'Coming soon';
    }"""

new_replay = """    if (replayBtn) {
        replayBtn.addEventListener("click", () => {
            // Resume first if paused, then restart current page
            if (runtime._paused) {
                runtime.resume();
                if (pauseBtn) pauseBtn.innerHTML = "&#10073;&#10073; Pause";
            }
            if (runtime.currentAudio) {
                runtime.currentAudio.pause();
                runtime.currentAudio = null;
                runtime.currentAudioResolve = null;
            }
            runtime._pauseCallbacks = [];
            runtime._paused = false;
            runtime.renderCurrentPage();
        });
    }"""

assert rt.count(old_replay) == 1, f'replay stub anchor: {rt.count(old_replay)}'
rt = rt.replace(old_replay, new_replay)

with open(rt_path, 'w') as f:
    f.write(rt)
print('2. Pause and Replay wired in runtime.js')

print('\nDone — rebuild and test Pause/Replay')
