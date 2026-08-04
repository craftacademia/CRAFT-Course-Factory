# CRAFT Course Factory — Progress & TODO

_Last updated: Aug 4, 2026 — after Stage 2 player chrome_

This file replaces the previous TODO.md, which had drifted out of sync with
the actual codebase. This version reflects only what has been verified by
actually running the code, not assumed from reading it.

Update this file as the last step before every commit that changes
functionality — move items between sections, don't just append.

---

## ✅ Done & Verified Working (tested live, not just read)

- [x] Full pipeline: DOCX upload → Compiler → CCIR → PIR → HTML5 output, working end-to-end through the real UI
- [x] Real backend (`src/server.js`) properly wired as the `npm run dev` entry point
- [x] Vite dev server serving the upload screen at `/upload.html`
- [x] Upload screen accepts images, narration, dialogue audio, background music, logo
- [x] Dialogue box overlap — fixed, lines reveal one at a time
- [x] Autoplay blocking — fixed with a one-time "Click to Begin Course" gate
- [x] Voice-over audio — plays correctly, one line at a time, in sync with visible dialogue text
- [x] Scene background image — fixed at the true root cause (`ccirProvider.js` was hardcoding the first uploaded image for every screen, never reading `SCENE=`/`LOCATION=`/`CHARACTER=` tags at all). `SCENE=` now takes priority and correctly resolves per screen.
- [x] Speaker avatar badge — small circular photo + name, top-left, updates per dialogue line to match `EXPRESSION=`; microphone icon for narrator lines
- [x] Fixed a CSS class-name mismatch (`image-component` vs `slide-template-image`) that had left the main scene image completely unstyled/unconstrained
- [x] **Stage 2 — player chrome, built and confirmed live:**
  - [x] Header: logo, course title, scene counter ("Scene X of Y"), progress bar — all wired to real navigation data, not placeholders
  - [x] Top-right menu/help/exit icons — present, visually complete (not yet functional — no spec given for their behavior)
  - [x] Footer: Back / Pause / Next buttons — Back and Next confirmed working, correctly navigate between scenes
  - [x] Fixed a real bug where the header only started updating after the *entire* first scene's dialogue+audio finished playing, because the update listener was registered too late — now registered immediately on mount
  - [x] Added a guard against overlapping page transitions (clicking Next twice in a row rapidly)
- [x] Dead code removed: ~4,100 lines
- [x] `/uploads/` and `ast-debug.json` added to `.gitignore`
- [x] Local uncommitted work backed up to GitHub

## 🔧 In Progress / Next Up

- [ ] **Compiler gap — branching/interaction tags are silently dropped.** Confirmed real, significant gap: `TYPE=`, `ASSET_REF=`, `BRANCH_POINT`, `OPTION`, and `PATH` tags in the script are entirely ignored during compilation. This means all branching/interaction content authored in the script never reaches the runtime at all, even though the runtime has working handlers registered for MCQ, branching, etc. This is real, scoped work for its own session — not a quick fix.

## ❌ Confirmed Not Working / Not Built

- [ ] **Stage 3 — Pause button** (visually present, not yet functional: should stop audio + freeze auto-advance until resumed)
- [ ] **Stage 5 — lock/unlock navigation gating** (deliberately deferred, by design). Currently, clicking Next immediately cuts off the current scene's audio and advances — this is expected/known behavior, not a bug, until Stage 5 (a course-author-configurable toggle) is built.
- [ ] **Auto-running scene pacing beyond dialogue** — dialogue lines auto-advance via VO timing, but non-dialogue elements still render all at once with no timing
- [ ] **End-of-course analytics/results slide** — does not exist; `resultsTemplate.html` is dead, disconnected scaffolding
- [ ] **SCORM export — four separate issues, none fixed yet:**
  - [ ] Generated SCORM zip is computed then discarded, never saved or exposed
  - [ ] Working export endpoint (`/api/scorm/export`) has no UI button
  - [ ] Packages the wrong build/wrong subfolder (`preview/` instead of the tested `html5/`)
  - [ ] `imsmanifest.xml` is a non-compliant stub; no SCORM API calls anywhere in the runtime

## ⚠️ Verified Present But Not Yet Tested Live

- [ ] Interactions (MCQ, hotspot, drag-drop, branching, reflection, click-to-reveal, case-study, dialogue-choice, sorting) — registered and reachable in runtime code, but cannot be meaningfully tested until the compiler gap above is fixed (no real interaction data ever reaches them right now)

## 📝 Roadmap Items Raised, Not Yet Scoped

- **Vertical/portrait course format** — technically simple for layout, but real backgrounds are landscape photos; needs a decision on crop-and-fill vs. new/reprocessed vertical assets before it's buildable
- **MP4 export of auto-running scenes with VO** — a genuinely large, separate feature (would need a rendering/capture pipeline, e.g. headless browser + ffmpeg); also doesn't cleanly support branching content, which is inherently non-linear

## 📝 Known, Deliberately Deferred

- Full multi-user login/auth system
- Cleanup of duplicate project folders on Debraj's local machine outside git (`/Users/debraj/debraj/projects/...`)

