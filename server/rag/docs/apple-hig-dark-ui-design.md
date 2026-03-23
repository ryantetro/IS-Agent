# Apple Human Interface Guidelines + Professional Dark UI Design
**Sources:**
- Apple Human Interface Guidelines — https://developer.apple.com/design/human-interface-guidelines/
- Toptal Dark UI Design Principles — https://www.toptal.com/designers/ui/dark-ui-design
- Material Design Dark Theme Guide — https://codelabs.developers.google.com/codelabs/design-material-darktheme
**Relevance:** Design principles for clarity, depth, typography, layout, color for professional-grade interfaces — including comprehensive dark theme design guidance.

---

## Part 1: Apple Human Interface Guidelines (HIG)

### Core Design Principles

Apple's HIG is built on three foundational themes:

**1. Clarity**
The interface must be legible, precise, and easy to understand. Text should be readable at any size. Icons must be precise and lucid. Ornamentation is minimized — every element should serve a purpose. If a button doesn't look like a button, it has failed the clarity test.

**2. Deference**
The UI should support the user's content and tasks — not compete with them. The interface recedes into the background. Subtle motion and clear layering help people understand what matters, without extra decoration distracting from the content.

**3. Depth**
Visual layers and realistic motion impart a sense of depth that helps users understand the relationship between interface elements. Hierarchy through depth conveys importance and guides attention.

---

### Color — Apple HIG

**Use system colors when possible**
System colors automatically adapt to changes in accessibility settings, appearance modes (light/dark), and vibrancy effects. They maintain proper contrast ratios across environments without manual adjustment.

**Key principles for color usage:**
- Use color to communicate meaning, not just for decoration
- Don't use color as the only means of conveying information (accessibility)
- Test your colors in both light and dark appearances
- Ensure sufficient contrast for all text and interactive elements
- Avoid colors that clash or vibrate against each other

