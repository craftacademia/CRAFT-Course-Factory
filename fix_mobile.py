base = '/Users/debraj/projects/craft-course-factory 2.0 copy'

# ── 1. Add mobile CSS to htmlBuilder.js ──────────────────────────────────────

hb_path = base + '/src/providers/rendering/html/htmlBuilder.js'

with open(hb_path) as f:
    content = f.read()

mobile_css = """

/* ── Mobile Adaptive ─────────────────────────────────────────────────────── */

@media (max-width: 768px) {

    #craft-app {
        max-width: 100vw;
        max-height: 100vh;
    }

    .craft-player-header {
        height: auto;
        min-height: 44px;
        padding: 6px 10px;
        flex-wrap: wrap;
        gap: 4px;
    }

    .craft-course-title {
        font-size: 13px;
    }

    .craft-scene-counter {
        font-size: 10px;
    }

    .craft-score-display {
        font-size: 12px;
    }

    .craft-icon-btn {
        font-size: 12px;
        padding: 4px 8px;
    }

    .craft-player-footer {
        height: auto;
        min-height: 44px;
        padding: 6px 10px;
    }

    .craft-nav-btn {
        font-size: 12px;
        padding: 8px 14px;
        border-radius: 6px;
    }

    .speech-bubble {
        width: 70%;
        padding: 16px 20px;
        min-height: 60px;
        border-radius: 40%;
    }

    .speech-bubble-text {
        font-size: 13px;
        line-height: 1.4;
    }

    .branch-options {
        left: 2%;
        right: 2%;
        bottom: 15%;
    }

    .branch-option {
        font-size: 14px;
        padding: 10px 14px;
    }

    .mcq-submit-btn {
        font-size: 14px;
        padding: 10px 24px;
    }

}

/* ── Tilt overlay ────────────────────────────────────────────────────────── */

#craft-tilt-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: #1e3a8a;
    z-index: 9999;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    text-align: center;
    padding: 40px;
}

#craft-tilt-overlay.visible {
    display: flex;
}

.craft-tilt-icon {
    font-size: 64px;
    margin-bottom: 20px;
    animation: tiltRotate 2s ease-in-out infinite;
}

.craft-tilt-text {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.5;
}

@keyframes tiltRotate {
    0%, 100% { transform: rotate(0deg); }
    50%       { transform: rotate(90deg); }
}

"""

# Insert before the closing </style> tag area
if 'Mobile Adaptive' not in content:
    # Find the last CSS block closing and insert before it
    old = '</style>'
    new = mobile_css + '\n</style>'
    # Only replace first occurrence (the CSS style tag)
    content = content.replace(old, new, 1)
    with open(hb_path, 'w') as f:
        f.write(content)
    print('1. Mobile CSS and tilt overlay added to htmlBuilder.js')
else:
    print('1. Mobile CSS already present — skipping')


# ── 2. Add tilt overlay HTML and detection script to runtime.js ───────────────

rt_path = base + '/src/runtime/runtime.js'

with open(rt_path) as f:
    rt = f.read()

if 'craft-tilt-overlay' in rt:
    print('2. Tilt detection already in runtime.js — skipping')
else:
    # Add tilt overlay div after app.innerHTML assignment
    old = "    const stage   = document.getElementById(\"craft-stage\");"
    new = """    // Tilt overlay for portrait phones
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

    const stage   = document.getElementById("craft-stage");"""

    assert rt.count(old) == 1, f'stage anchor: {rt.count(old)}'
    rt = rt.replace(old, new)

    with open(rt_path, 'w') as f:
        f.write(rt)
    print('2. Tilt detection added to runtime.js')


print('\nDone — rebuild and test on mobile/tablet')
