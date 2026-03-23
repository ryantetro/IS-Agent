# Web Content Accessibility Guidelines (WCAG) 2.1
**Source:** W3C Recommendation — https://www.w3.org/TR/WCAG21/
**Relevance:** Accessibility standards for contrast, color, typography, interaction, and keyboard navigation in UI design.

---

## Overview

WCAG 2.1 covers a wide range of recommendations for making web content more accessible to people with disabilities, including blindness and low vision, deafness, limited movement, cognitive limitations, and more. These guidelines apply to all web content on any device.

WCAG 2.1 is organized around four core principles — known as **POUR**:

1. **Perceivable** — Information must be presentable in ways users can perceive
2. **Operable** — UI components must be operable by all users
3. **Understandable** — Information and UI operation must be understandable
4. **Robust** — Content must be robust enough to be interpreted by assistive technologies

---

## Conformance Levels

- **Level A** — Minimum accessibility
- **Level AA** — Addresses the most common and impactful accessibility issues (widely required by law)
- **Level AAA** — Highest level; not required for entire sites

---

## 1. Perceivable

### 1.1 Text Alternatives
- **1.1.1 Non-text Content (Level A):** All non-text content (images, icons, charts) must have a text alternative that serves the same purpose. Decorative images should have empty alt attributes (alt="").

### 1.3 Adaptable
- **1.3.1 Info and Relationships (Level A):** Information, structure, and relationships conveyed through presentation must be programmatically determined. Use semantic HTML — headings, lists, labels, landmarks.
- **1.3.4 Orientation (Level AA):** Content must not restrict view to a single display orientation unless essential.
- **1.3.5 Identify Input Purpose (Level AA):** The purpose of each input field must be programmatically determinable (use autocomplete attributes).

### 1.4 Distinguishable
- **1.4.1 Use of Color (Level A):** Color must not be the only visual means of conveying information. Always pair color indicators with text, icons, or patterns.
- **1.4.3 Contrast Minimum (Level AA):** Text must have a contrast ratio of at least **4.5:1** against its background. Large text (18pt or 14pt bold) requires at least **3:1**.
- **1.4.4 Resize Text (Level AA):** Text must be resizable up to 200% without loss of content or functionality.
- **1.4.6 Contrast Enhanced (Level AAA):** Text contrast ratio of at least **7:1**; large text at least **4.5:1**.
- **1.4.10 Reflow (Level AA):** Content must reflow without horizontal scrolling at 320px width (equivalent to 400% zoom on 1280px screen). No loss of content or functionality.
- **1.4.11 Non-text Contrast (Level AA):** UI components (buttons, form inputs, focus indicators) and informational graphics must have a contrast ratio of at least **3:1** against adjacent colors.
- **1.4.12 Text Spacing (Level AA):** No loss of content when users set: line height to 1.5x font size, letter spacing to 0.12x font size, word spacing to 0.16x font size.
- **1.4.13 Content on Hover or Focus (Level AA):** Content triggered by hover or keyboard focus must be dismissible, hoverable, and persistent.

---

## 2. Operable

### 2.1 Keyboard Accessible
- **2.1.1 Keyboard (Level A):** All functionality must be operable via keyboard alone, without requiring specific timing. No keyboard traps.
- **2.1.2 No Keyboard Trap (Level A):** Keyboard focus must not become trapped in a component. Users can always navigate away using standard keys.
- **2.1.4 Character Key Shortcuts (Level AA):** If keyboard shortcuts use single characters, users must be able to turn them off, remap them, or they must only activate on focus.

### 2.4 Navigable
- **2.4.3 Focus Order (Level A):** Focusable components must receive focus in an order that preserves meaning and operability.
- **2.4.4 Link Purpose (Level A):** The purpose of each link must be determinable from the link text alone, or from context.
- **2.4.7 Focus Visible (Level AA):** Any keyboard-operable UI must have a visible keyboard focus indicator. Never remove `outline` without providing a custom alternative.
- **2.4.11 Focus Appearance (Level AA, WCAG 2.2):** Focus indicators must have at least 3:1 contrast ratio, and a minimum area of 2px perimeter offset.

### 2.5 Input Modalities
- **2.5.3 Label in Name (Level A):** For components with visible labels, the accessible name must contain the visible label text.
- **2.5.5 Target Size (Level AA, WCAG 2.2):** Interactive targets should be at least **24x24 CSS pixels**. Best practice is 44x44px minimum.

