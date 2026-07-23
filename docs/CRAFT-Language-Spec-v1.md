# CRAFT Language Specification v1.0

---

# 1. Introduction

## 1.1 Purpose

CRAFT (Course Rapid Authoring Framework Technology) is a domain-specific language (DSL) for creating interactive digital learning experiences.

The language enables instructional designers, subject matter experts, and content developers to describe complete learning journeys using a structured, human-readable syntax.

A CRAFT document is compiled into a Canonical Course Intermediate Representation (CCIR), which serves as the source for generating one or more delivery formats including HTML5, SCORM 1.2, SCORM 2004, xAPI, mobile applications, and future runtime environments.

CRAFT is a declarative language. Authors describe what the course contains, while the compiler and runtime determine how it is rendered and executed.

---

## 1.2 Design Goals

### Human Readability

A CRAFT document should be understandable without programming knowledge.

### Structured Authoring

Course elements are represented through explicit tags and attributes, allowing deterministic parsing and validation.

### Platform Independence

The language is independent of any Learning Management System (LMS), rendering engine, or runtime implementation.

### Compiler Friendliness

The language follows strict syntactic and semantic rules so that every valid document produces an unambiguous Abstract Syntax Tree (AST).

### Extensibility

Future versions of the language may introduce new tags, attributes, and rendering capabilities while maintaining backward compatibility.

---

## 1.3 Scope

Version 1.0 of the CRAFT Language defines:

- Language syntax
- Grammar
- Reserved tags
- Attribute conventions
- Nesting rules
- Validation rules
- AST generation
- CCIR generation

The specification does not define:

- Runtime implementation
- Rendering engine internals
- User interface behaviour
- Animation implementation
- LMS-specific packaging

These are defined in separate implementation specifications.

---

# 2. Language Structure

## 2.1 File Structure

A CRAFT document is a hierarchical document composed of nested tags.

Each opening tag MUST have a corresponding closing tag.

Every document MUST contain exactly one root element.

The compiler interprets the document from top to bottom while preserving hierarchy.

---

## 2.2 Reserved Tags

The following top-level tags are reserved in Version 1.0.



---

# 2. Language Structure

## 2.1 File Structure

A CRAFT document is a hierarchical document composed of nested tags.

Each opening tag MUST have a corresponding closing tag.

Every document MUST contain exactly one root element.

The compiler interprets the document from top to bottom while preserving hierarchy.

---

## 2.2 Reserved Tags

The following top-level tags are reserved in Version 1.0.


COURSE
CHARACTERS
LOCATIONS
ASSETS
SCREENS
VARIABLES
ASSESSMENTS

The following entity tags are reserved.

CHARACTER
LOCATION
ASSET
SCREEN

Future versions MAY introduce additional reserved tags.

---

## 2.3 Tag Naming Rules

Tag names:

- MUST use uppercase letters.
- MAY contain digits.
- MAY contain underscores (_).
- MUST begin with an alphabetic character.
- MUST NOT contain spaces.
- MUST NOT contain special characters.

Examples

Valid

SCREEN
CHARACTER
MCQ_SCREEN
SCREEN2

Invalid

screen
My Screen
SCREEN-1
1SCREEN


---

## 2.4 Attribute Rules

Attributes are specified as key-value pairs.

General syntax:

KEY="VALUE"

Rules:

- Attribute names MUST be uppercase.
- Attribute names MUST be unique within a tag.
- Attribute values MUST be enclosed in double quotes.
- Attribute values MAY contain spaces.
- Attribute order is not significant.
- Empty attribute values are permitted unless restricted by semantic rules.

Example:

[SCREEN
ID="S01"
TYPE="STATIC"
LOCATION="LOC-01"
SPEAKER="RAV"
]

---

## 3. Grammar

### 3.1 Lexical Rules

### 3.2 Tag Grammar

### 3.3 Attribute Grammar

### 3.4 Text Nodes

---

## 4. Semantics

### 4.1 Parent-Child Rules

### 4.2 Mandatory Attributes

### 4.3 Optional Attributes

### 4.4 Cross References

---

## 5. Validation

### 5.1 Structural Validation

### 5.2 Semantic Validation

### 5.3 Error Codes

---

## 6. AST Specification

---

## 7. CCIR Specification

---

## 8. Rendering Requirements

---

## 9. Versioning

---

## 10. Backward Compatibility

