# Material Design 3 — Color, Typography, Elevation & Dark Theme
**Source:** Material Design 3 (Google) — https://m3.material.io + https://m2.material.io/design/color/dark-theme.html
**Relevance:** Google's comprehensive design system covering color systems, typography scales, elevation, dark theme, spacing, and component design for professional digital products.

---

## Overview

Material Design 3 (M3) is Google's latest open-source design system. It provides guidance on color, typography, shape, motion, and component behavior to build high-quality, accessible digital experiences. M3 emphasizes dynamic color, personalization, and accessibility at its core.

---

## Color System

### The M3 Color Scheme

M3 defines a structured set of color roles — named slots that describe what color goes where, rather than defining specific hex values. This makes themes swappable while keeping relationships intact.

**Primary color roles:**
- `primary` — The main brand color. Used for key components like FABs and filled buttons
- `on-primary` — Text/icons displayed on top of primary
- `primary-container` — A softer, tonal version of primary for container backgrounds
- `on-primary-container` — Content color on primary-container

**Secondary color roles:**
- `secondary` — Used for supporting components (chips, filters)
- `secondary-container` / `on-secondary-container` — Same pattern as primary

**Tertiary color roles:**
- `tertiary` — Used for contrasting accents to balance or add flair
- `tertiary-container` / `on-tertiary-container`

**Neutral roles (used most):**
- `surface` — The main background of components (cards, sheets, menus)
- `surface-variant` — An alternative surface color
- `on-surface` — Primary content color on surface
- `on-surface-variant` — Secondary/lower-emphasis content on surface
- `outline` — Border and divider color
- `outline-variant` — Subtle divider (lower contrast)

**Error roles:**
- `error` / `on-error` / `error-container` / `on-error-container`

### Color Tonal Palettes

M3 generates tonal palettes from a key color. Each palette has 13 tones from 0 (black) to 100 (white). The system ensures accessible contrast ratios at every tone level.

**Building a palette:**
1. Start with a key brand color (e.g., a blue hex)
2. Use the M3 Theme Builder or tonal palette algorithm to generate 13 tones
3. Map tones to color roles based on the M3 specification

**Why tonal palettes matter:** Instead of picking a random "dark blue" for a hover state, M3's system gives you a mathematically derived palette that maintains harmony and accessible contrast at every level.

### Dynamic Color

M3 supports dynamic color — automatically generating a harmonious color scheme from a user's wallpaper or preferred color. This is available in Android 12+ and represents the future of personalized interfaces.

---

## Typography Scale

M3 defines a type scale with 5 style groups, each with 3 sizes (Large, Medium, Small). This gives 15 named text styles.

### Type Scale

| Style | Large | Medium | Small |
|---|---|---|---|
| **Display** | 57px / Regular | 45px / Regular | 36px / Regular |
| **Headline** | 32px / Regular | 28px / Regular | 24px / Regular |
| **Title** | 22px / Regular | 16px / Medium | 14px / Medium |
| **Body** | 16px / Regular | 14px / Regular | 12px / Regular |
| **Label** | 14px / Medium | 12px / Medium | 11px / Medium |

### When to Use Each Style

- **Display** — Largest text. Short, high-impact text on large screens. Hero sections, hero numbers. Not for body content.
- **Headline** — Short, high-emphasis text. Primary passages or important content regions. H1/H2 equivalents.
- **Title** — Medium emphasis, relatively short text. Secondary content headers, section labels, card titles.
- **Body** — Longer passages of text. Paragraph content, descriptions, messages in a chat interface.
- **Label** — Smallest utilitarian text. Button labels, captions, form field labels, chip text, metadata.

### Typography Best Practices

- Establish a constrained type scale — don't use 10 different font sizes
- Avoid relying only on font size for hierarchy — use weight and color too
- Use pixel or rem units for font sizes, not em (em scales relative to parent, creating unpredictable results)
- Ideal line length: 60-80 characters per line for body text (45-75 for optimal readability)
- Line height for body text: 1.4–1.6x the font size
- Font weights: Regular (400), Medium (500), SemiBold (600), Bold (700) — avoid Thin/Light weights for small sizes

### Default Typeface

M3 uses **Roboto** as its default typeface. For web: **Google Fonts** provides Roboto and many compatible alternatives. High-quality sans-serifs work best for UI: DM Sans, Inter, Plus Jakarta Sans, Outfit.

---

## Elevation System

Elevation creates a sense of depth and hierarchy in the interface. In M3, elevation is expressed through both **shadow** and **surface color** (tonal color overlays).

### Elevation Levels

| Level | dp | Usage |
|---|---|---|
| 0 | 0dp | Base surface, backgrounds |
| 1 | 1dp | Cards at rest, search bar |
| 2 | 3dp | Contained buttons (hover) |
| 3 | 6dp | Floating action button (rest) |
| 4 | 8dp | Navigation bar |
| 5 | 12dp | FAB (hover), tooltips |

**High elevation:** 16dp (navigation drawer), 24dp (dialogs/modals)

### Elevation in Dark Themes

In dark themes, shadows lose visibility against dark surfaces. M3 compensates by **lightening surfaces at higher elevations** using tonal color overlays. The higher the elevation, the lighter the surface becomes. This communicates depth without relying on shadow contrast.

