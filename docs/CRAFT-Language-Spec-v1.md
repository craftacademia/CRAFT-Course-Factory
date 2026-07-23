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


---

# 3. Grammar

## 3.1 Lexical Rules

A CRAFT document consists of a sequence of text lines.

Each line SHALL be interpreted as one of the following token types:

- OPEN_TAG
- CLOSE_TAG
- TEXT

Blank lines SHALL be preserved as TEXT nodes.

Whitespace outside tags SHALL be ignored during parsing.

---

## 3.2 Tag Grammar

Opening Tag

[TAG_NAME ATTRIBUTE="VALUE"]

Closing Tag

[/TAG_NAME]

Tag names SHALL follow the naming rules defined in Section 2.3.

Every opening tag MUST have one matching closing tag.

Nested tags MUST be properly balanced.

Crossed or overlapping tags are invalid.

Example

[COURSE]
    [SCREEN ID="S01"]
    [/SCREEN]
[/COURSE]

---

## 3.3 Attribute Grammar

Attributes SHALL follow the syntax:

KEY="VALUE"

Multiple attributes SHALL be separated by one or more spaces.

Example

ID="S01" TYPE="STATIC" LOCATION="LOC-01"

Attribute values MAY contain spaces.

Example

TITLE="Branch Sales Executive"

Duplicate attribute names within the same tag are invalid.

---

## 3.4 Text Nodes

Any line that is not recognised as an opening or closing tag SHALL be treated as a TEXT node.

Text nodes SHALL preserve their original content.

The compiler SHALL preserve the original order of text nodes.


---

# 4. Semantics

Semantics define the meaning of valid CRAFT constructs after successful parsing.

While grammar defines how a document is written, semantics define what the document represents.

A document MAY be grammatically valid but semantically invalid.

---

## 4.1 Parent-Child Rules

Every CRAFT element SHALL exist only within its permitted parent element.

The compiler SHALL reject any element that appears outside its valid parent.

Example hierarchy:

COURSE
 ├── CHARACTERS
 │     └── CHARACTER
 │
 ├── LOCATIONS
 │     └── LOCATION
 │
 ├── ASSETS
 │     └── ASSET
 │
 ├── VARIABLES
 │
 ├── SCREENS
 │     └── SCREEN
 │
 └── ASSESSMENTS

Parent-child relationships are validated during semantic analysis.

---

## 4.2 Mandatory Attributes

Some tags require mandatory attributes.

Examples include:

CHARACTER
    ID
    NAME

LOCATION
    ID
    NAME

ASSET
    ID
    TYPE

SCREEN
    ID
    TYPE

If any mandatory attribute is missing, the compiler SHALL report a semantic error.

---

## 4.3 Optional Attributes

Tags MAY define optional attributes.

Optional attributes extend the behaviour of an element without changing its identity.

Examples include:

TITLE

DESCRIPTION

LOCATION

SPEAKER

EXPRESSION

VO_ID

Optional attributes SHALL use the same syntax rules as mandatory attributes.

---

## 4.4 Cross References

Many elements reference other elements by identifier.

Examples include:

LOCATION="LOC-01"

ASSET_REF="PROP-18"

SPEAKER="RAV"

The compiler SHALL verify that every referenced identifier exists.

Forward references are permitted.

Missing references SHALL be reported during semantic validation.


---

# 5. Validation

Validation ensures that a CRAFT document is complete, internally consistent, and suitable for compilation.

Validation SHALL be performed after parsing and semantic analysis.

If one or more validation errors are detected, the compiler SHALL terminate without generating CCIR.

---

## 5.1 Validation Categories

The compiler SHALL perform the following categories of validation:

- Structural Validation
- Semantic Validation
- Reference Validation
- Attribute Validation
- Content Validation

Multiple validation errors MAY be reported in a single compilation run.

---

## 5.2 Structural Validation

Structural validation verifies that the document conforms to the language grammar.

The compiler SHALL verify:

- All tags are properly closed.
- Nested elements are correctly balanced.
- Root elements appear only once.
- Invalid nesting is rejected.
- Unknown tags are rejected.

Structural validation is performed before semantic validation.

---

## 5.3 Attribute Validation

Attribute validation verifies that every attribute satisfies the specification.

The compiler SHALL verify:

- Mandatory attributes are present.
- Attribute names are valid.
- Duplicate attributes do not exist.
- Attribute values follow the required format.
- Enumerated attributes contain permitted values.

Invalid attributes SHALL generate compilation errors.

---

## 5.4 Reference Validation

Reference validation verifies that all referenced objects exist.

Examples include:

LOCATION="LOC-01"

SPEAKER="RAVI"

ASSET_REF="IMG-101"

The compiler SHALL verify that:

- Every referenced identifier exists.
- Identifier types are compatible.
- Duplicate identifiers are rejected.
- Undefined identifiers are reported.

Forward references are permitted.

---

## 5.5 Content Validation

Content validation verifies the logical consistency of the document.

Examples include:

- Empty mandatory sections.
- Duplicate screen identifiers.
- Missing assessment questions.
- Empty dialogue blocks.
- Invalid navigation targets.

Content validation rules MAY evolve in future language versions while maintaining backward compatibility.

