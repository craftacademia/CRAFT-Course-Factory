base = '/Users/debraj/projects/craft-course-factory 2.0 copy'

# ── 1. Update header HTML in runtime.js ──────────────────────────────────────

rt_path = base + '/src/runtime/runtime.js'

with open(rt_path) as f:
    rt = f.read()

old_header = """<div class="craft-player-header">
    <div class="craft-header-left">
        <div class="craft-logo" id="craft-logo"></div>
        <div class="craft-scene-counter" id="craft-scene-counter">Scene 1 of 1</div>
    </div>
    <div class="craft-header-centre">
        <div class="craft-course-title" id="craft-course-title">Course</div>
    </div>
    <div class="craft-header-right">
        <div class="craft-score-display" id="craft-score-display">Score: 0/0</div>
        <div class="craft-actions">
            \${FULLSCREEN ? '<button class="craft-icon-btn" id="craft-fullscreen-btn" title="Fullscreen">&#x26F6;</button>' : ''}
            \${SPEED      ? '<select class="craft-icon-btn" id="craft-speed-select" title="Speed"><option value="0.75">0.75x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option></select>' : ''}
            \${VOLUME     ? '<input type="range" id="craft-volume-slider" min="0" max="1" step="0.05" value="1" title="Volume" style="width:80px;cursor:pointer;">' : ''}
        </div>
    </div>
</div>"""

# Handle case where old header might be the original version
old_header_orig = """<div class="craft-player-header">
    <div class="craft-header-left">
        <div class="craft-logo" id="craft-logo"></div>
        <div class="craft-header-text">
            <div class="craft-course-title" id="craft-course-title">Course</div>
            <div class="craft-scene-counter" id="craft-scene-counter">Scene 1 of 1</div>
        </div>
    </div>
    <div class="craft-score-display" id="craft-score-display">Score: 0</div>
    <div class="craft-actions">
        \${FULLSCREEN ? '<button class="craft-icon-btn" id="craft-fullscreen-btn" title="Fullscreen">&#x26F6;</button>' : ''}
        \${SPEED      ? '<select class="craft-icon-btn" id="craft-speed-select" title="Speed"><option value="0.75">0.75x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option></select>' : ''}
        \${VOLUME     ? '<input type="range" id="craft-volume-slider" min="0" max="1" step="0.05" value="1" title="Volume" style="width:80px;cursor:pointer;">' : ''}
    </div>
</div>"""

new_header = """<div class="craft-player-header">
    <div class="craft-header-left">
        <div class="craft-logo" id="craft-logo"></div>
    </div>
    <div class="craft-header-centre">
        <div class="craft-course-title" id="craft-course-title">Course</div>
    </div>
    <div class="craft-header-right">
        <div class="craft-scene-counter" id="craft-scene-counter">Scene 1 of 1</div>
        <div class="craft-score-display" id="craft-score-display">Score: 0/0</div>
        <div class="craft-actions">
            \${FULLSCREEN ? '<button class="craft-icon-btn" id="craft-fullscreen-btn" title="Fullscreen">&#x26F6;</button>' : ''}
            \${SPEED      ? '<select class="craft-icon-btn" id="craft-speed-select" title="Speed"><option value="0.75">0.75x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option><option value="2">2x</option></select>' : ''}
            \${VOLUME     ? '<input type="range" id="craft-volume-slider" min="0" max="1" step="0.05" value="1" title="Volume" style="width:80px;cursor:pointer;">' : ''}
        </div>
    </div>
</div>"""

if rt.count(old_header) == 1:
    rt = rt.replace(old_header, new_header)
    print('1. Header HTML updated (new version)')
elif rt.count(old_header_orig) == 1:
    rt = rt.replace(old_header_orig, new_header)
    print('1. Header HTML updated (original version)')
else:
    print('ERROR: could not find header anchor')

with open(rt_path, 'w') as f:
    f.write(rt)


# ── 2. Update header CSS in htmlBuilder.js ────────────────────────────────────

hb_path = base + '/src/providers/rendering/html/htmlBuilder.js'

with open(hb_path) as f:
    content = f.read()

start = content.find('.craft-player-header {')
end   = content.find('\n}', start) + 2

new_css = """.craft-player-header {
    display:flex;
    align-items:center;
    justify-content:space-between;
    height:64px;
    padding:0 16px;
    background:#ffffff;
    border-bottom:1px solid #eee;
    gap:12px;
}

.craft-header-left {
    display:flex;
    align-items:center;
    flex-shrink:0;
}

.craft-header-centre {
    flex:1;
    display:flex;
    align-items:center;
    justify-content:center;
    min-width:0;
    overflow:hidden;
    padding:0 12px;
}

.craft-header-right {
    display:flex;
    align-items:center;
    gap:8px;
    flex-shrink:0;
}

.craft-course-title {
    font-size:16px;
    font-weight:700;
    color:#1e3a8a;
    text-align:center;
    overflow:hidden;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    line-height:1.3;
    max-height:42px;
}

.craft-scene-counter {
    font-size:11px;
    color:#777;
    white-space:nowrap;
}"""

content = content[:start] + new_css + content[end:]

with open(hb_path, 'w') as f:
    f.write(content)
print('2. Header CSS updated')

print('\nDone — rebuild and test')
