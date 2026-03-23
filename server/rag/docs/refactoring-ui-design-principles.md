# Refactoring UI — Visual Design Principles for Developers
**Source:** Refactoring UI by Adam Wathan & Steve Schoger — https://refactoringui.com
**Relevance:** Practical, developer-focused design tactics covering visual hierarchy, color systems, typography, spacing, depth, and how to make UIs look professional without a designer.

---

## Overview

Refactoring UI teaches developers to design beautiful user interfaces using concrete, actionable tactics. The core premise: effective UI design doesn't require artistic talent — it requires understanding a set of learnable principles and systems. The book covers hierarchy, color, typography, spacing, depth, and component design from a developer's perspective.

---

## Starting Right: Design Process

### Start With a Feature, Not a Layout
Don't begin by designing the navigation, sidebar, or layout skeleton. Start with a specific feature and build outward from there. Example: designing a flight search — begin with the search form, not the page wrapper.

### Design in Grayscale First
By removing color early, you're forced to use spacing, contrast, and size to create hierarchy. This produces a stronger foundation. Add color at the end to support the hierarchy you've already established, not to create it.

### Avoid Over-Designing
Don't design every edge case and every possible state before building. Design what you need now, expect it to evolve, and iterate. Avoid decision paralysis over things that don't matter yet.

### Define a Design Personality Upfront

Before designing, decide on a personality. This is determined by a few concrete factors:

**Font choice:**
- Serif typefaces → elegant, classic, editorial
- Rounded sans-serifs → friendly, playful, approachable
- Neutral sans-serifs → clean, plain, lets other elements carry the personality

**Color psychology:**
- Blues/teals → trustworthy, calm, professional (used by banks, tech companies)
- Greens → growth, health, nature
- Oranges/yellows → energetic, creative, attention-grabbing
- Purples → creative, luxurious
- Dark backgrounds → sophisticated, premium, focused

**Border radius:**
- Small or zero radius → serious, formal
- Medium radius → neutral, modern
- Large/fully rounded → friendly, playful

---

## Visual Hierarchy

### Hierarchy is the Most Important Design Skill

Every interface has multiple elements competing for attention. Good design creates a clear order of importance so users can scan quickly and find what they need.

**The three levels of hierarchy:**
1. **Primary** — What the user must notice first (CTA, key data, main action)
2. **Secondary** — Supporting information (labels, metadata, secondary actions)
3. **Tertiary** — Context and background (timestamps, disabled states, helper text)

### Don't Use Font Size Alone for Hierarchy

Relying solely on font size is a beginner mistake. Use all available tools:
- **Font weight** — Bold = more important; Regular = supporting content
- **Color** — High contrast = primary; Low contrast (muted) = secondary
- **Opacity** — Reduce opacity for less important text rather than using a lighter font
- **Size** — Reserve large sizes for truly important content

### De-Emphasize Rather Than Emphasize

Instead of making everything louder, try making supporting content quieter. If you want a headline to stand out, try reducing the contrast of the body text below it rather than making the headline bigger.

### Semantic HTML vs. Visual Hierarchy

HTML heading levels (h1, h2, h3) exist for semantics and SEO — not for visual design. A card title might semantically be an h3 but visually need to look like body text. Separate semantic importance from visual presentation.

---

## Color

### Build a Proper Color System

A good UI color palette needs more than just a few brand colors. You need:

**Grays (8–10 shades):**
- True neutral gray (for backgrounds and chrome)
- Warm gray (pairs well with earthy/analog aesthetics)
- Cool gray (pairs well with blue-tinted or techy aesthetics)
- Build a scale from near-white to near-black

**Primary color (5–10 shades):**
- Build a tonal scale (100–900) with your brand color in the middle (400–600)
- Lightest shades used for subtle backgrounds, tinted surface colors
- Darkest shades used for text on light backgrounds

**Accent / semantic colors (5–10 shades each):**
- Success (green)
- Warning (yellow/orange)
- Danger/Error (red)
- Info (blue)

