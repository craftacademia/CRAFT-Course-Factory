# CRAFT Course Factory 2.0

# CRAFT LANGUAGE SPECIFICATION

Version: 1.0

Status: Active Development

---

# Purpose

CRAFT Language is the structured authoring format used to describe learning experiences that are compiled into CRAFT Course Factory.

The language defines:

- Course structure
- Scenes
- Characters
- Locations
- Dialogue
- Assets
- Interactions
- Assessments

Pipeline:


CRAFT Language
↓
Lexer
↓
Parser
↓
AST
↓
CCIR
↓
PIR
↓
Runtime


---

# Core Concepts

## Course

A course contains the complete learning experience.

Contains:

- Metadata
- Scenes
- Learning flow
- Assessments

---

## Scene

A scene represents a learner-facing screen or learning moment.

Contains:

- Scene identifier
- Type
- Location
- Characters
- Content
- Interactions

Example:
SCENE S01
TYPE: STATIC
LOCATION: LOC-01

---

# Characters

Characters represent people appearing in the course.

Example:

CHARACTER CHAR-01
NAME: Instructor

Character attributes may include:

- Expression
- Pose
- Asset reference
- Metadata


---

# Locations

Locations define environments.

Example:
LOCATION LOC-01
NAME: Branch Office

Locations may contain:

- Description
- Background asset
- Metadata

---

# Assets

Assets represent external course resources.

Supported:

- Images
- Audio

Example:
ASSET SCENE-01.png

Asset references are resolved through the asset pipeline.

---

# Dialogue

Dialogue represents conversations.

Contains:

- Speaker
- Expression
- Voice reference
- Text

Example:
SPEAKER: Instructor
VOICE: VO-S01-001
TEXT:
Welcome to the course.

---

# Interactions

Interactions define learner actions.

Supported Sprint-1 interaction types:
CLICK
MCQ
DIALOGUE_CHOICE
REFLECTION
HOTSPOT
DRAG_DROP
SORTING
BRANCHING

---

# Assessments

Assessments evaluate learner understanding.

Contains:

- Questions
- Options
- Correct answers
- Scoring rules

---

# Language Processing

Processing stages:

## Lexer

Responsible for:

- Token identification
- Attribute extraction
- Structure recognition

---

## Parser

Responsible for:

- Creating AST
- Maintaining hierarchy
- Validating syntax

---

## Compiler

Responsible for:

- Transforming AST
- Generating CCIR

---

# Authoring Structure

Logical structure:
COURSE
├── SCENES
│ ├── CHARACTERS
│ ├── LOCATIONS
│ ├── DIALOGUE
│ ├── ASSETS
│ └── INTERACTIONS
└── ASSESSMENTS

---

# Attribute Model

Entities use attributes for extensibility.

Example:
ENTITY
ID
TYPE
ATTRIBUTES

---

# Reference System

Entities reference each other using IDs.

Examples:
CHAR-01
LOC-01
ASSET-01
SCENE-01

References are resolved during CCIR processing.

---

# Validation Rules

Language validation checks:

- Required identifiers
- Valid entity references
- Supported types
- Structural correctness

---

# Current Implementation Status

Completed:

- DOCX ingestion
- Lexer pipeline
- AST generation
- Compiler foundation
- CCIR generation foundation

Remaining:

- Parser stabilization
- Production error reporting
- Production validation rules
- Complete language validation
