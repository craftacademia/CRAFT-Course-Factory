# CRAFT Course Factory — Progress & TODO

_Last updated: Aug 6, 2026, late — handoff to fresh chat after long session_

Update this file as the last step before every commit that changes
functionality — move items between sections, don't just append.

**IMPORTANT FOR THE NEXT SESSION:** a batch of serious regressions was
just reported and is UNVERIFIED — no evidence-based diagnosis has been
done yet. Do not assume any of these are real/understood until traced
with actual console/data evidence, same discipline as everything else in
this file. Also: **before testing anything, always confirm Pane-1 was
restarted after the latest code changes** — this exact class of
"stale server" confusion has caused false bug reports multiple times
today.

---

## 🚨 Reported Tonight, UNVERIFIED — Investigate First With Evidence

- [ ] Scenes 3 & 4 — VOs reported "jumbled up," dialogue box text
  mismatched with the audio playing
- [ ] Scene 5 — Next button reportedly becomes active before VO finishes
  (this contradicts Stage 5's gating, which was confirmed working
  earlier — needs to be re-confirmed as a real regression, not a stale
  build, before assuming Stage 5 broke)
- [ ] Scene 15 (Drag & Drop) — after Submit, explanation VO reportedly
  doesn't play; Next button appears anyway
- [ ] **"Scene 16, MCQ completely broken"** — course reportedly gets
  stuck, Next never activates, cannot proceed. **Important scene/screen
  numbering caveat**: "Scene 16" is a *position* in the compiled sequence
  (which includes extra PATH-derived pages), not necessarily the screen
  with ID `S16` — `S16` in the actual script is `TYPE=DRAG_DROP`, not
  MCQ. The real MCQ screen is `S10`. First step: identify with certainty
  which actual screen ID is showing when this happens (check the browser
  console / course.json), since this mismatch has caused confusion
  before.
- [ ] User's own words: "We have to completely re-work on MCQ from
  scratch" — strong signal, but still needs a real diagnosis of what's
  actually happening before deciding whether it's a rebuild or a fix.

## 📝 New Design Rule, Confirmed Tonight

- [ ] **No background image on ANY interaction's options-selection
  screen** — this was built for MCQ specifically (clean white panel,
  no image, even if `ASSET_REF=`/`SCENE=`/`LOCATION=` is set on the
  screen). User has now confirmed this should be a **universal rule**
  applying to Branching and Hotspot too, not just MCQ — even if the
  script provides a background reference, it should be ignored for
  these interaction types. **Not yet implemented for Branching/Hotspot.**

## ✅ Done & Verified Working (as of before tonight's regression reports — needs re-confirmation)

- [x] Full pipeline: DOCX upload → Compiler → CCIR → PIR → HTML5 output
- [x] Scene images, speaker badges, dialogue pacing, VO sync
- [x] Player chrome: header, progress bar, footer nav
- [x] Dialogue box resized/repositioned per feedback
- [x] Stage 5 — Back/Next gated until current screen's dialogue/VO finishes
- [x] Branching — audio-pause-hang fix, NEXT_SCREEN keyword, option VOs,
  white background, Option 1/2 labels, mid-VO lock-until-finished
- [x] TYPE=TAB, TYPE=REVEAL — fully working, checkbox-gated
- [x] TYPE=DRAG_DROP — Pointer Events (touch/mouse/pen), white background
- [x] Major parser bug fixed (self-closing CARD/ZONE tags)
- [x] Full scoring system: live header score, SCORE_CHECKPOINT,
  SCORE_BRANCH/SCORE_CASE conditional dialogue
- [x] MCQ visual polish: no background, larger white panel, Option labels
- [x] Conditional correct/incorrect feedback (RESULT=CORRECT/INCORRECT)
  built for both DRAG_DROP and BRANCH_POINT-based screens — code is in,
  but **the last live re-test of this specific area is exactly where
  tonight's regressions were reported**, so treat this code as suspect
  until re-verified with fresh evidence
- [x] Conversion prompt and standalone verification prompt both fixed
  and working — caught the SCORE_CHECKPOINT duplicate-ID bug reliably
  across multiple regeneration attempts

## ❌ Not Yet Built

- [ ] `COURSE_ANALYTICS` — end-of-course results slide
- [ ] Reflection — no tag convention designed yet
- [ ] Sorting — broken plumbing, not yet fixed
- [ ] **SCORM export** — 4 known issues, still the top real priority once
  current regressions are resolved
- [ ] Speaking-character highlight / pan-in effect — not yet scoped
- [ ] Re-verify Hotspot specifically — not re-tested since the parser fix

## 📝 Deferred, Sequenced After SCORM Export Works

- [ ] Automated in-tool script validation (no AI, plain deterministic
  code) — `ValidatorProvider` already exists in the pipeline, already
  wired in, but currently checks almost nothing and its result is
  discarded by `compiler.js`. Real opportunity to translate the manual
  verification checks into real JS running on every build.

## 📝 Roadmap, Not Yet Scoped

- Vertical/portrait format
- MP4 export (would need to pick one specific path through each branch —
  can't literally include every alternate path in one linear export)

