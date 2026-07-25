# Design System Documentation

This document serves as the single source of truth for the project's visual and UI architecture.

## 1. Typography
We have established a unified, structured aesthetic across the portfolio.

> [!NOTE]
> A Switzer/Geist Mono migration (inspired by [gauravi.design](https://gauravi.design/)) was tried on 2026-07-25 and reverted the same day — **Stack Sans remains the site's font system.** If this direction comes back, treat it as a fresh decision rather than resuming from here.

- **Primary Font**: `Stack Sans` (Google Fonts) — used for body text, buttons, labels, and structured cards. Applied globally via `FONTS.primary` in `theme.ts`.
- **Display Font**: `Stack Sans Headline` (Google Fonts) — used for headings and display moments. Applied via `FONTS.display` in `theme.ts`.
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
| Body / paragraphs | Stack Sans | 1rem–1.05rem | 400 | 1.7–1.75 |
| Labels / tags / meta | Stack Sans | 0.8rem–0.9rem | 600–700 | 1.4 |
| Buttons | Stack Sans | 0.85rem–0.95rem | 600–700 | 1 |
| Captions / footnotes | Stack Sans | 0.75rem–0.85rem | 400 | 1.5 |

> [!TIP]
> Stack Sans Headline is a condensed display font. When mixing it with Cormorant Garamond in the same block, bump the Stack size by 2–4px so both fonts feel optically equal.

> [!TIP]
> Body text in Stack Sans Headline reads best at `lineHeight: 1.7–1.75` with `fontSize: 1rem–1.05rem`. Never go below `0.95rem` for paragraph text — it becomes uncomfortable to read on dark backgrounds.

### Type Scale — Bento Case Study Panel (KynhoodBentoCards.tsx)
The Kynhood bento card flip-front + slide-in case study panel runs a denser, panel-scoped variant of the scale above (smaller card surface, lots of stacked sections):

| Role | Size | Weight | Line Height | Color |
|---|---|---|---|---|
| Flip-card title | 0.95rem–1rem | 700 | 1.2–1.3 | `#0f172a` |
| Flip-card subtitle | 0.76rem–0.78rem | 400 | 1.4 | `#94a3b8` / `#64748b` |
| Panel eyebrow (accent label) | 0.95rem | 700 | 1 | `card.accent` |
| Panel title (h2) | 1.4rem | 800 | 1.2 | `#0f172a` |
| Section heading (h3) | 1rem | 700 | 1.2 | `card.accent` |
| Body paragraphs | 1.05rem | 400 | 1.75 | `#1e293b` |
| List items | 0.92rem–1rem | 400 | 1.55–1.65 | `#334155` |
| Meta label / value (Role, Timeline, Platforms) | 0.95rem–1rem | 500–700 | 1.3 | `#94a3b8` (label) / `#0f172a` (value) |
| Pull-quote | 1.2rem | 700 (italic) | 1.5 | `#0f172a` |
| Tech chip label | 0.8rem | 500 | 1.3 | `#334155` |
| Media placeholder caption | 0.85rem | 400 | 1.55 | `#64748b` |
| Read full case study CTA | 0.9rem | 600 | 1 | `#0f172a` |

> [!NOTE]
> This panel intentionally runs smaller than the portfolio-wide scale (e.g. panel title `1.4rem` vs. the general sub-heading range of `1.75–2rem`) because it's a compact card-flip surface, not a full page section — keep it consistent with itself rather than forcing the page-wide scale.

---

## 2. Color System

> [!NOTE]
> **Migration in progress**, palette direction adopted from [gauravi.design](https://gauravi.design/). The **New Canonical Palette** below is the target system for new components. The **Legacy Palette** underneath remains live and correct on already-built components — don't mix old and new tokens within the same component during migration.

### New Canonical Palette
| Token | Value | Usage |
|---|---|---|
| Ink (primary text) | `#22271e` | Headings, primary copy on light surfaces |
| Soft (secondary text) | `#4a4a40` | Subheadings, descriptors |
| Faint (tertiary text) | `#8b95a3` | Captions, meta, timestamps (cool-toned) |
| Accent (navy) | `#16202b` | CTAs, structural elements, flat near-black |
| Accent deep | `#0f1822` | Pressed / active states |
| Accent soft | `#e7ecf3` | Light navy tint fills, chips |
| On-accent | `#ffffff` | Text on navy fills |
| Green / emphasis accent | `#0083E7` | Italic emphasis, links, secondary accent |
| Page background | `#ffffff` | Base page background |
| Surface | `#f5f5f5` | Raised cards, secondary surface |
| Line / border | `rgba(20,32,52,.12)` | Hairlines, dividers |
| Hairline (raised surfaces) | `rgba(20,32,52,.06)` | Elevation-from-light on already-raised surfaces — subtler than Line |

### Legacy Palette (still live in production)

#### Base Palette
| Token | Value | Usage |
|---|---|---|
| Background | `#0a0a0a` / `rgba(0,0,0,0.85)` | Page base, panel backgrounds |
| Surface / Card | `rgba(20–40, 20–40, 25–45, 0.75–0.95)` | Scroll stack cards, modals |
| Border | `rgba(255,255,255,0.08–0.12)` | Card edges, dividers |
| Text primary | `#ffffff` / `rgba(255,255,255,0.9)` | Headings, main copy |
| Text secondary | `rgba(255,255,255,0.65)` | Subheadings, descriptors |
| Text muted | `rgba(255,255,255,0.4–0.45)` | Captions, meta, timestamps |
| Accent blue | `#0ea5e9` | Primary CTA buttons, active states (`COLORS.accent` in `theme.ts`) |
| Accent blue light | `#60a5fa` | Labels, icon accents, highlights |
| Accent green | `#10b981` | Success, strategy, secondary accent |
| Accent green light | `#34d399` | Green label text |
| Accent purple | `#8b5cf6` | Alternate accent, iris/radix |
| Accent amber | `#f59e0b` | Warnings, third accent |
| Cutting mat | `#137A55` | CuttingMatBackground base |

#### Light Panel Palette (Case Studies & Content Viewers)
| Token | Value | Usage |
|---|---|---|
| Background | `#ffffff` | Panel background |
| Text primary | `#0f172a` | Headers and titles |
| Text secondary | `#1e293b` (Updated) | Paragraphs and body content (darker for high readability) |
| Text muted | `#64748b` (Updated) | Captions, labels, and timestamps (darker for accessibility) |
| Text tertiary | `#334155` | List items, tech chip labels — sits between text secondary and muted, used in dense card/list content |
| Border | `#e2e8f0` | Dividers and separators |

#### Dark Panel Style (case study, modals)
```css
background: rgba(26, 26, 26, 0.85);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
border-radius: 32px;
```

#### Card Style (scroll stack)
```css
background: rgba(20–40, 20–40, 25–45, 0.75–0.95);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.12);
border-radius: 24px;
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
```

See **Section 8 → Card Recipes** for the new canonical glassmorphic card patterns.

---

## 3. Buttons

> [!NOTE]
> **Migration in progress** — new buttons should follow the tokens below (navy accent, radius ladder, Switzer/Geist Mono). Existing buttons using the legacy blue (`#3b82f6`) remain valid until migrated.

### Primary Button (CTA)
```css
background: #16202b;         /* accent (navy) */
color: #ffffff;               /* on-accent */
border: none;
border-radius: 10px;          /* r-1 */
padding: 10px 20px;
font-family: 'Switzer', sans-serif;
font-size: 0.9rem;
font-weight: 700;
cursor: pointer;
transition: transform 0.18s cubic-bezier(.22,1,.36,1), background 0.18s;
```
Hover: `background: #0f1822; transform: scale(1.03)` /* accent-deep */

### Small / Eyebrow CTA (mono label)
For "see all", "read more", card-footer links — a lowercase-tracked mono label instead of a filled button:
```css
font-family: 'Geist Mono', monospace;
font-size: 11px;
font-weight: 600;
letter-spacing: 0.04em;
text-transform: uppercase;
display: inline-flex;
gap: 8px;
align-items: center;
```

### Secondary / Ghost Button
```css
background: rgba(0, 0, 0, 0.3);
color: #ffffff;
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 10px;          /* r-1 */
padding: 8px 16px;
font-family: 'Switzer', sans-serif;
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

Use multiples of **8px** as the base spacing unit throughout (this was already the portfolio's convention — it matches gauravi.design's scale exactly, extended here with two more steps for large hero-scale rhythm):

| Token | Value | Usage |
|---|---|---|
| xs / s-1 | 4px | Icon gap, tight inline spacing |
| sm / s-2 | 8px | Inline gaps, button padding |
| md / s-3 | 16px | Section inner gaps, list items |
| lg / s-4 | 24px | Card inner padding (top/bottom) |
| xl / s-5 | 32px | Section separators |
| 2xl / s-6 | 48px | Panel padding |
| 3xl / s-7 | 64px | Major section gaps |
| 4xl / s-8 | 96px | Large section gaps |
| 5xl / s-9 | 128px | Hero-scale section rhythm |
| page | 4rem (64px) | Outer page padding |

### Radius Ladder
One ladder, applied by element size — pick the closest match instead of a one-off radius value:

| Token | Value | Usage |
|---|---|---|
| r-1 | 10px | Chips, small controls, buttons |
| r-2 | 16px | Cards, inputs, inner media blocks |
| r-3 | 20px | Large cards, media frames |
| r-4 | 28px | Full-bleed panels |
| r-pill | 999px | Pills, avatar/dot badges |

### Case Study Panel Spacing
- `marginTop`: `120px` — gap between last stack card and panel
- `marginBottom`: `40px` — gap between panel and footer
- `padding`: `48px` — inner content breathing room
- Section gaps inside panel: `32px`
- Paragraph bottom margin: `16px`

### Bento Case Study Panel Spacing (KynhoodBentoCards.tsx)
This panel is a narrower slide-in surface (48% viewport width) and runs tighter than the general case study spacing above:
- Header row padding: `20px 28px`
- Content area padding: `32px`
- Section-to-section gap: `36px` (`marginBottom` on each section block)
- Paragraph bottom margin: `14px`
- Meta rows / tech chips / list item gaps: `6px–12px` (xs/sm tokens)
- Quote block padding: `20px 24px 20px 28px`

### Readability Rules
- Max content width for prose: **720–800px** — never wider for comfortable reading
- Line length: aim for **60–75 characters** per line for body text
- Never let paragraphs touch card edges — always maintain at least `24px` inner padding

---

## 5. UI Framework (Radix UI Themes)
`@radix-ui/themes` is installed and wraps the app for its theming variables only — it is **not** used for components. Every component in the codebase (buttons, cards, layout) is hand-built with custom divs and inline styles, not Radix primitives.

### Global Theme Configuration
The application is wrapped in `<Theme>` inside `src/main.tsx` with the following configuration:
- `appearance="light"`: Light mode theme to match the portfolio's mixed-background aesthetic (dark canvas home, light case study panels).
- `accentColor="iris"`: A sleek purple-blue accent for active states, buttons, and highlights.
- `panelBackground="solid"`: Ensures floating elements like cards or dialogs have a solid, opaque background.
- `radius="large"`: Applies large, friendly border-radiuses to components, pairing well with the modern editorial nature of Stack Sans Headline.

### Component Usage
Do not import component primitives (`Button`, `Card`, `Text`, `Flex`, etc.) from `@radix-ui/themes` — none are used anywhere in the codebase today. Build UI with custom elements and inline styles, following the typography/color/spacing tokens in this document, to stay consistent with the existing components.

---

## 6. Custom Interactions
While Radix UI handles the structural UI, we continue to rely on **Framer Motion** for highly dynamic, physics-based interactions:
- `react-moveable` is used in our custom Edit Mode for direct DOM manipulation.
- Spring animations should generally use `{ type: "spring", stiffness: 150, damping: 20 }` for a snappy, responsive feel.

> [!NOTE]
> **One signature ease, everywhere** — `cubic-bezier(.22, 1, .36, 1)`. This is not a new value: it's the exact ease this portfolio's entry animations already used (`[0.22, 1, 0.36, 1]`), now made the single default for hover/card/panel motion too instead of introducing new curves per component.

### Duration Scale
| Token | Value | Usage |
|---|---|---|
| dur-1 | 0.18s | Micro-interactions (hover, focus) |
| dur-2 | 0.32s | Standard transitions (entry/exit) |
| dur-3 | 0.5s | Larger reveals, panel slides |

### Animation Principles
- **Entry animations**: fade + slide up `{ opacity: 0→1, y: 30→0 }`, duration `0.35s` (≈ `dur-2`), ease `cubic-bezier(.22, 1, .36, 1)`
- **Exit animations**: reverse entry — `{ opacity: 1→0, y: 0→30 }`
- **Hover micro-interactions**: card/CTA lift `transform: translateY(-6px to -7px)` or `scale(1.03–1.05)`, shadow deepens (see Card Recipes in Section 8), `transition: dur-1` with the signature ease
- **Scroll-triggered**: use GSAP ScrollTrigger with `elastic.out(1, 0.8)` for gallery card entries
- Never animate `height: 0 → auto` with Framer Motion — use opacity + translateY instead to avoid overflow clipping

---

## 7. Icons
Use `@iconify/react` with the Solar icon set (`solar:*-outline`, see `ICONS` in `theme.ts`) for all UI icons throughout the portfolio.
- Icon size in body copy / labels: `16px`
- Icon size in cards / section headers: `20–24px`
- Icon size in hero / display areas: `28–32px`
- Always pair icons with text labels for accessibility — never icon-only unless space is critically constrained
- Icon color should match surrounding text color or use the accent color for emphasis

---

## 8. Elevation & Depth

> [!NOTE]
> **Two shadow tiers only**, craft direction adopted from [gauravi.design](https://gauravi.design/). Resist adding a new shadow recipe per component — reach for one of these two first. The legacy 0–4 ladder below remains valid on already-built dark-canvas components until migrated.

| Token | Shadow | Usage |
|---|---|---|
| shadow-1 (subtle) | `0 1px 2px rgba(20,32,52,.04), 0 6px 16px -8px rgba(20,32,52,.14)` | Chips, tags, minor cards |
| shadow-2 (deep) | `0 2px 6px rgba(20,32,52,.06), 0 24px 56px -28px rgba(20,32,52,.26)` | Floating panels, modals, hover states |

### Legacy Elevation Ladder (still live in production)
| Level | Usage | Shadow |
|---|---|---|
| 0 — Flat | Body text, inline elements | none |
| 1 — Subtle | Tags, chips, minor cards | `0 2px 8px rgba(0,0,0,0.2)` |
| 2 — Card | Scroll stack cards, feature blocks | `0 10px 40px rgba(0,0,0,0.3)` |
| 3 — Float | Case study panel, modals | `0 20px 50px rgba(0,0,0,0.5)` |
| 4 — Overlay | Drawers, full-screen panels | `0 30px 80px rgba(0,0,0,0.7)` |

Always pair elevated surfaces with `backdrop-filter: blur(12–20px) saturate(1.2–1.4)` for depth coherence.

### Card Recipes (reference: gauravi.design)
Three reusable glassmorphic card patterns, all built from the same shape — translucent white fill + `backdrop-filter` blur/saturate + a shadow tier + a lift-on-hover. Pick the closest match instead of inventing a new card style.

**Process / feature card** (e.g. a 3-step "Research → Design → Ship" row)
```css
background: rgba(255,255,255,.14);
backdrop-filter: blur(10px) saturate(1.25);
border: 1px solid rgba(255,255,255,.32);
border-radius: 20px;               /* r-3 */
padding: clamp(28px,3vw,40px) clamp(24px,2.8vw,34px) clamp(24px,2.8vw,32px);
box-shadow: 0 2px 6px rgba(20,32,52,.06), 0 24px 56px -28px rgba(20,32,52,.26); /* shadow-2 */
transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .4s ease, border-color .3s ease, background .3s ease;
```
Hover: `transform: translateY(-7px); background: rgba(255,255,255,.2); border-color: rgba(255,255,255,.5); box-shadow: 0 36px 72px -28px rgba(8,22,48,.55);`

**Work / case-study card** (image-forward, tight outer padding)
```css
background: rgba(255,255,255,.12);
backdrop-filter: blur(8px) saturate(1.2);
border: 1px solid rgba(255,255,255,.28);
border-radius: 20px;               /* r-3 */
padding: 10px;
overflow: hidden;
box-shadow: 0 2px 6px rgba(20,32,52,.06), 0 24px 56px -28px rgba(20,32,52,.26); /* shadow-2 */
```
Inner media block steps down one rung on the radius ladder (`r-2`, ~13–16px) and uses `aspect-ratio: 16/10`. Hover: card lifts `translateY(-6px)`, shadow deepens, inner media `scale(1.04)`.

**Testimonial / quote card** (lighter glass, text-forward)
```css
background: rgba(255,255,255,.5);
backdrop-filter: blur(20px) saturate(1.4);
border: 1px solid rgba(255,255,255,.6);
border-radius: 18px;
padding: 24px 26px 22px;
box-shadow: 0 14px 38px -20px rgba(8,22,48,.3), inset 0 1px 0 rgba(255,255,255,.7);
min-height: 190px;
```

> [!TIP]
> All three share the same shape: translucent fill + blur/saturate + a shadow tier + lift-on-hover (`translateY(-6px to -7px)`, shadow deepens, `cubic-bezier(.22,1,.36,1)`). Reach for one of these before designing a new card treatment from scratch.
