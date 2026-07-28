# CRAFT Course Factory 2.0

# SYSTEM ARCHITECTURE

Version: 2.0

Status: Active

---

# Objective

CRAFT Course Factory is a production platform that converts structured learning scripts into interactive HTML5 and SCORM-compatible learning experiences.

The system is designed to support:

- Script ingestion
- Course compilation
- Course representation
- Presentation generation
- Runtime execution
- Client delivery workflow
- GCP production hosting

---

# End-to-End Pipeline


Course Script
↓
Reader
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
Renderer
↓
Runtime
↓
HTML5 / SCORM Package


---

# System Layers

## 1. Input Layer

Purpose:

Accept structured learning content.

Current input:

- DOCX course scripts

Responsibilities:

- Read source documents
- Extract structured content
- Prepare data for compilation

---

# 2. Compiler Layer

Purpose:

Convert source content into structured course data.

Components:



Responsibilities:

- Coordinate compilation pipeline
- Process AST
- Generate CCIR

Current status:

Foundation completed.

---

# 3. Lexer Layer

Purpose:

Convert raw script content into structured tokens.

Location:



Responsibilities:

- Identify script elements
- Extract attributes
- Generate structured representation

---

# 4. CCIR Layer

Purpose:

Create the canonical course representation.

Location:



CCIR contains:

- Course
- Characters
- Locations
- Assets
- Variables
- Screens
- Dialogue
- Interactions
- Assessments

---

## CCIR Builders

Implemented:

- CourseBuilder
- CharacterBuilder
- LocationBuilder
- AssetBuilder
- VariableBuilder
- ScreenBuilder
- DialogueBuilder
- InteractionBuilder
- AssessmentBuilder

---

## CCIR Resolution

Components:

- Reference Resolver
- Integrity Validator

Purpose:

- Resolve references
- Validate relationships
- Maintain CCIR consistency

---

# 5. Asset Pipeline

Purpose:

Manage course media.

Supported assets:

- Images
- Audio

Pipeline:


Uploaded Assets
↓
Asset Manifest
↓
CCIR Assets
↓
PIR Assets
↓
Renderer Components
↓
Runtime Assets


Completed:

- Image ingestion
- Audio ingestion
- Asset mapping
- Image rendering
- Audio rendering
- Preview serving
- Audio MIME validation

---

# 6. Presentation Layer

Purpose:

Convert CCIR into presentation structures.

Location:



Components:

- Presentation Provider
- Course Builder
- Page Builder
- Component generation

Output:

PIR

---

# 7. PIR Layer

Purpose:

Define learner-facing presentation structure.

Contains:

- Pages
- Layers
- Components
- Assets
- Runtime properties

PIR is consumed by rendering and runtime systems.

---

# 8. Rendering Layer

Purpose:

Generate HTML learning experiences.

Location:



Current components:

- HTML renderer
- Component renderer
- Scene renderer

Output:

HTML5 course package.

---

# 9. Runtime Layer

Purpose:

Execute generated courses.

Current foundation:

- Runtime configuration
- Asset loading
- Audio runtime

Planned:

- Navigation
- Timeline execution
- State management
- Interaction execution

---

# 10. Interaction Architecture

Purpose:

Support learner interactions.

Planned engine:


    |
    |

    Handlers
Click
MCQ
Dialogue Choice
Reflection
Hotspot
Drag & Drop
Sorting
Scenario Branching


---

# 11. Assessment Architecture

Purpose:

Evaluate learner performance.

Planned:

- Question rendering
- Answer validation
- Score calculation
- Completion handling

---

# 12. Final Analytics Slide

Purpose:

Provide end-of-course summary.

Scope:

A generated course completion slide.

Includes:

- Completion summary
- Score summary
- Interaction performance
- Time spent
- Completion status
- Certificate trigger hook

---

# 13. Deployment Architecture

Target platform:

Google Cloud Platform

Planned:


Users
↓
CRAFT Platform
↓
Cloud Run
↓
Storage
↓
Generated Courses


Components:

- Containerized application
- Cloud Run deployment
- Cloud Storage
- Production environment

---

# 14. Production Workflow

Target workflow:


Team Member
↓
Upload Client Script
↓
Upload Assets
↓
Generate Course
↓
Preview
↓
Export HTML5
↓
Export SCORM
↓
Client Delivery


---

# Architecture Status

Completed:

- Compiler foundation
- CCIR foundation
- Asset pipeline foundation
- PIR generation
- Presentation foundation
- HTML rendering foundation
- Preview server
- Runtime audio foundation

In Progress:

- Runtime completion

Future:

- Interactions
- Assessment
- Analytics slide
- SCORM
- GCP production deployment