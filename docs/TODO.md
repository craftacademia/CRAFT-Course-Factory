# CRAFT Course Factory — Progress & TODO

_Last updated: Aug 4, 2026 — after branching/interaction compiler fix_

This file replaces the previous TODO.md, which had drifted out of sync with
the actual codebase. This version reflects only what has been verified by
actually running the code, not assumed from reading it.

Update this file as the last step before every commit that changes
functionality — move items between sections, don't just append.

---

## ✅ Done & Verified Working (tested live, not just read)

- [x] Full pipeline: DOCX upload → Compiler → CCIR → PIR → HTML5 output, working end-to-end through the real UI
- [x] Upload screen accepts images, narration, dialogue audio, background music, logo
- [x] Dialogue box overlap — fixed, lines reveal one at a time
- [x] Autoplay blocking — fixed with a one-time "Click to Begin Course" gate
- [x] Voice-over audio — plays correctly, in sync with visible dialogue text
- [x] Scene background image — resolves correctly per screen via `SCENE=`/`LOCATION=`/`CHARACTER=` tags
- [x] Speaker avatar badge — small circular photo + name, top-left, updates per line
- [x] Stage 2 player chrome — header (logo, title, scene counter, progress bar), footer (Back/Pause/Next), all wired to real navigation data
- [x] **Branching/interaction compiler gap — fully closed, confirmed live end-to-end:**
  - [x] `TYPE=` and `ASSET_REF=` attributes now captured from `[SCREEN]` tags (as `propRef`, to avoid a naming collision with pre-existing, differently-shaped code in `presentationProvider.js`)
  - [x] `[BRANCH_POINT]`/`[OPTION]` structures now parsed into real `BRANCHING` components with `options: [{text, next, letter, score, voiceId}]`
  - [x] Each `[PATH]` block now becomes its own compiled page, with dialogue lines correctly routed to it (not merged into the parent branching screen)
  - [x] Fixed `dialogueBuilder.js` incorrectly scooping up `OPTION` button text as a spurious dialogue line
  - [x] Fixed `ccirProvider.js`'s screen-finder only searching one level deep, breaking when scripts wrap `[SCREEN]` tags in a `[SCREENS]` container
  - [x] Fixed a pre-existing bug in `branchingRenderer.js`: its `render()` method returned HTML instead of appending it to the shared render context, so branching buttons were silently discarded before this fix, regardless of correct compiler data
  - [x] Added the missing `BrowserRuntime.navigate(pageId)` method — `branchingRenderer.js` called this already, but it never existed, so clicking an option could never actually navigate anywhere
  - [x] After a `PATH` finishes, the course now correctly rejoins the next screen in the original sequence (`nextOverride`), regardless of how many paths exist or where they sit in the page array
  - [x] Branching options now correctly appear only after the setup dialogue finishes playing, not from the moment the page loads
  - [x] Added CSS styling for branching buttons
- [x] Dead code removed: ~4,100 lines
- [x] Local uncommitted work backed up to GitHub

## 🔧 In Progress / Next Up

- [ ] **`TYPE=TAB` / `ASSET_REF=` prop overlay** — the attribute is now captured (`screen.propRef`), but no visual overlay is actually rendered from it yet. Confirmed separately: a pre-existing bug in `presentationProvider.js` was silently corrupting the background image on these screens by treating a raw string as a resolved image object; that's now fixed by the rename, but the prop image itself still isn't shown. Needs its own design pass (where should it appear on screen, what size, etc.)

## ❌ Confirmed Not Working / Not Built

- [ ] **Close-up/highlight animation on the speaking character** — raised as a polish idea (brief zoom or highlight per line, ~2 sec, to add motion). Not started; explicitly deferred to keep the branching fix isolated and testable.
- [ ] **Stage 3 — Pause button** (visually present, not yet functional)
- [ ] **Stage 5 — lock/unlock navigation gating** (deliberately deferred, by design)
- [ ] **Auto-running scene pacing beyond dialogue**
- [ ] **End-of-course analytics/results slide** — does not exist
- [ ] **SCORM export — four separate issues, none fixed yet**

## ⚠️ Verified Present But Not Yet Tested Live

- [ ] Non-branching interactions (MCQ, hotspot, drag-drop, reflection, click-to-reveal, case-study, dialogue-choice, sorting) — registered and reachable, same render/bind pattern as BRANCHING now confirmed working, but not yet individually click-tested with real script data

## 📝 Roadmap Items Raised, Not Yet Scoped

- **Vertical/portrait course format**
- **MP4 export of auto-running scenes with VO**

## 📝 Known, Deliberately Deferred

- Full multi-user login/auth system
- Cleanup of duplicate project folders on Debraj's local machine outside git

