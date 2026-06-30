# Design System Documentation

This document serves as the single source of truth for the project's visual and UI architecture.

## 1. Typography
We have established a unified, structured aesthetic across the portfolio.

- **Primary Font**: `Stack Sans Headline` (Google Fonts) — used for all body text, headings, buttons, labels, and structured cards. This is the font applied globally via `theme.ts` and CSS variables.
- **Secondary Font**: `Cormorant Garamond` (Google Fonts) — used for editorial accents, pull quotes, and italic display moments.
- **Weights Used**:
  - `300`, `400`, `500`, `600`, `700`
- **Fallback Stack**: `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`
- **Implementation**: Set globally via `FONTS.primary` in `src/theme.ts` and loaded non-blocking in `index.html`.

### Type Scale (portfolio-wide)
| Role | Font | Size | Weight | Line Height |
|---|---|---|---|---|
| Page title / Hero | Stack Sans Headline | 3rem–4rem | 700 | 1.1 |
| Section heading (h2) | Stack Sans Headline | 2.25rem–2.5rem | 700 | 1.15 |
| Sub-heading (h3) | Stack Sans Headline | 1.75rem–2rem | 700 | 1.2 |
| Card title | Stack Sans Headline | 1.5rem–1.75rem | 700 | 1.2 |
| Body / paragraphs | Stack Sans Headline | 1rem–1.05rem | 400 | 1.7–1.75 |
| Labels / tags / meta | Stack Sans Headline | 0.8rem–0.9rem | 600–700 | 1.4 |
| Buttons | Stack Sans Headline | 0.85rem–0.95rem | 600–700 | 1 |
| Captions / footnotes | Stack Sans Headline | 0.75rem–0.85rem | 400 | 1.5 |

> [!TIP]
> Stack Sans Headline is a condensed display font. When mixing it with Cormorant Garamond in the same block, bump the Stack size by 2–4px so both fonts feel optically equal.

> [!TIP]
> Body text in Stack Sans Headline reads best at `lineHeight: 1.7–1.75` with `fontSize: 1rem–1.05rem`. Never go below `0.95rem` for paragraph text — it becomes uncomfortable to read on dark backgrounds.

---

## 2. Color System

### Base Palette
| Token | Value | Usage |
|---|---|---|
| Background | `#0a0a0a` / `rgba(0,0,0,0.85)` | Page base, panel backgrounds |
| Surface / Card | `rgba(20–40, 20–40, 25–45, 0.75–0.95)` | Scroll stack cards, modals |
| Border | `rgba(255,255,255,0.08–0.12)` | Card edges, dividers |
| Text primary | `#ffffff` / `rgba(255,255,255,0.9)` | Headings, main copy |
| Text secondary | `rgba(255,255,255,0.65)` | Subheadings, descriptors |
| Text muted | `rgba(255,255,255,0.4–0.45)` | Captions, meta, timestamps |
| Accent blue | `#3b82f6` | Primary CTA buttons, active states |
| Accent blue light | `#60a5fa` | Labels, icon accents, highlights |
| Accent green | `#10b981` | Success, strategy, secondary accent |
| Accent green light | `#34d399` | Green label text |
| Accent purple | `#8b5cf6` | Alternate accent, iris/radix |
| Accent amber | `#f59e0b` | Warnings, third accent |
| Cutting mat | `#137A55` | CuttingMatBackground base |

### Dark Panel Style (case study, modals)
```css
background: rgba(26, 26, 26, 0.85);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
border-radius: 32px;
```

### Card Style (scroll stack)
```css
background: rgba(20–40, 20–40, 25–45, 0.75–0.95);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.12);
border-radius: 24px;
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
```

---

## 3. Buttons

### Primary Button (CTA)
```css
background: #3b82f6;
color: #ffffff;
border: none;
border-radius: 8px;
padding: 10px 20px;
font-family: 'Stack Sans Headline', sans-serif;
font-size: 0.9rem;
font-weight: 700;
cursor: pointer;
transition: transform 0.2s, background 0.2s;
```
Hover: `background: #2563eb; transform: scale(1.05)`

### Secondary / Ghost Button
```css
background: rgba(0, 0, 0, 0.3);
color: #ffffff;
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 8px;
padding: 8px 16px;
font-family: 'Stack Sans Headline', sans-serif;
font-weight: 700;
backdrop-filter: blur(10px);
```

### Button Spacing Rules
- Minimum tap target: **44px height** (accessibility)
- Inline button gap from adjacent elements: **8–12px**
- Button group gap: **8px**
- Button within a card: `align-self: flex-start`, never full-width unless it is the sole CTA
- Never place two primary buttons side-by-side — demote one to secondary/ghost

