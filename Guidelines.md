Layout Specification Governance System — Usage Guidelines

This template defines a governed layout specification. It is not a visual mock, wireframe, or freeform design surface.

Follow these rules when reviewing or extending this specification:

Purpose

Treat this as the single source of truth for page structure, layout intent, and interaction mapping.

The Figma layout represents structure and behavior, not pixel-perfect design.

Structure Rules

Page layouts are defined hierarchically: Sections → Blocks → Subsections.

Section numbering is sequential and reflects vertical page order.

Blocks must reference a valid parent section.

Subsections must reference a valid parent block.

Coordinates & Positioning

All coordinates are expressed as percentages (0–100) relative to the page frame.

Subsection coordinates represent click-target centers, not bounding boxes.

Avoid overlapping subsection coordinates unless intentionally representing shared targets.

Overlays & Interactions

Drawers, modals, and other overlays must be registered in metadata.overlays.

Any subsection that triggers an overlay must declare a valid target_overlay.

Overlay definitions should not be duplicated at the block or subsection level.

Naming & Consistency

Use snake_case, descriptive, human-readable identifiers.

IDs must remain stable once published.

Dual references (section + section_ref, block + block_ref) must remain aligned.

Validation

This spec is expected to pass validation without interpretation.

If something appears ambiguous, it should be clarified in the spec—not assumed by the reader.

Change Discipline

Changes should be intentional, minimal, and reviewed.

Do not "fix for aesthetics." Only update when structure, behavior, or meaning changes.