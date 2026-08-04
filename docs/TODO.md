# CRAFT Course Factory — Progress & TODO

_Last updated: Aug 4, 2026 — end of day, after branching correctness fixes_

Update this file as the last step before every commit that changes
functionality — move items between sections, don't just append.

---

## ✅ Done & Verified Working (tested live)

- [x] Full pipeline: DOCX upload → Compiler → CCIR → PIR → HTML5 output
- [x] Scene images, speaker badges, dialogue sequencing, VO sync
- [x] Player chrome: header, progress bar, footer nav — Back/Next fully working
- [x] **Branching — fully working and hardened:**
  - [x] Real compiler support for `[BRANCH_POINT]`/`[OPTION]`/`[PATH]`
  - [x] PATH pages correctly rejoin the main sequence afterward
  - [x] Options appear only after setup dialogue finishes
  - [x] Next button disabled until a choice is made — no more silent skipping into the wrong path
  - [x] Each option's own voice-over plays, stops immediately on click
  - [x] `TYPE=TAB` screens with `ASSET_REF=` now show the correct prop image as a background fallback
  - [x] Audio lookup now searches both the `dialogue` and `narration` upload buckets — was silently missing correctly-uploaded narrator audio

## 🔧 Confirmed Working, Reusing Branching (no dedicated UI yet)

- [ ] MCQ, Hotspot — currently render as generic branching buttons, not their own distinct radio-select / clickable-image-region UI. Functional, not visually distinctive.

## ❌ Needs Real Work — Broken Plumbing (renderer missing/wrong, but real script tags exist)

- [ ] Sorting — has real drag logic written, never wired into the render/registry system
- [ ] Click-to-Reveal — renderer returns data instead of HTML, same bug pattern Reflection had
- [ ] Dialogue-Choice — not yet checked in detail

## 📝 Needs New Design — No Tag Convention Exists Yet

- [ ] Reflection (open-text response box, with VO on the question)
- [ ] Case Study
- [ ] Drag & Drop (script only has a narration line — no tags for actual draggable items/zones)
- [ ] Scene 2's "6 checkpoints" — same underlying gap as Drag & Drop/TAB screens: no list-item tag convention exists

## ❌ Deliberately Deferred

- [ ] Stage 5 — lock/unlock navigation (blocking Next during active playback) — explicitly kept deferred today despite coming up in testing
- [ ] Stage 3 — Pause button (visual only)
- [ ] Character close-up/motion on speaking lines
- [ ] SCORM export (4 separate issues)
- [ ] End-of-course analytics slide

## 📝 Roadmap, Not Yet Scoped

- Vertical/portrait format
- MP4 export

