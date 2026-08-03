# CRAFT Course Factory — Progress & TODO

_Last updated: Aug 4, 2026 — after scene image + speaker badge fixes_

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
- [x] Upload screen accepts images, narration, dialogue audio, background music, logo — all reach the server correctly
- [x] Dialogue box overlap — fixed, lines reveal one at a time
- [x] Autoplay blocking — fixed with a one-time "Click to Begin Course" gate; voice-over now plays automatically for the whole session after that single click
- [x] Voice-over audio — plays correctly, one line at a time, in sync with the visible dialogue text
- [x] **Scene background image — fixed at the true root cause.** The actual screen-building logic (inside `ccirProvider.js`, not the dead `screenBuilder.js` file) was never reading the script's `SCENE=`/`LOCATION=`/`CHARACTER=` tags at all — it hardcoded every screen to the first uploaded image. Now correctly reads and matches these tags, with `SCENE=` taking priority. Confirmed live: each scene now shows its correct, distinct background image.
- [x] **Speaker avatar badge — built and confirmed live.** Small circular photo + speaker name, fixed top-left, updates per dialogue line to match the active speaker's `EXPRESSION=` tag; shows a microphone icon for narrator lines. Sized to spec (88px).
- [x] Fixed a real CSS class-name mismatch (`image-component` vs `slide-template-image`) that had been leaving the main scene image completely unstyled/unconstrained this whole time
- [x] Dead code removed: ~4,100 lines (orphaned routes, abandoned runtime architecture, disconnected sub-server, old stub server, debug clutter)
- [x] `/uploads/` and `ast-debug.json` added to `.gitignore`
- [x] Local uncommitted work backed up to GitHub

## 🔧 In Progress / Next Up

- [ ] **Stage 2 of the player redesign** — header (logo, course title, scene counter, progress bar), top-right icons (menu/help/exit), bottom controls (back/pause/next). Not started. A working, unused CSS file (`src/providers/rendering/css/cssBuilder.js`, part of a different packaging path) already defines most of this chrome — worth reusing rather than building from scratch.
- [ ] **Stage 3 — progress bar wired to real % completion**
- [ ] **Stage 4 — pause button** (stop audio + freeze auto-advance until resumed)
- [ ] **Stage 5 — back/next gating + lock/unlock authoring option** — deliberately deferred; this is a new authoring feature (a new script tag), not a bug fix. Needs its own design pass later.

## ❌ Confirmed Not Working / Not Built

- [ ] **Auto-running scene pacing beyond dialogue** — dialogue lines auto-advance via VO timing now, but non-dialogue elements still render all at once with no timing.
- [ ] **End-of-course analytics/results slide** — does not exist; `resultsTemplate.html` is dead, disconnected scaffolding.
- [ ] **SCORM export — four separate issues, none fixed yet:**
  - [ ] Generated SCORM zip is computed then discarded, never saved or exposed
  - [ ] Working export endpoint (`/api/scorm/export`) has no UI button
  - [ ] Packages the wrong build/wrong subfolder (`preview/` instead of the tested `html5/`)
  - [ ] `imsmanifest.xml` is a non-compliant stub; no SCORM API calls anywhere in the runtime, so completion/score would never report to a real LMS

## ⚠️ Verified Present But Not Yet Tested Live

- [ ] Interactions (MCQ, hotspot, drag-drop, branching, reflection, click-to-reveal, case-study, dialogue-choice, sorting) — registered and reachable, not yet click-tested

## 📝 Known, Deliberately Deferred

- Full multi-user login/auth system
- Cleanup of duplicate project folders on Debraj's local machine outside git (`/Users/debraj/debraj/projects/...`)

