# Presentation Intermediate Representation (PIR)

Version: 2.0

Status: Active

---

# Purpose

PIR (Presentation Intermediate Representation) is the canonical presentation model generated from CCIR.

It is the final architecture-independent representation before rendering.

The Renderer must never read CCIR directly.

```
CCIR
    ↓
Presentation Builder
    ↓
PIR
    ↓
Renderer
```

---

# Design Principles

- Platform Independent
- Renderer Independent
- Theme Independent
- Runtime Independent
- Animation Independent

---

# PIR Hierarchy

```
Course
    Modules
        Pages
            Layers
                Components
```

---

# Course

Contains:

- id
- title
- metadata
- theme
- settings
- modules

---

# Module

Contains:

- id
- title
- pages

---

# Page

Contains:

- id
- title
- layout
- timeline
- layers

---

# Layer

Contains:

- id
- zIndex
- visible
- components

---

# Component

Each component contains:

- id
- type
- position
- size
- properties
- animation
- interaction
- accessibility

---

# Supported Components

- Text
- Heading
- Paragraph
- Image
- Audio
- Video
- Button
- Shape
- Table
- Icon
- Card
- Quiz
- MCQ
- Fill Blank
- True False
- Drag Drop
- Timeline
- Chart
- Progress
- HTML
- Custom

---

# Timeline

Every page owns a timeline.

Timeline contains:

- start
- end
- duration
- events
- triggers

---

# Events

Supported events:

- Show
- Hide
- Play Audio
- Stop Audio
- Play Video
- Stop Video
- Animate
- Delay
- Navigate
- Execute Action

---

# Navigation

Supported navigation:

- Next
- Previous
- Jump
- Branch
- Exit
- Finish

---

# Interaction Model

Each component may expose:

- Click
- Hover
- Keyboard
- Touch
- Drag
- Drop

---

# Accessibility

Each component supports:

- ariaLabel
- tabIndex
- altText
- keyboardNavigation

---

# Rendering Contract

The Renderer consumes only PIR.

It must never:

- Access parser output
- Access compiler output
- Access CCIR

---

# Future Extensions

Reserved for:

- Theme Engine
- Animation Packs
- Analytics
- SCORM Runtime
- xAPI Runtime
- AI Components

---

# Versioning

Current Version:

2.0

Future PIR changes must remain backward compatible whenever possible.