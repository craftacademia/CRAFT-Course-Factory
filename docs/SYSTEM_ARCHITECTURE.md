# CRAFT Course Factory 2.0

## System Architecture

Version: 2.0

Status: Active

---

# Objective

Build a production-ready Course Factory capable of generating HTML and SCORM compliant learning content from structured scripts, hosted on Google Cloud Platform.

---

# End-to-End Pipeline

```
Script
    ↓
Reader
    ↓
Document Formatter
    ↓
Lexer
    ↓
Parser
    ↓
Attribute Normalizer
    ↓
Validator
    ↓
Semantic Validator
    ↓
CCIR
    ↓
Presentation Builder (PIR)
    ↓
Renderer
    ↓
HTML Preview
    ↓
Packaging
```

---

# Compiler Pipeline

- WordReaderProvider
- DocumentFormatterProvider
- LexerProvider
- ParserProvider
- AttributeNormalizer
- ValidatorProvider
- SemanticProvider
- CCIRProvider
- PresentationProvider
- RendererProvider

---

# Presentation Pipeline

```
CCIR
    ↓
Course Builder
    ↓
Page Builder
    ↓
Layer Builder
    ↓
Component Builder
    ↓
Timeline Builder
    ↓
PIR
```

---

# Rendering Pipeline

```
PIR
    ↓
HTML Builder
    ↓
CSS Builder
    ↓
Runtime Builder
    ↓
Preview Output
```

---

# Runtime Pipeline

```
BrowserRuntime
    ↓
NavigationEngine
    ↓
RuntimePlayer
    ↓
Component Registry
    ↓
Component Renderers
```

---

# Production Status

## Completed

- Compiler Pipeline
- CCIR Pipeline
- Presentation Builder
- HTML Renderer
- Browser Runtime
- Navigation Engine
- Runtime Player

## Pending

- Analytics Merge
- Runtime Provider Merge
- Theme Engine
- Background Music
- Client Preview Enhancements
- GCP Deployment

---

# Architecture Rules

- No architectural changes without approval.
- Every new feature must integrate into the existing architecture.
- No duplicate implementations.
- This document is the authoritative architecture reference for the project.