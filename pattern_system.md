# Pattern System — TS Brush

This document defines the recurring UI/UX patterns for the TS Brush platform, complementing the [Design System](file:///c:/Users/ghx/Desktop/TS-BRUSH/design_system.md).

## 1. Modal Components

### 1.1 — Premium Modal Footer
Every multi-step or complex modal must feature a standardized footer to ensure consistent navigation.

**Pattern Rules:**
- **Divider:** A 1px top border using `rgba(255, 255, 255, 0.08)`.
- **Primary Action:** The "Advance" (Próximo) or "Finish" (Gerar/Salvar) button must always be anchored to the **Bottom Right**.
- **Button Sizing:** Use `width: auto` and a `min-width: 140px` to keep buttons compact and prevent them from stretching.
- **Secondary Content:** Contextual elements (inputs, info tags) are allowed on the **Bottom Left**.
- **Padding:** Standardized padding of `16px 0 0` with a `margin-top: 12px`.

**CSS Reference:** `.np-modal-footer`

### 1.2 — Glass Inputs (Premium Standard)
Inputs used in modals and high-end interfaces should follow the "Glassmorphism" standard for depth.

**Pattern Rules:**
- **Background:** `rgba(30, 30, 30, 0.3)`.
- **Blur:** `backdrop-filter: blur(4px)`.
- **Border:** `1px solid rgba(255, 255, 255, 0.06)`.
- **Depth:** `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04)`.
- **Focus:** `border-color: rgba(255, 163, 0, 0.4)` + Glow.

**CSS Reference:** `.np-input`, `.form-input`

## 2. Navigation Patterns

### 2.1 — Step Progression
Multi-step flows should use the `.np-steps` indicator in the modal header and the standard right-aligned button in the footer to signal progression.

### 2.2 — Segmented Controls (Tabs)
Internal navigation within a view (like style selection) must use the glassy segmented control pattern.

**CSS Reference:** `.np-style-tabs`

---
> [!IMPORTANT]
> Always prefer reuse of standardized `np-` classes over creating ad-hoc styles for new modals.
