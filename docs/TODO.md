# CRAFT Course Factory — Progress & TODO

_Last updated: Aug 10, 2026 — end of session_

Update this file as the last step before every commit that changes
functionality — move items between sections, don't just append.

**IMPORTANT FOR THE NEXT SESSION:**
- Current branch: `backup/local-work-aug3`, latest commit: see `git log --oneline -1`
- Pane-1: `npm run dev` (port 3000, compiler/server)
- Pane-2: `npm run dev:client` (port 5174, Vite/React client)
- Always restart Pane-1 after any compiler-side file change before rebuilding
- Test each interaction in isolation before integrating into the full course
- All interactions are separate API renderer files in `src/runtime/renderers/`

---

## Architecture — Interaction API Pattern

Each interaction is a self-contained renderer module:
- `render(component, context)` — static HTML (no-op for dynamic interactions)
- `async bind(slot, component, runtime)` — full interaction flow, audio, completion signal

Engine dispatches to each renderer. Working modules are never touched when building a new one.

Current renderers: imageRenderer, dialogueRenderer, audioRenderer, tabPanelRenderer,
revealPanelRenderer, dragDropRenderer, branchingRenderer, mcqRenderer, hotspotRenderer,
scoreCheckpointRenderer

---

## Done & Verified Working

- [x] Full pipeline: DOCX upload → Compiler → CCIR → PIR → HTML5 output
- [x] Player chrome: header, progress bar, footer with correct gating
- [x] Audio strict matching — exact voiceId match only
- [x] Background image scoping — correct per interaction type
- [x] Stale audio resolver cleared after playDialogueSequence
- [x] Lexer inline tag fix — [TAG attrs]text[/TAG] on one line handled
- [x] Lexer HOTSPOT_ITEM context — text content captured correctly
- [x] Scene — dialogue + VO auto-advance, speaker badge, background image
- [x] TAB — checkbox-gated, all tabs must be read before Next activates
- [x] REVEAL — working
- [x] Drag & Drop — full flow, white centered feedback panel + VO, Next activates
- [x] Branching (instant) — scene image, dialogue, option VOs, unlock, scored, Next activates
- [x] MCQ — 3-step: question image + VO, white options panel, white feedback + VO, Next activates
- [x] Hotspot — 4-step: location image + VO, document grid (all must click), white options, white feedback + VO, Next activates
- [x] Full scoring system: live score, SCORE_CHECKPOINT, SCORE_BRANCH/CASE conditional dialogue
- [x] Feedback screens: white background + centered text for MCQ, Drag & Drop, Hotspot
- [x] window.__craftRuntime debug exposure removed

---

## Next to Build (Priority Order)

### 1. COURSE_ANALYTICS — end-of-course results slide
- Separate renderer API: `courseAnalyticsRenderer.js`
- Design to be confirmed via image from Debraj
- Should show score breakdown per module (MOD1, MOD2 etc.) and overall score
- Triggered by `TYPE=COURSE_ANALYTICS` screen tag

### 2. Reflection
- Separate renderer API: `reflectionRenderer.js`
- One question per screen with a text input area for the learner to write
- Multiple reflection screens in sequence (6-7 scene screens, then 2-3+ reflection questions)
- Tag convention to be designed: likely `[REFLECTION_QUESTION]` with a prompt text
- Details to be discussed when we reach it

---

## Not Yet Built

- [ ] SCORM export — top priority after Analytics and Reflection
- [ ] Sorting — broken plumbing
- [ ] Speaking-character highlight effect

---

## Deferred

- [ ] Automated in-tool script validation (ValidatorProvider exists but checks nothing)

---

## Roadmap

- Vertical/portrait format
- MP4 export