**Color for dark mode:**
- In dark mode, use lighter tint values of colors to ensure readability
- Avoid fully saturated colors — they "vibrate" against dark surfaces
- Use the semantic color system so your colors automatically adapt
- Background primary: near-black (#1c1c1e in iOS)
- Secondary background: slightly lighter (#2c2c2e)
- Tertiary background: (#3a3a3c)

**Dynamic colors (system semantic colors):**
- **Label** — Primary text color (automatically adapts: near-black in light, near-white in dark)
- **Secondary label** — 60% opacity version of label
- **Tertiary label** — 30% opacity version of label
- **Placeholder text** — Very low-opacity label
- **Separator** — For dividers between grouped content

---

### Typography — Apple HIG

**San Francisco (SF) typeface**
Apple's system font, SF Pro, is optimized for readability across all sizes and devices. It features optical sizing — the letterforms change subtly at different sizes to maintain legibility.

- **SF Pro Display** — Used for text at 20pt and above
- **SF Pro Text** — Used for text at 19pt and below
- **SF Mono** — For code, terminal, monospaced content
- **New York (NY)** — A serif typeface for editorial/reading contexts

**For web/non-Apple platforms:** These fonts aren't licensed for web use. Good analogues:
- SF Pro → DM Sans, Plus Jakarta Sans, Outfit
- New York → Lora, Playfair Display, Fraunces

**Dynamic Type**
Always support adjustable text sizes. Design layouts that work when text is 200% of its normal size. Never clip or truncate critical content because a user chose a larger font size.

**Apple's type size guidelines:**
- Navigation title: 17–18pt (SF Pro Semibold)
- Body: 17pt (SF Pro Regular), line height ~22pt
- Subheadline: 15pt
- Footnote: 13pt
- Caption: 12pt

**Typography rules:**
- Minimum body text size: 17pt for iOS, 11pt minimum absolute
- Avoid light font weights at small sizes — they're hard to read and fail accessibility
- Bold traits convey emphasis; use them purposefully, not everywhere
- Keep line length comfortable — about 60–80 characters for body text
- Left-aligned text is almost always better than center-aligned for body content

---

### Layout — Apple HIG

**Visual Hierarchy Guides the Eye**
Every screen should have a clear primary focus point. Supporting information is organized in descending order of importance. Users should be able to scan and find what they need in under 5 seconds.

**Margin Guidelines (iOS):**
- Minimum: 16pt side margins on iPhone
- Standard: 20pt side margins
- Large: 32pt side margins for spacious layouts

**Safe Areas**
Always respect safe areas — the regions of the screen not covered by system UI (notch, home indicator, navigation bar). Content that matters must never appear behind these system elements.

**Grid and Alignment**
- Use consistent horizontal margins
- Align elements to a baseline grid
- Maintain consistent spacing between groups of content
- Use the same spacing token for related items, different tokens for unrelated items

**Layout Density**
- Compact/information-dense layouts are appropriate for data-heavy contexts (dashboards, tables)
- Spacious layouts are appropriate for focused reading, onboarding, and marketing
- The right density depends on the user's task, not aesthetic preference

---

### Navigation — Apple HIG

**Types of navigation:**
1. **Hierarchical** — Each screen has one clear way forward (Settings, Mail)
2. **Flat** — Multiple content categories, switch between them freely (Music, App Store)
3. **Content-driven** — Navigation is built into the content itself (Games, eBooks)

**Navigation best practices:**
- Always make it clear where the user is in the app
- Provide one way to navigate back — never trap users
- Use standard navigation patterns users already know (back button, tab bar)
- Don't use more than 5 items in a tab bar
- Keep navigation simple — every extra level of hierarchy adds cognitive load

---

### Feedback and Responsiveness

- Every user interaction deserves feedback — visual, audio, or haptic
- Feedback should be immediate (within 1 frame = ~16ms for 60fps)
- For longer operations (network requests, AI generation): show a loading indicator immediately
- Don't make users wait silently — progress indicators and typing animations maintain engagement

---

## Part 2: Professional Dark UI Design Principles

### Why Dark UIs Work

Dark interfaces have specific advantages:
- Reduced luminance reduces eye strain in low-light environments
- OLED screens emit no light for black pixels — true battery savings
- Creates a premium, sophisticated, focused aesthetic
- Colors and content "pop" more dramatically against dark surfaces

### The Dark Surface Foundation

**Never use pure black (#000000) as your background.** Pure black causes:
- Too much contrast with white text (eye strain, visual vibration)
- Loss of perceived depth (shadows become invisible)
- Harsh visual transitions

**Use dark gray instead:**
- `#121212` — Material Design's recommended dark surface
- `#0d1117` — GitHub's dark mode (popular for developer tools)
- `#0a0f1e` — Dark navy, popular for premium/tech UIs
- `#1a1a2e` — Deep blue-black for sophisticated dark themes
- `#111827` — Tailwind gray-900, clean neutral dark

**Slightly blue-tinted dark grays look more premium on digital screens.** The blue tint works with screen phosphors to create a more natural, less harsh appearance.

### Elevation in Dark UIs

In dark themes, create depth through surface lightness, not shadow:

| Elevation Level | Suggested Color |
|---|---|
| Base background | #121212 |
| Surface (cards, inputs) | #1e1e1e or #1a1a27 |
| Elevated surface | #252525 or #222232 |
| Modal/overlay | #2d2d2d or #2a2a3a |
| Highest (tooltips) | #333333 |

**Rule:** Each elevation level should be ~2–4% lighter than the level below it. Don't use more than 4–5 elevation levels — it becomes confusing.

### Glassmorphism in Dark UIs

Glassmorphism creates a premium "frosted glass" effect popular in modern dark interfaces:

```css
/* Classic glassmorphism */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

/* Stronger glass for sidebars/panels */
.glass-panel {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

/* Subtle glass for inputs */
.glass-input {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
}
```

**Glassmorphism tips:**
- It only works when there's something interesting behind the glass (gradient, image, colorful background)
- On solid dark backgrounds, glass adds subtle texture and depth without color distraction
- Don't overuse — limit to 2–3 elements maximum per screen
- Ensure text contrast still meets WCAG requirements on semi-transparent backgrounds

### Color in Dark UIs

**Accent colors:**
- Use lighter, desaturated tones in dark themes
- Electric blue (#6366f1 / #818cf8), cyan (#06b6d4), violet (#a855f7), and teal (#14b8a6) all work excellently on dark backgrounds
- Avoid fully saturated primary colors at full opacity — they vibrate visually
- Gradient accents (blue to purple, blue to cyan) are very popular for premium dark UIs

**Creating an accent gradient:**
```css
/* Premium dark UI gradient examples */
--gradient-primary: linear-gradient(135deg, #6366f1, #8b5cf6);
--gradient-accent: linear-gradient(135deg, #06b6d4, #6366f1);
--gradient-warm: linear-gradient(135deg, #f59e0b, #ef4444);
```

**Text colors on dark backgrounds:**
- Primary text: `#f1f5f9` (slightly off-white, not pure white)
- Secondary text: `#94a3b8`
- Muted text: `#64748b`
- Placeholder: `#475569`

**Semantic colors adapted for dark themes:**
- Success: `#34d399` (emerald-400, not pure green)
- Warning: `#fbbf24` (amber-400)
- Error: `#f87171` (red-400)
- Info: `#60a5fa` (blue-400)

### Animated Gradient Backgrounds

Animated gradient meshes are popular for premium dark UIs. They add life without distraction:

```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animated-background {
  background: linear-gradient(
    -45deg,
    #0a0f1e,
    #0d1b2a,
    #1a0533,
    #0a1628
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
```

**Tips:**
- Keep the animation very slow (12–20 second cycles) — subtle movement, not a rave
- Use very similar dark tones — the effect should be barely perceptible, creating atmosphere
- Slightly different hues (deep blue, deep purple, deep navy) give depth without distraction

### Typography in Dark UIs

- Use slightly lighter font weights in dark UIs — thin weights disappear against dark backgrounds
- Prefer Regular/Medium (400–500) for body; SemiBold/Bold (600–700) for headings
- Don't use pure white text — use `#f1f5f9` or `rgba(255,255,255,0.87)`
- Line height should be slightly more generous in dark UIs for readability: 1.6–1.7x for body
- Monospace fonts for code: JetBrains Mono, Fira Code, DM Mono

### Common Dark UI Mistakes

1. **Pure black backgrounds** — Use dark gray instead (#121212 or similar)
2. **Pure white text** — Use off-white (#f1f5f9 or rgba(255,255,255,0.87))
3. **Fully saturated accent colors** — Desaturate by 15–20% for dark themes
4. **No elevation differentiation** — Cards and backgrounds look identical
5. **Shadows on dark backgrounds** — Use lighter surfaces for elevation, not shadows
6. **Thin font weights** — They become invisible on dark backgrounds
7. **Too much glass** — Glassmorphism loses impact when overused
8. **Ignoring contrast ratios** — Just because it looks "dark and moody" doesn't mean it passes WCAG 4.5:1

### Premium Dark UI Examples (Aesthetic References)

Products known for excellent dark UI design:
- **Linear** — Clean, minimal, fast. Deep gray surfaces, electric violet accent
- **Vercel** — Developer-focused, near-black background, clean typography
- **Raycast** — Blur-heavy glassmorphism, keyboard-first, purple accents
- **GitHub Dark** — Practical, highly readable, excellent information density
- **Figma Dark** — Professional tool aesthetic, excellent elevation system
- **Notion Dark** — Content-first, generous white space, minimal chrome
