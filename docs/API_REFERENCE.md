# CRAFT Course Factory 2.0

# API REFERENCE

Version: 2.0

Status: Active Development

---

# Purpose

This document defines the internal API contracts between CRAFT Course Factory providers.

Architecture follows independent providers connected through defined data contracts.

---

# Compiler API

Location:



Purpose:

Convert source scripts into structured course representations.

---

## Compiler Input

Input:



Current supported:

- DOCX

---

## Compiler Output

Output:



Consumed by:

- CCIR Provider

---

# CCIR Provider API

Location:



Purpose:

Generate canonical course representation.

---

## CCIRProvider

Responsibility:

- Build CCIR document
- Generate entities
- Resolve references
- Validate integrity

---

## Build

Input:



Optional:



Output:



---

# CCIR Builders

## CourseBuilder

Creates:



---

## CharacterBuilder

Creates:



---

## LocationBuilder

Creates:



---

## VariableBuilder

Creates:



---

## ScreenBuilder

Creates:



---

## DialogueBuilder

Creates:



---

## InteractionBuilder

Creates:



---

## AssessmentBuilder

Creates:



---

# Reference Resolver API

Location:



Purpose:

Resolve relationships between CCIR entities.

Handles:

- Character references
- Location references
- Asset references
- Screen references
- Interaction references

Output:

Resolved CCIR document.

---

# Integrity Validator API

Purpose:

Validate CCIR consistency.

Checks:

- Missing references
- Invalid relationships
- Structural integrity

---

# Asset API

Purpose:

Manage course assets.

Supported:

- Images
- Audio

---

## Asset Manifest

Structure:


assets
images
audio


---

## Image Asset

Example:


{
name,
path
}


---

## Audio Asset

Example:


{
name,
path
}


---

# Presentation Provider API

Location:



Purpose:

Convert CCIR into presentation structures.

---

## Input



---

## Output



---

# Presentation Components

Supported foundation:

- Pages
- Layers
- Components
- Assets

---

# Rendering API

Location:



Purpose:

Convert PIR into learner-facing output.

---

## HTML Renderer

Input:



Output:



---

## Component Renderer

Responsible for:

- Text components
- Image components
- Audio components

---

# Runtime API

Purpose:

Execute generated courses.

Current:

- Runtime initialization
- Asset loading
- Audio playback foundation

Planned:

- Navigation
- Timeline execution
- Interaction execution
- State management

---

# Interaction API

Planned Sprint-1 contract.

Interaction types:


CLICK
MCQ
DIALOGUE_CHOICE
REFLECTION
HOTSPOT
DRAG_DROP
SORTING
BRANCHING


---

# Assessment API

Planned:

Input:



Output:



Output:



---

# Analytics Slide API

Planned:

Purpose:

Generate final course summary.

Output:

Completion Summary
Score Summary
Interaction Performance
Time Spent
Completion Status
Certificate Trigger


---

# SCORM API

Planned:

Purpose:

Generate LMS compatible packages.

Output:



Includes:

- Manifest
- Course files
- Runtime communication

---

# Deployment API

Target:

Google Cloud Platform

Components:

- Cloud Run
- Cloud Storage
- Production environment

---

# Provider Contract

All providers follow:


Input
↓
Process
↓
Output


Providers remain independent and replaceable.

---

# Current API Status

Completed:

- Compiler contracts
- CCIR contracts
- Asset contracts
- Presentation foundation contracts
- Rendering foundation contracts

In Progress:

- Runtime contracts

Pending:

- Interaction contracts
- Assessment contracts
- SCORM contracts
- Deployment contracts