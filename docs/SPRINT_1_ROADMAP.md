# CRAFT Course Factory 2.0

# SPRINT 1 ROADMAP

Status: In Progress

---

# Sprint Objective

Deliver the first production-ready version of CRAFT Course Factory capable of generating complete interactive learning courses and preparing the platform for real client projects.

---

# Sprint 1 Delivery Flow
Client Script
↓
Compiler
↓
CCIR
↓
PIR
↓
Renderer
↓
Runtime
↓
Interactions
↓
Assessment
↓
Final Analytics Slide
↓
SCORM
↓
GCP Deployment
↓
Team Client Workflow


---

# 1. Compiler Pipeline

Status: In Progress

## Completed

- [x] DOCX ingestion
- [x] Lexer pipeline
- [x] AST generation
- [x] Compiler orchestration

## Remaining

- [ ] Parser stabilization
- [ ] Production error reporting
- [ ] Production input validation
- [ ] Invalid script handling

---

# 2. CCIR Pipeline

Status: In Progress

## Completed

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

## Remaining

- [ ] Production validation rules
- [ ] Complete reference validation
- [ ] CCIR regression tests

---

# 3. Asset Pipeline

Status: Completed Foundation

## Completed

- [x] Asset manifest
- [x] Image ingestion
- [x] Audio ingestion
- [x] Image PIR mapping
- [x] Audio PIR mapping
- [x] Image rendering
- [x] Audio rendering
- [x] Preview asset serving
- [x] Audio MIME validation

## Remaining

- [ ] Character asset placement
- [ ] Location asset placement
- [ ] Multi-asset validation

---

# 4. Presentation Engine

Status: In Progress

## Completed

- [x] Presentation provider
- [x] Course builder
- [x] Page builder
- [x] Component generation foundation
- [x] HTML rendering foundation

## Remaining

- [ ] Dialogue rendering
- [ ] Assessment rendering
- [ ] Interaction rendering
- [ ] Template validation

---

# 5. Runtime Engine

Status: In Progress

## Completed

- [x] Runtime foundation
- [x] Runtime configuration
- [x] Audio runtime foundation

## Remaining

- [ ] Browser runtime validation
- [ ] Navigation engine
- [ ] Timeline execution
- [ ] Runtime state management

---

# 6. Dialogue System

Status: Pending

## Scope

Support scenario-based learning experiences.

## Required

- [ ] Speaker rendering
- [ ] Character display
- [ ] Dialogue bubbles
- [ ] Expression handling
- [ ] Voice synchronization hooks

---

# 7. Interaction Engine

Status: Pending

## Objective

Implement the Sprint-1 required interaction capabilities.

## Required Interactions

### Click

- [ ] Click targets
- [ ] Event handling
- [ ] Action execution

### MCQ / Choice

- [ ] Question rendering
- [ ] Option selection
- [ ] Answer validation
- [ ] Feedback

### Dialogue Choice

- [ ] Choice options
- [ ] Branch selection
- [ ] Scene routing

### Reflection

- [ ] Text input
- [ ] Response capture

### Hotspot

- [ ] Image regions
- [ ] Target detection

### Drag and Drop

- [ ] Draggable objects
- [ ] Drop zones
- [ ] Match validation

### Sorting / Ordering

- [ ] Item ordering
- [ ] Validation

### Scenario Branching

- [ ] Decision points
- [ ] Conditional paths
- [ ] Outcomes

## Supporting Runtime

- [ ] Interaction event dispatcher
- [ ] Interaction state management
- [ ] Feedback system

---

# 8. Assessment Runtime

Status: Pending

## Required

- [ ] Question rendering
- [ ] Answer evaluation
- [ ] Score calculation
- [ ] Pass/fail handling
- [ ] Completion state

---

# 9. Final Analytics Slide

Status: Pending

## Scope

Only end-of-course generated summary slide.

No analytics dashboard.
No analytics platform.

## Required

### Completion Summary

- [ ] Completion message
- [ ] Completion status
- [ ] Completion timestamp

### Score Summary

- [ ] Total score
- [ ] Percentage
- [ ] Pass/fail result

### Interaction Performance

- [ ] Total interactions
- [ ] Completed interactions
- [ ] Failed interactions

### Time Spent

- [ ] Start time
- [ ] End time
- [ ] Total duration

### Certificate Hook

- [ ] Completion trigger event
- [ ] Certificate generation hook

---

# 10. SCORM Delivery

Status: Pending

## Required

- [ ] SCORM manifest
- [ ] SCORM package generation
- [ ] Runtime communication
- [ ] Completion reporting

---

# 11. GCP Production Hosting

Status: Pending

## Required

- [ ] Production Docker build
- [ ] Cloud Run deployment
- [ ] Cloud Storage integration
- [ ] Production environment configuration
- [ ] Team access workflow

---

# 12. Client Project Workflow

Status: Pending

## Required

- [ ] Upload client script
- [ ] Upload assets
- [ ] Generate course
- [ ] Preview course
- [ ] Export HTML5
- [ ] Export SCORM
- [ ] Client delivery workflow

---

# Sprint 1 Completion Definition

Sprint 1 is complete when:

Team Member
↓
GCP Hosted CRAFT Platform
↓
Upload Client Script
↓
Upload Assets
↓
Generate Course
↓
Preview
↓
Complete Learning Experience
↓
Export HTML5
↓
Export SCORM
↓
Deliver Client Project

