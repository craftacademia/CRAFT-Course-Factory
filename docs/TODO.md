# CRAFT Course Factory — Progress & TODO

_Last updated: Aug 3, 2026 — after commit `35d3120`_

This file replaces the previous TODO.md, which had drifted out of sync with
the actual codebase (it listed the entire Interaction Engine as unbuilt when
it was, in fact, already implemented). This version reflects only what has
been verified by actually running the code, not assumed from reading it.

Update this file as the last step before every commit that changes
functionality — move items between sections, don't just append.

---

## ✅ Done & Verified Working (tested live, not just read)

- [x] Full pipeline: DOCX upload → Compiler → CCIR → PIR → HTML5 output, working end-to-end through the real UI (not just CLI)
- [x] Real backend (`src/server.js`) properly wired as the `npm run dev` entry point
- [x] Vite dev server (`npm run dev:client`) serving the upload screen at `/upload.html`
- [x] `ScriptUploader.jsx` — fixed syntax error, removed non-existent auth dependency, points to real `/api/build`
- [x] `ScriptWorkspace.jsx` — displays actual API response (buildId, output, status) instead of crashing on non-existent data
- [x] MSQ interactions — fixed import bug (was loading MCQ logic instead of MSQ)
- [x] Build output is servable over HTTP (`/output/:buildId/html5/index.html`) with a working preview link in the UI
- [x] Voice-over audio — confirmed plays correctly, one dialogue line after another, in sequence
- [x] Dead code removed: 7 orphaned route files, abandoned "Engine" runtime architecture (interactionEngine.js, assessmentEngine.js, eventBus.js, runtimeOrchestrator.js, duplicate browserRuntime.js), disconnected `server/` subproject, old stub `server.js`, ~4,100 lines total
- [x] `/uploads/` added to `.gitignore` (was at risk of committing real client scripts to a public repo)
- [x] Local uncommitted work backed up to GitHub (`backup/local-work-aug3` branch)

## 🔧 In Progress / Next Up

- [ ] **Dialogue box overlap** — root cause identified: `RuntimePlayer.play()` ignores the timeline/scheduler and renders all of a scene's dialogue at once instead of one at a time. Needs real sequencing logic added to `browserRuntime.js` / `runtimePlayer.js`. This is a feature gap, not a one-line bug.

## ❌ Confirmed Not Working / Not Built (verified by checking, not assumed)

- [ ] **Auto-running scene pacing** — does not exist. Same root cause as the dialogue bug (scheduler/timeline is built but not respected).
- [ ] **End-of-course analytics/results slide** — does not exist. `resultsTemplate.html` sits in the codebase but is not referenced by any live code — it's dead, disconnected scaffolding, same pattern as the files we already removed.
- [ ] **SCORM export is not usable yet, for four separate reasons:**
  - [ ] The SCORM zip your build actually generates is computed then discarded — never saved or exposed
  - [ ] The working export endpoint (`/api/scorm/export`) exists but has no button/link anywhere in the UI
  - [ ] It packages the wrong build (grabs whichever `output/build_*` folder sorts last, not the specific one you just built) and from the wrong subfolder (`preview/` instead of the tested-working `html5/`)
  - [ ] The `imsmanifest.xml` it generates is a bare-bones stub, likely non-compliant with real SCORM 2004 validation, and the runtime never calls the SCORM JS API (`Initialize`/`SetValue`/`Terminate`) — so even a working zip wouldn't report completion/score to an LMS

## ⚠️ Verified Present But Not Yet Tested Live

- [ ] Interactions (MCQ, hotspot, drag-drop, branching, reflection, click-to-reveal, case-study, dialogue-choice, sorting) — all registered and reachable in code, not orphaned, but we have not yet clicked through one to confirm it correctly evaluates and advances

## 📝 Known, Deliberately Deferred

- Full multi-user login/auth system (the old `main` branch had a JWT-based prototype for this — a separate, bigger feature to design properly later, not needed to get the core product working)
- Cleanup of duplicate project folders on Debraj's local machine outside git (`/Users/debraj/debraj/projects/...`) — untracked, not urgent, but a source of confusion risk

