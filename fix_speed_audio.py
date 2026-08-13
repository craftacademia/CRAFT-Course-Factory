import os

base = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/runtime'

# ── 1. Add createAudio() to browserRuntime.js ────────────────────────────────

br_path = os.path.join(base, 'browser/browserRuntime.js')

with open(br_path) as f:
    br = f.read()

if 'createAudio(' in br:
    print('1. createAudio already in browserRuntime — skipping')
else:
    # Add after the constructor's closing area — find findDialogueAudio method
    old = '    findDialogueAudio(voiceId) {'
    new = '''    createAudio(src) {
        const audio = new Audio(src);
        if (this._playbackRate) audio.playbackRate = this._playbackRate;
        if (this._volume !== undefined) audio.volume = this._volume;
        return audio;
    }



    findDialogueAudio(voiceId) {'''

    assert br.count(old) == 1, f'findDialogueAudio anchor: {br.count(old)}'
    br = br.replace(old, new)

    # Replace all new Audio( in browserRuntime.js with this.createAudio(
    br = br.replace('new Audio(\n', 'this.createAudio(\n')
    br = br.replace("new Audio(`./", "this.createAudio(`./")

    with open(br_path, 'w') as f:
        f.write(br)
    print('1. createAudio() added to browserRuntime.js, internal calls updated')


# ── 2. Update renderer files — replace new Audio( with runtime.createAudio( ──

renderer_files = [
    'renderers/branchingRenderer.js',
    'renderers/dragDropRenderer.js',
    'renderers/mcqRenderer.js',
    'renderers/hotspotRenderer.js',
]

for fname in renderer_files:
    fpath = os.path.join(base, fname)
    with open(fpath) as f:
        content = f.read()

    original = content
    content = content.replace('new Audio(`./$(', 'runtime.createAudio(`./$(')  # safety
    content = content.replace("new Audio(`./${audioAsset.src}`)", "runtime.createAudio(`./${audioAsset.src}`)")
    content = content.replace("new Audio(`./${feedbackAudio.src}`)", "runtime.createAudio(`./${feedbackAudio.src}`)")
    content = content.replace("new Audio(\n", "runtime.createAudio(\n")
    content = content.replace("new Audio(`", "runtime.createAudio(`")

    if content != original:
        with open(fpath, 'w') as f:
            f.write(content)
        print(f'2. Updated {fname}')
    else:
        print(f'2. No change needed in {fname}')


# ── 3. Verify no new Audio( remain in runtime (except assetLoader) ────────────

import subprocess
result = subprocess.run(
    ['grep', '-rn', 'new Audio(', base, '--include=*.js'],
    capture_output=True, text=True
)
remaining = [l for l in result.stdout.strip().split('\n') if l and 'assetLoader' not in l and 'createAudio' not in l]
if remaining:
    print('WARNING — remaining new Audio() calls:')
    for l in remaining:
        print(' ', l)
else:
    print('3. All new Audio() calls replaced — clean')

print('\nDone')
