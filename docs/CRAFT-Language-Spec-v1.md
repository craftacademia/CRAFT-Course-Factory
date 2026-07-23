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


---

# 6. AST Specification

The Abstract Syntax Tree (AST) is the compiler's structured representation of a CRAFT document.

The AST is generated immediately after successful parsing and before semantic validation.

Each node in the AST represents exactly one element from the source document.

The AST SHALL preserve the hierarchical structure of the original document.

---

## 6.1 AST Node Structure

Every AST node SHALL contain the following information:

- Node Type
- Tag Name
- Attributes
- Text Content
- Parent Node
- Child Nodes
- Source Line Number

Additional metadata MAY be stored by compiler implementations.

---

## 6.2 Root Node

Every valid CRAFT document SHALL produce exactly one root AST node.

The root node represents the COURSE element.

All other nodes SHALL be descendants of the root node.

Multiple root nodes are invalid.

---

## 6.3 Child Nodes

Each AST node MAY contain zero or more child nodes.

Child nodes SHALL preserve the same ordering as the source document.

The compiler SHALL NOT reorder child nodes during AST construction.

---

## 6.4 Text Nodes

Text appearing between opening and closing tags SHALL be represented as TEXT nodes.

TEXT nodes SHALL preserve:

- Original content
- Original order
- Parent relationship

Whitespace preservation is implementation-defined unless explicitly required by a renderer.

---

## 6.5 AST Integrity

A valid AST SHALL satisfy the following conditions:

- Every node has at most one parent.
- Every child references its parent.
- No circular parent-child relationships exist.
- Node ordering matches the source document.
- Every opening tag produces one corresponding AST node.

The AST SHALL remain immutable after successful semantic validation.


---

# 7. CCIR Specification

The CRAFT Compiler Common Intermediate Representation (CCIR) is the canonical internal representation produced after successful validation.

CCIR serves as the contract between the compiler and all rendering engines.

Every renderer SHALL consume CCIR rather than directly processing the source CRAFT document.

---

## 7.1 Purpose

CCIR SHALL provide:

- A normalized representation of the course.
- Renderer-independent data structures.
- Stable object identifiers.
- Fully resolved references.
- Validation-safe content.

The compiler SHALL generate exactly one CCIR document for every successful compilation.

---

## 7.2 Object Model

CCIR SHALL represent the course as a collection of typed objects.

Typical object categories include:

- Course
- Character
- Location
- Asset
- Variable
- Screen
- Dialogue
- Interaction
- Assessment
- Navigation

Each object SHALL contain a unique identifier.

---

## 7.3 Reference Resolution

All references SHALL be resolved during CCIR generation.

Examples include:

- Character references
- Location references
- Asset references
- Variable references
- Navigation targets

Renderers SHALL NOT perform reference resolution.

---

## 7.4 Renderer Independence

CCIR SHALL contain no renderer-specific information.

Examples of excluded data include:

- HTML markup
- CSS styling
- JavaScript code
- SCORM packaging metadata
- LMS-specific configuration

Renderer-specific artifacts SHALL be generated only during the rendering phase.

---

## 7.5 CCIR Integrity

A valid CCIR SHALL satisfy the following conditions:

- Every object has a unique identifier.
- All references are resolved.
- No duplicate objects exist.
- Object ordering is deterministic.
- The representation is complete and internally consistent.

The CCIR SHALL remain immutable throughout the rendering process.

