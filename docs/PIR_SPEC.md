# CRAFT Course Factory 2.0

# PIR SPECIFICATION

Version: 1.0

Status: Active Development

---

# Purpose

PIR (Presentation Intermediate Representation) is the presentation-ready representation generated from CCIR.

PIR defines how course content should be rendered and executed by the presentation and runtime layers.

Pipeline:

CCIR
↓
Presentation Provider
↓
PIR
↓
Renderer
↓
HTML5 Runtime


---

# PIR Objectives

PIR must:

- Separate content structure from rendering implementation
- Define learner-facing presentation
- Maintain asset references
- Support runtime execution
- Support multiple renderers

---

# Root PIR Structure

```json
{
  "version": "",
  "generatedAt": "",
  "course": {},
  "pages": [],
  "assets": {},
  "branding": {},
  "audio": {}
}

Course Object
Stores course metadata.
Structure:
{
  "id": "",
  "title": "",
  "version": ""
}

Page Object
A page represents one learner-facing screen.
Structure:
{
  "id": "",
  "title": "",
  "layers": []
}

Layer Object
Layers organize visual and interactive components.
Structure:
{
  "type": "",
  "components": [],
  "template": "",
  "theme": ""
}

Component Object
Components are the smallest renderable units.
Supported foundation:
TEXT
IMAGE
AUDIO
Future:
INTERACTION
ASSESSMENT
VIDEO
ANIMATION
Structure:
{
  "id": "",
  "type": "",
  "asset": null,
  "properties": {},
  "events": []
}

Text Component
Purpose:
Render text content.
Example:
{
  "type": "TEXT",
  "properties": {
    "text": ""
  }
}

Image Component
Purpose:
Render visual assets.
Example:
{
  "type": "IMAGE",
  "asset": "assets/images/example.png",
  "properties": {
    "asset": "assets/images/example.png"
  }
}

Audio Component
Purpose:
Render audio assets.
Example:
{
  "type": "AUDIO",
  "asset": "assets/audio/example.mp3",
  "properties": {
    "asset": "assets/audio/example.mp3"
  }
}

Asset Handling
PIR maintains references to generated assets.
Asset flow:
Asset Manifest
        ↓
CCIR
        ↓
PIR
        ↓
Renderer
        ↓
Runtime

Supported:
Images
Audio

Runtime Properties
Components may contain:
Visibility
Timing
Events
Animations
Runtime attributes
Example:
{
  "start": 0,
  "duration": 0,
  "visible": true
}

Audio Runtime Structure
PIR supports:
{
  "audio": {
    "narration": [],
    "dialogue": [],
    "background": []
  }
}

Branding Structure
PIR supports:
{
  "branding": {
    "logo": null,
    "primaryColor": "",
    "secondaryColor": ""
  }
}

Interaction Components
Planned Sprint-1 support:
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
  "type": "INTERACTION",
  "interactionType": "",
  "properties": {},
  "events": []
}

Assessment Components
Planned:
{
  "type": "ASSESSMENT",
  "properties": {}
}

PIR Generation Flow
CCIR
  ↓
Course Builder
  ↓
Page Builder
  ↓
Component Generation
  ↓
PIR

Validation Rules
PIR validation checks:
Structure
Pages exist
Components have valid types
Required properties exist
Assets
Asset references resolve
Paths exist
Runtime
Events are valid
Components are executable
Current Implementation Status
Completed:
PIR generation foundation
Page generation
Layer generation
Component generation foundation
Image component support
Audio component support
Asset propagation
Remaining:
Interaction components
Assessment components
Runtime event handling
Timeline execution
