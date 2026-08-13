path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime/runtime.js'
with open(path) as f:
    content = f.read()

old = """    let isPaused = false;
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
    }"""

new = """    // Pause — disabled until a safe implementation is built
    // Pausing mid-sequence causes VO jumbling across interactions
    const pauseBtn = document.getElementById("craft-pause-btn");
    if (pauseBtn) {
        pauseBtn.style.opacity = '0.4';
        pauseBtn.style.cursor = 'not-allowed';
        pauseBtn.title = 'Coming soon';
    }"""

count = content.count(old)
assert count == 1, f'count: {count}'
content = content.replace(old, new)
with open(path, 'w') as f:
    f.write(content)
print('Done')
