# Course Compiler Intermediate Representation (CCIR)

Version: 2.0

Status: Active

---

# Purpose

CCIR (Course Compiler Intermediate Representation) is the canonical compiler output generated from the parsed DSL.

It is the authoritative contract between the compiler and the presentation layer.

```
DSL
    ↓
Lexer
    ↓
Parser
    ↓
AST
    ↓
CCIR Provider
    ↓
CCIR
    ↓
Presentation Builder
```

---

# Top-Level Structure

A CCIR document contains:

- course
- characters
- locations
- assets
- variables
- screens
- interactions
- assessments
- metadata
- index
- lookup

---

# Course

Contains:

- id
- title
- version

---

# Screen

Contains:

- id
- title
- type
- character
- location
- asset
- props
- attributes
- children

Resolved references:

- characterRef
- locationRef
- assetRef
- interactions

---

# Character

Contains:

- id
- name
- attributes

---

# Location

Contains:

- id
- name
- attributes

---

# Asset

Contains:

- id
- type
- source
- attributes

---

# Variable

Contains:

- id
- value
- attributes

---

# Interaction

Contains:

- id
- type
- target
- action
- attributes
- children

---

# Assessment

Contains:

- id
- type
- attributes
- children

---

# Reference Resolution

The Reference Resolver enriches screens with:

- characterRef
- locationRef
- assetRef
- interactions

The original identifiers remain unchanged.

---

# Validation

Integrity validation verifies:

- character references
- location references
- asset references
- interaction collections
- interaction identifiers
- interaction types

Validation failures stop compilation.

---

# Compiler Contract

The Presentation Builder consumes only CCIR.

It must never read:

- AST
- Parser output
- Lexer output