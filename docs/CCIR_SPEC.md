# CRAFT Course Factory 2.0

# CCIR SPECIFICATION

Version: 1.0

Status: Active Development

---

# Purpose

CCIR (Course Content Intermediate Representation) is the canonical internal representation used by CRAFT Course Factory.

CCIR provides a normalized structure between:


Source Script
↓
Compiler
↓
CCIR
↓
PIR
↓
Renderer


---

# CCIR Objectives

CCIR must:

- Represent complete course structure
- Separate content from rendering
- Support multiple output formats
- Maintain entity relationships
- Support validation before rendering

---

# Root CCIR Structure

```json
{
  "version": "",
  "course": {},
  "characters": [],
  "locations": [],
  "assets": {},
  "variables": [],
  "screens": [],
  "interactions": [],
  "assessments": []
}

Course Entity
Purpose:
Stores course-level information.
Example:
{
  "id": "",
  "title": "",
  "version": ""
}
Character Entity
Purpose:
Represents characters appearing in the course.
Structure:
{
  "id": "",
  "name": "",
  "attributes": {}
}
Location Entity
Purpose:
Represents environments and scenes.
Structure:
{
  "id": "",
  "name": "",
  "description": "",
  "attributes": {}
}
Asset Entity
Purpose:
Stores course media references.
Supported:
Images
Audio
Structure:
{
  "images": [],
  "audio": {}
}
Variable Entity
Purpose:
Stores runtime variables.
Structure:
{
  "id": "",
  "value": ""
}
Screen Entity
Purpose:
Represents individual learning screens.
Structure:
{
  "id": "",
  "title": "",
  "type": "",
  "character": "",
  "location": "",
  "asset": "",
  "children": []
}
Screen Relationships
Screens may reference:
Character:
screen.character
        ↓
characters.id
Location:
screen.location
        ↓
locations.id
Asset:
screen.asset
        ↓
assets
Dialogue Entity
Purpose:
Represents conversations.
Contains:
Speaker
Expression
Voice reference
Text content
Example:
{
  "speaker": "",
  "expression": "",
  "voId": "",
  "text": ""
}

Interaction Entity
Purpose:
Defines learner interactions.
Supported interaction types:
CLICK

MCQ

DIALOGUE_CHOICE

REFLECTION

HOTSPOT

DRAG_DROP

SORTING

BRANCHING

Structure:
{
  "id": "",
  "type": "",
  "target": "",
  "properties": {}
}

Assessment Entity
Purpose:
Defines evaluation content.
Structure:
{
  "id": "",
  "questions": []
}

Reference Resolution
CCIR uses references instead of duplicated objects.
Resolver responsibilities:
Link characters
Link locations
Link assets
Link screens
Link interactions
Link assessments
Output:
Resolved CCIR document.

Validation Rules
CCIR validation checks:
Required References
Character references exist
Location references exist
Asset references exist
Structural Validation
Required fields exist
Entity IDs are unique
Relationships are valid

CCIR Processing Flow
AST
 ↓
CCIR Builders
 ↓
CCIR Document
 ↓
Reference Resolver
 ↓
Integrity Validator
 ↓
Resolved CCIR

Current Implementation Status
Completed:
CCIR document model
Course builder
Character builder
Location builder
Asset builder
Variable builder
Screen builder
Dialogue builder
Interaction builder
Assessment builder
Reference resolver foundation
Integrity validator foundation
Remaining:
Production validation rules
Complete reference validation
CCIR regression tests

