# CRAFT Course Factory — Progress & TODO

_Last updated: Aug 6, 2026 — after conditional feedback, MCQ polish, verification tooling_

Update this file as the last step before every commit that changes
functionality — move items between sections, don't just append.

---

## ✅ Done & Verified Working (tested live against the full AHFC script)

- [x] Full pipeline: DOCX upload → Compiler → CCIR → PIR → HTML5 output
- [x] Scene images, speaker badges, dialogue pacing, VO sync
- [x] Player chrome: header, progress bar, footer nav
- [x] Dialogue box resized/repositioned per feedback
- [x] **Stage 5** — Back/Next gated until current screen's dialogue/VO finishes
- [x] **Branching — fully working, hardened through multiple real-world test rounds:**
  - [x] Audio-pause-hang fix, NEXT_SCREEN keyword, option VOs
  - [x] White background, "Option 1"/"Option 2" labels
  - [x] Mid-VO interrupt race condition fixed via design simplification (options locked until VOs finish)
- [x] **TYPE=TAB**, **TYPE=REVEAL** — both fully working, checkbox-gated
- [x] **TYPE=DRAG_DROP** — Pointer Events (touch/mouse/pen), white background
- [x] **Major parser bug fixed:** self-closing tags (`CARD`/`ZONE`) were corrupting and truncating the course after the first `DRAG_DROP` screen
- [x] **Full scoring system:** live header score, `SCORE_CHECKPOINT`, `SCORE_BRANCH`/`SCORE_CASE` conditional closing dialogue — all verified end-to-end
- [x] **MCQ visual polish** — no background image (clean white panel, larger), "Option 1"/"Option 2" labels, same lock-until-VO-finishes treatment as branching
- [x] Human ↔ machine script conversion process fully established: written conversion prompt (now includes explicit `RESULT=CORRECT/INCORRECT` guidance for conditional feedback), a separate standalone verification prompt for a dedicated checking chat, both catching real bugs before reaching the tool

## 🔧 In Progress — Built, Awaiting Script Update + Test

- [ ] **Conditional correct/incorrect feedback** — code is built (generalized `collectConditionalFeedback` for both `DRAG_DROP` and `BRANCH_POINT`-based screens, using new `RESULT=` attribute), but not yet testable: requires the human script to be regenerated with the updated conversion prompt (adds `RESULT=CORRECT`/`RESULT=INCORRECT` to `S09`, `S10`, `S15`, `S20`'s feedback lines with non-colliding VO_IDs). Needs full re-verification once the new script is back (structural checks + diff against previous version, given regeneration has silently altered unrelated screens before).
- [ ] **Re-verify Hotspot** specifically — MCQ re-verified/polished tonight, Hotspot (S15/S20) not yet re-tested since the parser fix and several rounds of surrounding changes

## ❌ Not Yet Built

- [ ] **`COURSE_ANALYTICS`** — end-of-course results slide. Scoring infrastructure (rolling baseline, module scores) already exists and should make this straightforward.
- [ ] Reflection — no tag convention designed yet (real future need, raised from human script)
- [ ] Sorting — broken plumbing, not yet fixed
- [ ] **SCORM export** — 4 separate known issues (zip computed but discarded, no UI button, wrong build packaged, non-compliant manifest with no real SCORM API calls). **This is the next real priority** — needed before courses can actually be delivered to a real LMS.
- [ ] **Speaking-character highlight / pan-in effect** on scenes and branching screens — raised, not yet scoped

## 📝 Deferred, Sequenced After SCORM Export Works

- [ ] **Automated in-tool script validation (no AI, plain deterministic code)** — a `ValidatorProvider` already exists in the compiler pipeline, already wired in, but currently only checks one trivial thing and its result is discarded entirely (`compiler.js` never checks whether validation passed). Real opportunity: translate the same checks already used in the manual verification prompt (tag balance, duplicate attributes, reference integrity, VO_ID collisions, screen-type completeness, score range sanity) into real JavaScript running automatically on every build — catching broken scripts immediately, without any separate manual step. Deliberately sequenced after SCORM export is fully working and LMS-compatible, since that's the higher-priority deliverable.

## 📝 Roadmap, Not Yet Scoped

- Vertical/portrait format
- MP4 export (discussed — not simply a video of "all 41 screens," since branching means only one path can be exported at a time; would need PowerPoint-with-narration as the more realistic near-term version of this)

