# CRAFT Course Factory 2.0

# TEST PLAN

Version: 2.0

Status: Active Development

---

# Purpose

Define validation strategy for CRAFT Course Factory.

Testing ensures the platform can reliably convert course scripts into production-ready learning experiences.

---

# Testing Layers


Unit Tests
↓
Integration Tests
↓
Pipeline Validation
↓
Runtime Validation
↓
Production Validation


---

# 1. Compiler Tests

## Objective

Validate script processing pipeline.

## Tests

- [ ] DOCX ingestion test
- [ ] Lexer output validation
- [ ] AST generation validation
- [ ] Compiler pipeline execution
- [ ] Invalid input handling
- [ ] Error reporting validation

---

# 2. CCIR Tests

## Objective

Validate canonical course representation.

## Tests

- [ ] Course generation
- [ ] Character generation
- [ ] Location generation
- [ ] Asset generation
- [ ] Variable generation
- [ ] Screen generation
- [ ] Dialogue generation
- [ ] Interaction generation
- [ ] Assessment generation

---

# 3. CCIR Validation Tests

## Tests

- [ ] Reference resolution
- [ ] Missing reference detection
- [ ] Invalid relationship detection
- [ ] Integrity validation

---

# 4. Asset Pipeline Tests

## Objective

Validate media handling.

## Image Tests

Completed:

- [x] Image ingestion
- [x] Image manifest generation
- [x] Image PIR mapping
- [x] Image component rendering
- [x] Image browser loading

Remaining:

- [ ] Character asset validation
- [ ] Location asset validation
- [ ] Multi-image validation

---

## Audio Tests

Completed:

- [x] Audio ingestion
- [x] Audio manifest generation
- [x] Audio PIR mapping
- [x] Audio component generation
- [x] Audio MIME validation
- [x] Browser audio loading

Remaining:

- [ ] Multi-audio validation

---

# 5. Presentation Tests

## Objective

Validate PIR generation and rendering.

## Tests

- [ ] Presentation generation
- [ ] Page generation
- [ ] Layer generation
- [ ] Component generation
- [ ] HTML rendering
- [ ] Template validation

---

# 6. Runtime Tests

## Objective

Validate learner experience execution.

Current:

Completed:

- [x] Runtime initialization
- [x] Asset loading foundation
- [x] Audio runtime foundation

Remaining:

- [ ] Browser runtime validation
- [ ] Navigation validation
- [ ] Timeline validation
- [ ] Runtime state validation

---

# 7. Interaction Tests

## Objective

Validate learner interaction capabilities.

Required Sprint-1 tests:

## Click

- [ ] Target detection
- [ ] Event execution

## MCQ / Choice

- [ ] Question rendering
- [ ] Selection handling
- [ ] Answer validation
- [ ] Feedback

## Dialogue Choice

- [ ] Choice rendering
- [ ] Branch execution

## Reflection

- [ ] Input capture
- [ ] Response storage

## Hotspot

- [ ] Region detection
- [ ] Selection validation

## Drag and Drop

- [ ] Drag handling
- [ ] Drop validation

## Sorting

- [ ] Ordering validation

## Scenario Branching

- [ ] Decision execution
- [ ] Path selection

---

# 8. Assessment Tests

## Tests

- [ ] Assessment rendering
- [ ] Answer evaluation
- [ ] Score calculation
- [ ] Pass/fail handling
- [ ] Completion state

---

# 9. Final Analytics Slide Tests

## Objective

Validate end-of-course summary generation.

Tests:

- [ ] Completion summary display
- [ ] Score summary display
- [ ] Interaction performance display
- [ ] Time calculation
- [ ] Completion status display
- [ ] Certificate trigger hook

---

# 10. SCORM Tests

## Tests

- [ ] Manifest generation
- [ ] Package creation
- [ ] Runtime communication
- [ ] Completion reporting

---

# 11. Deployment Tests

## GCP Validation

Tests:

- [ ] Production build
- [ ] Docker image validation
- [ ] Cloud Run deployment
- [ ] Storage integration
- [ ] Environment configuration

---

# 12. End-to-End Production Test

Scenario:


Upload Script
↓
Upload Assets
↓
Build Course
↓
Generate HTML5
↓
Launch Runtime
↓
Complete Course
↓
Generate Analytics Slide
↓
Export SCORM


Validation:

- [ ] Complete pipeline execution
- [ ] Generated output verification
- [ ] Client delivery package verification

---

# Test Status

Completed:

- Compiler foundation validation
- CCIR foundation validation
- Asset pipeline validation
- Image rendering validation
- Audio rendering validation
- Preview asset validation

In Progress:

- Runtime validation

Pending:

- Interaction validation
- Assessment validation
- SCORM validation
- GCP production validation

