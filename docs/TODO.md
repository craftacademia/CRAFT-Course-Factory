# CRAFT Course Factory 2.0

# MASTER TODO

Status: Sprint 1 — In Progress

---

# CURRENT IMPLEMENTATION STATE

Completed:

- Compiler foundation
- DOCX ingestion
- Lexer pipeline
- AST generation
- CCIR generation
- CCIR builders foundation
- Reference resolver foundation
- Integrity validator foundation
- Asset pipeline foundation
- Image asset handling
- Audio asset handling
- PIR generation
- Presentation generation foundation
- HTML rendering foundation
- Preview server
- Runtime audio asset serving
- Image asset rendering validation
- Audio asset rendering validation
- Preview asset MIME validation

Current active phase:

- Runtime completion

---

# PHASE 1 — MVP PRODUCTION PLATFORM

## 1. Architecture & Foundation

Completed:

- [x] Architecture audit
- [x] SYSTEM_ARCHITECTURE.md
- [x] Provider architecture
- [x] Dependency audit

Remaining:

- [ ] Final production architecture validation

---

# 2. Script Processing Pipeline

Completed:

- [x] DOCX ingestion
- [x] Lexer provider
- [x] AST generation
- [x] Compiler orchestration

Remaining:

- [ ] Parser stabilization
- [ ] Error reporting
- [ ] Production input validation

---

# 3. CCIR Pipeline

Completed:

- [x] CCIR document model
- [x] Course builder
- [x] Character builder
- [x] Location builder
- [x] Asset builder
- [x] Variable builder
- [x] Screen builder
- [x] Dialogue builder
- [x] Interaction builder
- [x] Assessment builder
- [x] Reference resolver foundation
- [x] Integrity validator foundation

Remaining:

- [ ] Production validation rules
- [ ] Complete reference validation
- [ ] CCIR regression tests

---

# 4. Asset Pipeline

Completed:

- [x] Asset manifest
- [x] Image ingestion
- [x] Audio ingestion
- [x] Image PIR mapping
- [x] Audio PIR mapping
- [x] Image rendering
- [x] Audio rendering
- [x] Preview asset serving
- [x] Audio MIME validation

Remaining:

- [ ] Character asset placement
- [ ] Location asset placement
- [ ] Multi-asset validation

---

# 5. Presentation Engine

Completed:

- [x] Presentation provider
- [x] Course builder
- [x] Page builder
- [x] Component generation
- [x] HTML renderer foundation

Remaining:

- [ ] Dialogue rendering
- [ ] Assessment rendering
- [ ] Interaction rendering
- [ ] Template validation

---

# 6. Runtime Engine

Completed:

- [x] Runtime foundation
- [x] Runtime configuration
- [x] Audio runtime foundation

Remaining:

- [ ] Browser runtime validation
- [ ] Navigation engine
- [ ] Timeline execution
- [ ] Runtime state management

---

# 7. Interaction Engine

Required Sprint 1 scope:

- [ ] Click interaction
- [ ] MCQ / Choice interaction
- [ ] Dialogue choice
- [ ] Reflection
- [ ] Hotspot
- [ ] Drag and Drop
- [ ] Sorting / Ordering
- [ ] Scenario branching

Supporting:

- [ ] Interaction event dispatcher
- [ ] Interaction state handling
- [ ] Feedback system

---

# 8. Assessment Runtime

Remaining:

- [ ] Assessment rendering
- [ ] Score calculation
- [ ] Pass/fail handling
- [ ] Completion state

---

# 9. Final Analytics Slide

Scope:

Only end-of-course generated summary slide.

Required:

- [ ] Completion summary
- [ ] Score summary
- [ ] Interaction performance
- [ ] Time spent
- [ ] Completion status
- [ ] Certificate/completion trigger hook

---

# 10. SCORM Delivery

Remaining:

- [ ] SCORM manifest
- [ ] SCORM packaging
- [ ] Runtime communication
- [ ] Completion reporting

---

# 11. GCP Production Hosting

Remaining:

- [ ] Docker production image
- [ ] Cloud Run deployment
- [ ] Cloud Storage integration
- [ ] Production environment
- [ ] Team access workflow

---

# 12. Client Project Workflow

Remaining:

- [ ] Upload client script
- [ ] Upload assets
- [ ] Generate course
- [ ] Preview
- [ ] Export HTML5
- [ ] Export SCORM
- [ ] Client delivery workflow

---

# Sprint 1 Completion Criteria

Sprint 1 completes when:
