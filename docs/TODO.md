# CRAFT Course Factory — Progress & TODO

_Last updated: Aug 6, 2026 — after scoring system, checkpoint fix, parser bug fix_

Update this file as the last step before every commit that changes
functionality — move items between sections, don't just append.

---

## ✅ Done & Verified Working (tested live against the full AHFC script)

- [x] Full pipeline: DOCX upload → Compiler → CCIR → PIR → HTML5 output
- [x] Scene images, speaker badges, dialogue pacing, VO sync
- [x] Player chrome: header, progress bar, footer nav
- [x] **Stage 5 — Back/Next now correctly gated until the current screen's dialogue/VO finishes playing**, in addition to interaction-specific gating
- [x] Dialogue box resized and repositioned per feedback (smaller, bottom-anchored)
- [x] **Branching — fully working**, including audio-pause-hang fix, NEXT_SCREEN keyword, option VOs
- [x] **TYPE=TAB** — single compulsory click-to-reveal panel, checkbox gates Next
- [x] **TYPE=REVEAL** — multi-tab click-to-reveal, sequential unlock, checkbox gates Next
- [x] **TYPE=DRAG_DROP** — built with Pointer Events (touch/mouse/pen unified, works on tablets/phones — NOT native HTML5 drag-and-drop, which doesn't work on touch devices). White background. Post-submission feedback lines correctly deferred until after Submit (both lines always play, not conditionally).
- [x] **MCQ style (radio+submit)** and **Hotspot style (clickable document markers)** — built, not yet re-verified since the parser fix (next session's first task)
- [x] **Major parser bug fixed:** `CARD`/`ZONE` tags are self-closing (no matching close tag) but the parser had no concept of self-closing tags — it kept them open on the stack forever, silently nesting every subsequent tag inside them and truncating the ENTIRE course after the first `DRAG_DROP` screen. This was likely the root cause of several other confusing symptoms reported earlier in the session.
- [x] **Scoring system — fully working:**
  - [x] Live running score in the header ("Score: X/Y"), aggregating every resolved branching/MCQ choice and drag-drop submission
  - [x] `SCORE_CHECKPOINT` screens show their own module name and score/max, computed via a rolling baseline (no per-checkpoint bookkeeping needed)
  - [x] Overall course max computed by scanning all checkpoints
  - [x] Fixed a real script bug (not a compiler bug): duplicate `ID=` attribute on `SCORE_CHECKPOINT` screens was silently overwriting the real screen ID — renamed to `CHECKPOINT_ID=`, confirmed zero other instances of this bug pattern anywhere in the 280-tag script
- [x] Human ↔ machine script conversion process established, with a full written conversion prompt, and a repeatable verification method (structural + reference integrity checks) that's caught real bugs before they reached the tool multiple times

## 🔧 Immediate Next Steps

- [ ] **Branching sequencing bug** — reported, not yet diagnosed. Needs a concrete repro from the user (which screen, expected vs. actual) before any fix is attempted. May turn out to be fully explained by the missing `SCORE_BRANCH`/`SCORE_CASE` support below, or may be separate — can't tell without evidence.
- [ ] **Re-verify MCQ and Hotspot** against the current (parser-fixed) build — was interrupted by the scoring system work, which turned out to be a prerequisite for testing branching/scoring together properly anyway

## ❌ Not Yet Built

- [ ] **`SCORE_BRANCH`/`SCORE_CASE`** — score-dependent closing dialogue after a branch sequence converges. Currently, all `SCORE_CASE` blocks' dialogue plays back-to-back instead of just the one matching the learner's actual score. This is very likely the cause of the branching sequencing complaint above.
- [ ] **`COURSE_ANALYTICS`** final results screen — not built yet, though `SCORE_CHECKPOINT`'s infrastructure (rolling baseline, module scores) should make this straightforward
- [ ] Reflection, Case Study — no tag convention designed yet
- [ ] Sorting, Click-to-Reveal (as a distinct interaction from `REVEAL`), Dialogue-Choice — broken plumbing, not yet fixed
- [ ] End-of-course analytics slide (separate from `COURSE_ANALYTICS` tag — may be the same thing, needs clarifying)
- [ ] Character close-up/motion on speaking lines
- [ ] SCORM export (4 separate issues)

## 📝 Roadmap, Not Yet Scoped

- Vertical/portrait format
- MP4 export