---

## 3. Understandable

### 3.1 Readable
- **3.1.1 Language of Page (Level A):** The default human language of the page must be programmatically determined (`lang` attribute on `<html>`).

### 3.2 Predictable
- **3.2.1 On Focus (Level A):** Components must not automatically trigger a context change on focus.
- **3.2.2 On Input (Level A):** Changing the value of a UI component must not automatically trigger a context change unless the user is warned in advance.
- **3.2.3 Consistent Navigation (Level AA):** Navigation patterns must be consistent across pages.
- **3.2.4 Consistent Identification (Level AA):** Components with the same functionality must be identified consistently.

### 3.3 Input Assistance
- **3.3.1 Error Identification (Level A):** If an error is detected, the item in error is identified and described in text.
- **3.3.2 Labels or Instructions (Level A):** Provide labels or instructions for all user input.
- **3.3.3 Error Suggestion (Level AA):** When errors are detected, provide specific suggestions for correction when possible.
- **3.3.4 Error Prevention (Level AA):** For legal, financial, or data submissions: submissions are reversible, data is checked with opportunity to correct, or confirmation is required.

---

## 4. Robust

### 4.1 Compatible
- **4.1.2 Name, Role, Value (Level A):** For all UI components, the name, role, and value must be programmatically determinable. Use ARIA correctly. Custom components need ARIA roles and states.
- **4.1.3 Status Messages (Level AA):** Status messages (e.g., "Form submitted", "3 results found") must be programmatically determined so assistive technologies can announce them without focus being moved.

---

## Key Design Numbers at a Glance

| Requirement | Standard (AA) | Enhanced (AAA) |
|---|---|---|
| Normal text contrast | 4.5:1 | 7:1 |
| Large text contrast (18pt or 14pt bold) | 3:1 | 4.5:1 |
| UI component / graphic contrast | 3:1 | — |
| Minimum touch target | 24×24px (AA) | 44×44px (best practice) |
| Focus indicator contrast | 3:1 | — |
| Text resize support | 200% | — |
| Reflow breakpoint | 320px width | — |

---

## Practical Design Tips from WCAG

**Color & Contrast:**
- Never rely on color alone to communicate meaning — always add a text label, icon, or pattern
- Test contrast ratios with tools like WebAIM Contrast Checker or browser DevTools
- Dark backgrounds with white text: white text (#FFFFFF) against dark backgrounds should still meet 4.5:1; pure black on white is ~21:1
- For dark themes: if your background is #121212, white text gives ~18.1:1 — excellent. But watch out for mid-gray surfaces at high elevation

**Typography:**
- Minimum body text: 16px (1rem) is a widely recommended baseline
- Line height: At least 1.5x the font size for body text (WCAG 1.4.12)
- Letter spacing: Users must be able to set to 0.12em without content loss
- Avoid justified text — it creates irregular word spacing that impairs readability

**Focus & Interaction:**
- Never set `outline: none` without a custom focus style
- Custom focus styles should contrast at 3:1 against both the focused element and adjacent background
- Interactive elements must be reachable and operable by keyboard

**Forms & Errors:**
- Every input must have a visible, persistent label (not just placeholder text)
- Placeholder text disappears on input — never use it as the only label
- Error messages must identify the specific field and describe how to fix it
- Success messages must be announced to screen readers via `aria-live` regions

**ARIA Usage:**
- Use native HTML elements before ARIA (`<button>` over `<div role="button">`)
- Every `<img>` that conveys meaning needs a descriptive `alt` attribute
- Decorative images: `alt=""`
- Custom components (dropdowns, modals, accordions) require appropriate ARIA roles, states, and properties

---

## Common WCAG Failures to Avoid

1. Low contrast text (gray on white, white on light blue)
2. Missing alt text on meaningful images
3. Icons with no text label or accessible name
4. Form inputs with placeholder-only labels
5. Custom interactive elements with no keyboard support
6. Modals that trap focus or don't announce to screen readers
7. Error messages that only use color (red border) without text
8. Removing browser focus outlines without replacement
9. Content that disappears on zoom or text resize
10. Relying on mouse-only interactions (hover menus, drag-only)
