# Design System Specification

## 1. Overview & Creative North Star: "The Fluid Architect"

This design system is engineered to transform complex IoT data into a high-end, editorial experience. We reject the "dashboard-in-a-box" aesthetic in favor of **The Fluid Architect**—a creative north star that prioritizes intentional depth, atmospheric layering, and sophisticated typography.

The system moves beyond a standard grid by utilizing asymmetrical card arrangements and varying surface elevations to guide the user's eye. Instead of rigid containers, we treat the UI as a series of curated modules that breathe through generous whitespace and soft, tactile edges. This is a workspace for high-level decision-making, where the visual weight of every element is balanced to reduce cognitive load while maintaining an authoritative, premium presence.

---

## 2. Colors: Tonal Depth & Soul

The palette is anchored in deep aquatic tones, balanced by high-utility accents and an expansive neutral foundation.

### Palette Strategy
- **Primary (`#003D7C` to `#0054A6`):** Our foundational "Deep Ocean Blue." Use `primary_container` for hero actions and `on_primary_fixed_variant` for authoritative text.
- **Secondary (`#006A6A` to `#008080`):** The "Teal Vitality" color. Reserved strictly for "Online" states, success confirmations, and active fluid-flow indicators.
- **Tertiary (`#6A2B00` to `#8F3C00`):** "Burnt Sienna." Use this for warnings, critical edits, and maintenance alerts. Its high contrast against the blue primary ensures immediate user attention.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Modernity is achieved through background shifts. Boundaries must be defined by placing a `surface_container_lowest` (Pure White) card atop a `surface_container_low` background. 

### Glass & Gradient Soul
To avoid a flat, "out-of-the-box" feel, use **Glassmorphism** for floating elements (e.g., navigation bars, tooltips). Apply `surface_container_lowest` at 80% opacity with a `24px` backdrop-blur. Main CTAs should utilize a subtle linear gradient from `primary` to `primary_container` to provide a "soulful" physical presence.

---

## 3. Typography: The Editorial Voice

We utilize a dual-typeface system to create a clear distinction between "Data" and "Narrative."

*   **Headlines: Manrope (Bold)**
    High-end and geometric. Manrope provides an authoritative, industrial-yet-modern feel.
    - `display-lg` (3.5rem): Reserved for hero metrics and system titles.
    - `headline-sm` (1.5rem): Used for primary card titles.
*   **Body & Labels: Inter**
    Selected for its unparalleled legibility in data-dense environments.
    - `body-md` (0.875rem): Standard reading size for system descriptions.
    - `label-md` (0.75rem): Used for uppercase eyebrow text and micro-copy.

**Hierarchy Note:** Always maintain a 2:1 ratio between headline and body size to ensure a signature, high-contrast editorial look.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are a secondary thought; **Tonal Layering** is our primary driver of hierarchy.

### The Layering Principle
Stack surface tiers to create "natural lift":
1.  **Canvas:** `surface` (#F7F9FB) with a subtle dot-grid pattern.
2.  **Sectioning:** `surface_container_low` (#F2F4F6) for grouping related cards.
3.  **Active Modules:** `surface_container_lowest` (#FFFFFF) for primary interactive cards.

### Ambient Shadows
When an element must "float" (e.g., a modal or a floating action button), use a shadow with a blur radius of `32px` at `6%` opacity. The shadow color must be tinted with the `on_surface` token (`#191C1E`) to simulate natural light.

### The "Ghost Border" Fallback
If accessibility requires a container edge, use the **Ghost Border**: `outline_variant` at 15% opacity. Never use 100% opaque borders.

---

## 5. Components: Precision Primitives

### Buttons
- **Primary:** Solid `primary_container`. `8px` corner radius. Use for main dashboard actions.
- **Secondary:** `surface_container_high`. Neutral and understated.
- **Inverted:** `inverse_surface` (Deep Charcoal/Black). Used for high-impact destructive or system-level toggles.
- **Circular Icon Buttons:** Strictly `48x48px` circles in `primary`, `secondary`, or `tertiary` to denote specific functional modes.

### Cards & Lists
Cards must use a corner radius of `12px` to `16px` (`xl` token). 
- **Rule:** Forbid the use of divider lines in lists. Use vertical whitespace (`1rem` to `1.5rem`) or alternating `surface_container_low` and `surface_container_lowest` backgrounds to separate data points.

### Input Fields
- **Search:** Subtle `surface_container` fill. No border.
- **Active State:** A `2px` focus ring using `primary` at 40% opacity, rather than a hard line.

### IoT Status Chips
Utilize "Glow-Pills": Chips that use `secondary_container` (Teal) with a `4px` inner shadow to look like an illuminated LED indicator on physical hardware.

---

## 6. Do's and Don'ts

### Do
- **Do** use intentional asymmetry. A large metric card next to two smaller stacked cards creates a sophisticated, non-template look.
- **Do** maximize the Spacing Scale. If a card feels crowded, double the padding.
- **Do** use the `tertiary` (Burnt Orange) sparingly—only when user intervention is required.

### Don't
- **Don't** use pure black `#000000`. Use `on_surface` or `inverse_surface` for a more natural, premium depth.
- **Don't** use standard 1px borders. If you feel you need a line, use a background color shift instead.
- **Don't** mix the font families. Manrope is for titles; Inter is for utility. Crossing them breaks the editorial hierarchy.