---

## 4. Spacing System

Use multiples of **8px** as the base spacing unit throughout.

| Token | Value | Usage |
|---|---|---|
| xs | 4px | Icon gap, tight inline spacing |
| sm | 8px | Inline gaps, button padding |
| md | 16px | Section inner gaps, list items |
| lg | 24px | Card inner padding (top/bottom) |
| xl | 32px | Section separators |
| 2xl | 48px | Panel padding |
| 3xl | 64–80px | Major section gaps |
| page | 4rem (64px) | Outer page padding |

### Case Study Panel Spacing
- `marginTop`: `120px` — gap between last stack card and panel
- `marginBottom`: `40px` — gap between panel and footer
- `padding`: `48px` — inner content breathing room
- Section gaps inside panel: `32px`
- Paragraph bottom margin: `16px`

### Readability Rules
- Max content width for prose: **720–800px** — never wider for comfortable reading
- Line length: aim for **60–75 characters** per line for body text
- Never let paragraphs touch card edges — always maintain at least `24px` inner padding

---

## 5. UI Framework (Radix UI Themes)
We have installed `@radix-ui/themes` as our core design system. Radix provides highly polished, accessible, and unopinionated components that fit seamlessly into a premium layout.

### Global Theme Configuration
The application is wrapped in `<Theme>` inside `src/main.tsx` with the following configuration:
- `appearance="light"`: Light mode theme to match the portfolio's mixed-background aesthetic (dark canvas home, light case study panels).
- `accentColor="iris"`: A sleek purple-blue accent for active states, buttons, and highlights.
- `panelBackground="solid"`: Ensures floating elements like cards or dialogs have a solid, opaque background.
- `radius="large"`: Applies large, friendly border-radiuses to components, pairing well with the modern editorial nature of Stack Sans Headline.

### Component Usage
When building new UI, prefer importing primitives directly from `@radix-ui/themes` rather than writing custom HTML elements.
```tsx
import { Button, Card, Text, Flex } from '@radix-ui/themes';

// Example:
<Card size="2">
  <Flex direction="column" gap="3">
    <Text as="div" size="4" weight="bold">Title</Text>
    <Button>Click Me</Button>
  </Flex>
</Card>
```

---

## 6. Custom Interactions
While Radix UI handles the structural UI, we continue to rely on **Framer Motion** for highly dynamic, physics-based interactions:
- `react-moveable` is used in our custom Edit Mode for direct DOM manipulation.
- Spring animations should generally use `{ type: "spring", stiffness: 150, damping: 20 }` for a snappy, responsive feel.

### Animation Principles
- **Entry animations**: fade + slide up `{ opacity: 0→1, y: 30→0 }`, duration `0.35s`, ease `[0.22, 1, 0.36, 1]`
- **Exit animations**: reverse entry — `{ opacity: 1→0, y: 0→30 }`
- **Hover micro-interactions**: `transform: scale(1.03–1.05)` on interactive cards and buttons, `transition: 0.2s`
- **Scroll-triggered**: use GSAP ScrollTrigger with `elastic.out(1, 0.8)` for gallery card entries
- Never animate `height: 0 → auto` with Framer Motion — use opacity + translateY instead to avoid overflow clipping

---

## 7. Icons
Use `react-icons/fi` (Feather Icons) for all UI icons throughout the portfolio.
- Icon size in body copy / labels: `16px`
- Icon size in cards / section headers: `20–24px`
- Icon size in hero / display areas: `28–32px`
- Always pair icons with text labels for accessibility — never icon-only unless space is critically constrained
- Icon color should match surrounding text color or use the accent color for emphasis

---

## 8. Elevation & Depth
Maintain a consistent elevation hierarchy via `box-shadow` and `backdrop-filter`:

| Level | Usage | Shadow |
|---|---|---|
| 0 — Flat | Body text, inline elements | none |
| 1 — Subtle | Tags, chips, minor cards | `0 2px 8px rgba(0,0,0,0.2)` |
| 2 — Card | Scroll stack cards, feature blocks | `0 10px 40px rgba(0,0,0,0.3)` |
| 3 — Float | Case study panel, modals | `0 20px 50px rgba(0,0,0,0.5)` |
| 4 — Overlay | Drawers, full-screen panels | `0 30px 80px rgba(0,0,0,0.7)` |

Always pair elevated surfaces with `backdrop-filter: blur(12–20px)` for depth coherence on the dark cutting mat background.
