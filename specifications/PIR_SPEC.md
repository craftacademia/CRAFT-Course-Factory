# CRAFT Course Factory 2.0

# PIR Specification

Version: 1.0

Status: Active

---

# Purpose

Presentation Intermediate Representation (PIR) is the intermediate format between CCIR and runtime rendering.

PIR transforms validated course meaning into a presentation-ready structure containing:

- pages
- layers
- components
- timelines
- rendering metadata

PIR does not contain authoring semantics. It contains presentation instructions.

---

# Pipeline Position
CCIR
|
v
PIR Builder
|
v
PIR
|
v
Runtime Player
|
v
Renderer
|
v
HTML / SCORM Output


---

# PIR Root Structure

PIR root object:

```json
{
  "version": "1.0",
  "generatedAt": "",
  "course": {},
  "pages": []
}

Required fields:

| Field       | Type     | Required |
| ----------- | -------- | -------- |
| version     | string   | yes      |
| generatedAt | datetime | yes      |
| course      | object   | yes      |
| pages       | array    | yes      |

Course
Course metadata.
Structure:

{
  "id": "",
  "title": "",
  "version": ""
}

Fields:
| Field   | Type   |
| ------- | ------ |
| id      | string |
| title   | string |
| version | string |

Pages
A page represents a runtime presentation unit.
Structure:
{
  "id": "",
  "title": "",
  "layers": [],
  "timeline": []
}

Fields:
| Field    | Type   |
| -------- | ------ |
| id       | string |
| title    | string |
| layers   | array  |
| timeline | array  |

Layers
Layers organize presentation elements.
Structure:
{
  "type": "CONTENT",
  "components": []
}
Supported layer types:
BACKGROUND
CONTENT
OVERLAY

Components
Components are the smallest runtime-renderable units.
Structure:
{
  "id": "",
  "type": "",
  "properties": {},
  "asset": null,
  "voice": null,
  "animation": null,
  "events": []
}
Required:
| Field      | Type   |
| ---------- | ------ |
| id         | string |
| type       | string |
| properties | object |

Component Types
NARRATION
Text presented to the learner.
{
  "type": "NARRATION",
  "properties": {
    "text": ""
  }
}
DIALOGUE
Character speech content.
{
  "type": "DIALOGUE",
  "properties": {
    "text": ""
  }
}
CHARACTER
Character presentation element.
{
  "type": "CHARACTER",
  "properties": {
    "name": ""
  }
}
LOCATION
Scene location element.
{
  "type": "LOCATION",
  "properties": {
    "name": ""
  }
}
PROP
Supporting visual element.
{
  "type": "PROP",
  "properties": {
    "name": ""
  }
}
Timeline
Timeline controls component playback ordering.
Structure:
{
  "id": "",
  "componentId": "",
  "componentType": "",
  "start": 0,
  "duration": 0,
  "end": 0
}
Fields:
| Field         | Type   |
| ------------- | ------ |
| id            | string |
| componentId   | string |
| componentType | string |
| start         | number |
| duration      | number |
| end           | number |

Validation Rules
PIR validation must ensure:
version exists
course metadata exists
pages array exists
each page contains layers
each layer contains components
each component has a valid type
component identifiers are unique
timeline references valid components

Relationship With Runtime
Runtime consumes PIR.
Runtime responsibilities:
load PIR
manage navigation
execute timelines
render components
manage interactions
maintain learner state
PIR responsibilities:
define presentation structure
define component properties
define asset references
define playback metadata
PIR must not contain runtime execution logic.

Example PIR
{
  "version": "1.0",
  "generatedAt": "2026-07-27T00:00:00Z",
  "course": {
    "title": "Introduction to Workplace Safety"
  },
  "pages": [
    {
      "id": "PAGE_001",
      "title": "Workplace Hazards",
      "layers": [
        {
          "type": "CONTENT",
          "components": [
            {
              "id": "NARRATION_001",
              "type": "NARRATION",
              "properties": {
                "text": "Every employee must understand workplace hazards."
              }
            }
          ]
        }
      ]
    }
  ]
}