**Overlay formula for dark surfaces:**
- Elevation 1dp → ~5% primary color overlay on surface
- Elevation 4dp → ~8% overlay
- Elevation 8dp → ~11% overlay
- Elevation 16dp → ~15% overlay
- Elevation 24dp → ~16% overlay

---

## Dark Theme Design

### Core Dark Theme Principles

1. **Use dark gray, not pure black** — M3 recommends `#121212` as the dark theme base surface. Pure black (#000000) causes too much contrast and visual "vibration" with white text. Dark gray also provides more range for elevation to work.

2. **Desaturate brand colors** — Highly saturated colors "vibrate" visually against dark backgrounds. Use lighter, less saturated tones (200–50 range in tonal palettes) for colored elements in dark themes.

3. **Elevation via lightness, not shadow** — In dark themes, surfaces get lighter as they get higher in the elevation stack. Use overlays rather than drop shadows.

4. **Text hierarchy via opacity** — In M3 dark themes:
   - High-emphasis text: 87% opacity white
   - Medium-emphasis text: 60% opacity white
   - Disabled text: 38% opacity white
   - (Don't use pure #FFFFFF — it "vibrates" against dark backgrounds)

5. **Meet contrast requirements** — Even in dark themes, WCAG 4.5:1 for normal text must be met. Test text colors against all elevation levels (higher elevation = lighter background = less contrast with white text).

### Dark Theme Color Recommendations

**Backgrounds:**
- Base background: `#121212` (Material recommendation)
- With blue tint: `#0a0f1e` or `#0d1117` (more popular for premium dark UIs)
- Surface level 1: `#1e1e1e`
- Surface level 2: `#222222`
- Surface level 3: `#252525`

**Text on dark backgrounds:**
- Primary text: `rgba(255,255,255,0.87)` — not pure white
- Secondary text: `rgba(255,255,255,0.60)`
- Disabled text: `rgba(255,255,255,0.38)`
- Hint/placeholder: `rgba(255,255,255,0.38)`

**Accent colors for dark themes:**
- Choose lighter tones from your primary palette (e.g., 200 or 300 tone instead of 600)
- Electric blues, indigo, and cyan work especially well against dark backgrounds
- Avoid fully saturated accent colors — use HSL to reduce saturation by 10–20%

---

## Shape System

M3 uses a shape scale to define the roundness of component corners:

| Shape Token | Value | Used For |
|---|---|---|
| Extra Small | 4px | Chips, snackbars |
| Small | 8px | Filled text fields, menus |
| Medium | 12px | Cards, dialogs |
| Large | 16px | Navigation drawers |
| Extra Large | 28px | FABs, extended FABs |
| Full | 50% | Buttons, badges, avatar |

Shape reinforces the personality and tone of a product. Rounder shapes feel friendlier and more playful. Square/low-radius shapes feel more serious and utilitarian. Consistency in shape usage across a product creates visual cohesion.

---

## Spacing & Layout

### The 4dp Baseline Grid

All spacing in M3 is based on multiples of **4dp**:
- 4dp, 8dp, 12dp, 16dp, 20dp, 24dp, 32dp, 40dp, 48dp, 64dp

Use these values for margins, padding, gaps, and component sizing. This creates visual rhythm and makes spacing feel intentional rather than arbitrary.

### Responsive Breakpoints

| Breakpoint | Range | Layout Columns |
|---|---|---|
| Compact | 0–599dp | 4 columns |
| Medium | 600–1199dp | 12 columns |
| Expanded | 1200dp+ | 12 columns |

### Content Margins

- Compact: 16dp margin
- Medium: 24dp margin
- Expanded: 24dp margin (with max-width container)

---

## Component Guidelines

### Buttons

M3 defines 5 button variants:
1. **Filled** — Highest emphasis, primary CTA
2. **Filled Tonal** — Medium-high emphasis, secondary CTA
3. **Outlined** — Medium emphasis, alternative action
4. **Text** — Low emphasis, tertiary/inline actions
5. **Elevated** — Filled with shadow, for use on surfaces

**Button shape:** By default, fully rounded (Stadium shape). Minimum height: 40dp.

### Cards

Cards use the `surface` color role. They exist at elevation level 1 (resting) or level 2 (hovered/dragged). Card corners use the Medium shape (12px).

Three card types:
- **Elevated** — Has a shadow, highest visual hierarchy
- **Filled** — Filled with `surface-variant`, no shadow
- **Outlined** — Has a border (`outline-variant`), no fill or shadow

### Input Fields

- Use `surface-variant` as the fill color for filled text fields
- Input height: minimum 56dp
- Always include a label above the field, not just placeholder text
- Error state: use `error` color role for the border and helper text
- Focused state: border uses `primary` color

### Navigation

- **Navigation Bar** (bottom, mobile): 3–5 destinations, icon + label
- **Navigation Rail** (side, tablet): 3–7 destinations, icons with optional labels
- **Navigation Drawer** (side, desktop): Full labels, can support hierarchy
- Active destinations use `secondary-container` background with `on-secondary-container` icon color
