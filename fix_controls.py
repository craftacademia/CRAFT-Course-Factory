path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/runtime.js'
with open(path) as f:
    content = f.read()

# Fix 1: Remove isPaused reference from replay handler
old1 = """    if (replayBtn) {
        replayBtn.addEventListener("click", () => {
            isPaused = false;
            if (pauseBtn) pauseBtn.innerHTML = "&#10073;&#10073; Pause";
            if (runtime.currentAudio) { runtime.currentAudio.pause(); runtime.currentAudio = null; }
            runtime.renderCurrentPage();
        });
    }"""

new1 = """    if (replayBtn) {
        replayBtn.addEventListener("click", () => {
            if (runtime.currentAudio) { runtime.currentAudio.pause(); runtime.currentAudio = null; }
            if (typeof runtime.renderCurrentPage === 'function') runtime.renderCurrentPage();
        });
    }"""

assert content.count(old1) == 1, f'replay anchor: {content.count(old1)}'
content = content.replace(old1, new1)

# Fix 2: Expose runtime on window for debugging
old2 = "    const stage   = document.getElementById(\"craft-stage\");\n    const runtime = new BrowserRuntime(stage);"
new2 = "    const stage   = document.getElementById(\"craft-stage\");\n    const runtime = new BrowserRuntime(stage);\n    window.__craftRuntime = runtime;"

assert content.count(old2) == 1, f'runtime anchor: {content.count(old2)}'
content = content.replace(old2, new2)

with open(path, 'w') as f:
    f.write(content)
print('Done')
