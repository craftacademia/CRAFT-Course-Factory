path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/runtime.js'

with open(path) as f:
    content = f.read()

old = """    if (replayBtn) {
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

new = """    if (replayBtn) {
        replayBtn.style.opacity = '0.4';
        replayBtn.style.cursor = 'not-allowed';
        replayBtn.title = 'Coming soon';
    }"""

count = content.count(old)
assert count == 1, f'count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)
print('Done')