### Use HSL, Not Hex

HSL (Hue, Saturation, Lightness) is far more intuitive than hex or RGB for UI work.
- **Hue:** 0–360° (red=0, green=120, blue=240)
- **Saturation:** 0–100% (0% = gray, 100% = vivid)
- **Lightness:** 0–100% (0% = black, 100% = white)

HSL makes it easy to create tonal variations: to lighten a color, increase L. To desaturate, decrease S. To create a dark variant, decrease L and slightly increase S.

### Building a Tonal Scale

1. Start with your base brand color (the one you'd use on a button)
2. Define the darkest shade — usually used for dark text on a light background
3. Define the lightest shade — used for subtle background tints
4. Fill in the middle with evenly spaced lightness values
5. **Tweak by eye, not just math** — trust your eyes over the numbers

### Saturation Drops at Extreme Lightness

In HSL, as a color approaches 0% or 100% lightness, saturation loses impact. The color looks washed out or faded. To compensate: increase saturation as you approach the extremes (lightest and darkest tones).

**Rule of thumb:** At L=90% (very light), bump S up by 10–20% to keep the hue visible. At L=15% (very dark), bump S up by 10–15%.

### Color on Colored Backgrounds

When text sits on a colored (non-gray) background:
- Don't use gray text — it looks dull and washed out
- Instead, use a color with the same hue as the background but adjust saturation and lightness
- Example: White button on a blue (#1d4ed8) background → secondary text should be a lighter blue (#93c5fd), not gray

### Contrast Rules

- Normal text: 4.5:1 contrast ratio minimum (WCAG AA)
- Large text (18pt+ or 14pt bold): 3:1 minimum
- Colored text on colored backgrounds: Test with a contrast checker — you'll often be surprised how dark the background needs to be for white text to pass

**Practical tip:** When using white text on a colored button/background, the color usually needs to be at L ≤ 45% to meet 4.5:1 contrast with white text.

### Don't Lean on Color Alone

Color should support hierarchy, not create it. Design in grayscale first — if the hierarchy doesn't work without color, fix it before adding color. Color-blind users and high-contrast mode users need your design to work without color differentiation.

---

## Typography

### Establish a Type Scale

Pick 5–8 font sizes and stick to them. Don't use arbitrary sizes like 13px, 17px, 23px. A scale based on a modular ratio or hand-picked values creates visual consistency.

**Suggested scale:** 12, 14, 16, 18, 20, 24, 30, 36, 48, 60px

Keep the scale "spread out" — no two sizes should be closer than ~25% apart, otherwise the difference isn't noticeable enough to create meaningful hierarchy.

### Font Weight and Color Over Size

For secondary/supporting text, don't make it tiny — make it a slightly lighter weight or reduced contrast (opacity/color). Small text is harder to read; lower-contrast text is easy to read but clearly secondary.

**The three levers for text hierarchy:**
1. Size (use sparingly)
2. Weight (Regular → Medium → SemiBold → Bold)
3. Color/opacity (primary → secondary → tertiary)

### High-Quality Fonts Matter

Safe default sans-serifs for UI: DM Sans, Plus Jakarta Sans, Inter, Outfit, Figtree. These are clean and professional without being boring.

For premium/distinctive UIs: Clash Display, Cabinet Grotesk, Satoshi, Neue Haas Grotesk, Sora.

**Never use:** Arial, Times New Roman, or Comic Sans for professional UI work.

### Don't Customize Letter-Spacing Unless You Know Why

As a general rule, trust the typeface designer's letter-spacing (tracking) defaults. The main exception:
- **All-caps labels/buttons:** Slightly increased letter-spacing (0.05–0.1em) improves readability
- **Display/hero text:** Very slightly negative letter-spacing (−0.01em to −0.03em) improves visual tightness

### Line Height Rules

- Body text: 1.5–1.6 line height
- Headings and display text: 1.1–1.3 line height (tighter)
- Captions and small text: 1.4–1.5 line height
- One-liners (buttons, labels): 1.0–1.2 (no extra space needed)

---

## Spacing & Layout

### Start With Too Much Space, Then Remove

Beginners add white space when designs feel too cramped. Experts start with generous spacing and remove it until the design feels right. More white space almost always looks better than less.

### The 4px Base Unit

Use multiples of 4px for all spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. This creates visual rhythm and makes spacing feel intentional.

### Spacing Creates Relationships (Proximity)

Elements that are close together appear related. Elements that are far apart appear unrelated. Use spacing to group related items and separate unrelated ones. Always more space between groups than within them.

### Avoid Ambiguous Spacing

Never place two elements equidistant from a third element if they have different relationships to it. The spacing must make the hierarchy and relationships obvious without needing other cues.

### You Don't Need to Fill the Screen

Giving elements only the space they need is better than stretching them to fill available space. A max-width container centered on the page is almost always better than a design that stretches to fill a 1920px monitor.

---

## Depth & Visual Interest

### Create Depth With Layers

Multiple layers of elements at different elevations create a sense of depth that makes UIs feel more real and engaging. Tools for depth:
- **Box shadows** — soft, large-radius shadows suggest distance from the surface
- **Border colors** — subtle borders (1px, low opacity) separate elements from their background
- **Overlap** — elements that overlap suggest different z-levels
- **Background variation** — slightly different background tones for different surface levels

### Box Shadows

A well-designed shadow has three components:
1. **Vertical offset** (y) — slightly positive suggests light from above
2. **Blur radius** — larger blur = more diffuse = element is higher off the surface
3. **Opacity** — lower opacity = softer, more natural

**A 3-level shadow system:**
- Small (1px y, 2px blur, 10% black) — cards, inputs at rest
- Medium (4px y, 6px blur, 7% black) — dropdowns, popovers, hoverd cards
- Large (10px y, 15px blur, 10% black) — modals, drawers, floating panels

### Don't Overdo Shadows

One well-placed, soft shadow is better than shadows on every element. Flat elements (text, icons, buttons) should rarely have shadows — reserve them for floating containers.

### Glassmorphism

A popular depth effect for premium/dark UIs:
- Background blur: `backdrop-filter: blur(12px)` (or 16–24px for more dramatic effect)
- Translucent background: `background: rgba(255, 255, 255, 0.05)` (or 0.08–0.12)
- Subtle border: `border: 1px solid rgba(255, 255, 255, 0.1)`
- Works best against colorful or gradient backgrounds
- Requires a real background behind the element (not a solid color)

---

## Component Design Patterns

### Buttons

**Hierarchy through styling:**
- Primary CTA → filled, high contrast, fully rounded
- Secondary action → outlined or filled tonal, same size
- Tertiary action → text button (link-style), smaller
- Destructive action → doesn't need to be red unless it's the primary action on screen

**Don't make every button the same size and weight** — this destroys hierarchy.

### Form Inputs

- Input height: 40–44px is comfortable
- Placeholder text is NOT a label — always include a visible label above
- Error states: red border + red helper text + error icon (never color alone)
- Focused state: highlight the border with the primary color
- Rounded corners: 6–8px for a modern, approachable feel; 4px or less for utilitarian/enterprise

### Cards

- Use subtle box shadows (not colored borders) for separation in light themes
- In dark themes: use a slightly lighter background color than the page surface
- Padding: 16–24px is the sweet spot
- Avoid cards-within-cards — it creates visual noise

### Empty States

- Always have an empty state for any list, feed, or search result area
- Include an icon, a headline, a body sentence, and a CTA button
- The empty state is an opportunity to guide the user toward their first action

### Data Tables

- Zebra striping (alternating row colors) helps with horizontal scanning
- Right-align numbers
- Left-align text
- Center-align icons/status indicators
- Use muted colors for borders — they should organize without dominating
- Sticky headers help when tables scroll
