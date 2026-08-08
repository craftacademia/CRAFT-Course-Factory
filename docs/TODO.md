# CRAFT Course Factory — Progress & TODO

_Last updated: Aug 8, 2026 — end of session, handoff to fresh chat_

Update this file as the last step before every commit that changes
functionality — move items between sections, don't just append.

**IMPORTANT FOR THE NEXT SESSION:**
- Current branch: `backup/local-work-aug3`, latest commit: `1858b7d`
- Pane-1: `npm run dev` (port 3000, compiler/server)
- Pane-2: `npm run dev:client` (port 5174, Vite/React client)
- Always restart Pane-1 after any compiler-side file change before rebuilding
- Always confirm with `git log --oneline -1` and `git branch` before touching anything

---

## 🏗️ Architecture Decision — Agreed Aug 8

The course player must follow a clean interaction API architecture:

- **Engine** — reads compiled PIR, manages navigation, chrome, score,
  gating. Never handles interaction logic directly.
- **Interaction APIs** — one self-contained module per interaction type.
  Each module handles its own render, audio sequencing, user input,
  and signals completion back to the engine via `onStateChange`.
- **Rule:** A working interaction module is NEVER touched when building
  a new one. Each module is isolated.

Interactions needed: Scene, Branching, MCQ, TAB, REVEAL, Drag & Drop, Hotspot.

---

## ✅ Done & Verified Working (as of Aug 8, commit 1858b7d)

- [x] Full pipeline: DOCX upload → Compiler → CCIR → PIR → HTML5 output
- [x] Player chrome: header (logo, title, scene counter, score), progress
  bar, footer (Back, Pause, Next) with correct disabled states
- [x] Back/Next gated until current screen's dialogue/VO finishes
- [x] Audio strict matching — compiler now matches each dialogue line's
  audio file by exact voiceId only (loose scene-wide fallback removed
  from `presentationProvider.js`)
- [x] Background image scoping — MCQ and Hotspot screens suppress BG
  image (standalone decision screens); instant-style Branching keeps
  its scene image (`pageBuilder.js`)
- [x] Stale audio resolver cleared after `playDialogueSequence` so late
  pause events don't fire into the next interaction's audio loop
- [x] Scene (dialogue + VO auto-advance) — fully working
- [x] TYPE=TAB — fully working, checkbox-gated, Next activates after all
  tabs read
- [x] TYPE=REVEAL — fully working
- [x] TYPE=DRAG_DROP — fully working: Pointer Events (touch/mouse/pen),
  drag, drop, submit, correct/incorrect feedback VO, Next activates.
  RESULT=CORRECT / RESULT=INCORRECT tags required in script for
  feedback lines to be correctly nested (not loose dialogue).
- [x] Full scoring system: live header score display, SCORE_CHECKPOINT,
  SCORE_BRANCH/SCORE_CASE conditional dialogue
- [x] Conversion prompt and verification prompt both working

---

## 🚨 Broken — Must Be Built From Scratch Next Session

### Branching (instant + hotspot styles)
- Was working before Aug 8 session
- Broken by today's patches to `browserRuntime.js`
- Both files (`browserRuntime.js`, `registerDefaultRenderers.js`) have
  been reverted to `a1e6fc7` — Branching is now back to its pre-Aug-8
  state in the repo but the interaction is still not functioning correctly
- **Next session:** build as a clean standalone API module following the
  architecture decision above. Do not patch `browserRuntime.js` directly.
- Scoring: each option carries a SCORE value, recorded on selection
- Background: instant-style keeps scene image; hotspot suppresses it
- Options lock until all option VOs finish playing

### MCQ
- Never fully working — always had issues
- All previous MCQ patches reverted
- **Next session:** build as a clean standalone API module
- 3-step flow:
  1. Question screen: scene image (ASSET_REF) shown, question VO plays,
     auto-advances when VO ends
  2. Options screen: white background, question text at top (no VO),
     option A and B VOs play automatically in sequence, options unlock
     after both VOs finish, learner picks one and clicks Submit
  3. Feedback screen: white background, correct or incorrect feedback
     text shown with its VO playing, Next activates when VO ends
- Scoring: correct option = highest SCORE value
- RESULT=CORRECT / RESULT=INCORRECT tags on feedback lines

---

## ❌ Not Yet Built

- [ ] Hotspot — needs verification after Branching is rebuilt
- [ ] `COURSE_ANALYTICS` — end-of-course results slide
- [ ] Reflection — no tag convention designed yet
- [ ] Sorting — broken plumbing, not yet fixed
- [ ] **SCORM export** — top real priority once Branching and MCQ are stable
- [ ] Speaking-character highlight / pan-in effect — not yet scoped
- [ ] Remove `window.__craftRuntime` debug exposure from `browserRuntime.js`
  (added Aug 8 for debugging, must be removed before production)

---

## 📝 Deferred, Sequenced After SCORM Export Works

- [ ] Automated in-tool script validation — `ValidatorProvider` exists
  in pipeline, wired in, but checks almost nothing and result is
  discarded by `compiler.js`. Translate manual verification checks into
  real JS running on every build.

---

## 📝 Roadmap, Not Yet Scoped

- Vertical/portrait format
- MP4 export (one specific path through each branch only)
