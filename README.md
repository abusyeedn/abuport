# Abu — Portfolio

An interactive design portfolio built with React 19, TypeScript, and Vite. Features a built-in visual editor (drag, resize, animate elements in-browser), three distinct pages with GSAP and Framer Motion animations, and a Three.js circular gallery.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 + Radix UI Themes |
| Animation | Framer Motion, GSAP (ScrollTrigger) |
| 3D / WebGL | Three.js, @react-three/fiber, @react-three/drei |
| Routing | React Router DOM 7 |
| Smooth scroll | Lenis |
| Drag (editor) | react-moveable |
| Deployment | Vercel |

## Project Structure

```
Portfolio/
├── index.html                  # Entry HTML — loads Google Fonts (non-blocking)
├── vite.config.ts              # Build config + dev layout-saver plugin
├── vercel.json                 # Security headers + SPA rewrite rules
├── design.md                   # Design system documentation (typography, colors, motion)
│
├── public/
│   ├── gallery/                # All portfolio images and 3D assets
│   │   ├── gallery_1–8.*       # Circular gallery artwork (Arabic calligraphy series)
│   │   ├── kyn1–7.*            # Kynhood case study images
│   │   ├── kyn-cover.png       # Kynhood hero cover image
│   │   ├── kyn-screens.png     # Kynhood app screens
│   │   ├── kyn2-alt.jpg        # Kynhood alternate image
│   │   ├── envelope.png/svg    # Closed envelope asset
│   │   ├── envelope-opened.png/svg  # Open envelope asset (mail modal)
│   │   ├── post.png            # Post box target for flying envelope
│   │   ├── tab.png             # Tab bar asset
│   │   ├── animated_civilian_helicopter.glb
│   │   └── animated_crab_rigged_free.glb
│   └── crt/                    # CRT filter animation frames (88 JPEGs)
│
└── src/
    ├── main.tsx                # App entry — Router, Theme, image protection listeners
    ├── App.tsx                 # Home page — freeform absolute canvas
    ├── EditorContext.tsx       # Global editor state (undo/redo, drag, persist)
    ├── theme.ts                # Design tokens (FONTS)
    ├── index.css               # Global styles + image protection CSS
    │
    ├── data/                   # Baked-in layout and content data
    │   ├── defaultLayout.json          # Saved element transforms / positions
    │   ├── defaultDynamicElements.json # Cloned/added components registry
    │   └── caseStudies.json            # Parsed case study content
    │
    ├── pages/
    │   ├── KynhoodPage.tsx     # /kynhood — green cutting mat, GSAP scroll animations
    │   └── CaseStudiesPage.tsx # /casestudies — red cutting mat, folder-based gallery
    │
    └── components/
        ├── FigmaElement.tsx        # Universal element wrapper (animations, edit handles)
        ├── DynamicRenderer.tsx     # Renders dynamic/cloned components per-route
        ├── ComponentRegistry.tsx   # String → lazy component map for dynamic rendering
        ├── GlobalEditor.tsx        # Editor toolbar (dev-only)
        ├── EditModeToggle.tsx      # Edit mode on/off button (dev-only)
        │
        ├── CircularGallery.tsx     # WebGL circular scrolling gallery (OGL)
        ├── TiltCard.tsx            # 3D tilt + glare card on hover
        ├── VinylDeck.tsx           # Interactive vinyl record player UI
        ├── CDPlayer.tsx            # Retro CD player interface
        ├── MacOSFolder.tsx         # macOS folder-style navigation widget
        ├── EnvelopesStack.tsx      # Stacked envelope click → mail modal
        ├── FlyingEnvelope.tsx      # Envelope fly animation on form submit
        ├── MailModal.tsx           # Contact form modal
        │
        ├── Dock.tsx                # Bottom navigation dock with magnification
        ├── Footer.tsx              # Page footer
        ├── CuttingMatBackground.tsx # Grid-ruled cutting mat background
        ├── ScrollStack.tsx         # GSAP scroll-pinned stacking cards
        ├── ScrollReveal.tsx        # Text reveal on scroll (blur + rotation)
        ├── FlowingMenu.tsx         # Menu with marquee/flowing hover animations
        ├── KynhoodJourney.tsx      # Journey / timeline visualization
        ├── KynhoodPath.tsx         # Path / workflow diagram (lazy-loaded)
        ├── PipBoyMetricsRow.tsx    # Pip-Boy style metrics display
        ├── WordHighlighter.tsx     # Text highlighter with custom styling
        └── HintTooltip.tsx         # Tooltip with hint text
```

## Pages

| Route | Page | Theme |
|---|---|---|
| `/` | Home — freeform canvas with interactive widgets | Dark `#111` |
| `/kynhood` | Kynhood case study with scroll animations | Green `#064e3b` |
| `/casestudies` | Case study folder gallery | Red `#b91c1c` |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Visual Editor (Dev Mode Only)

When running `npm run dev`, an **Edit Mode** toggle appears. Activating it:

- Shows drag handles on every `FigmaElement` wrapper
- Allows dragging, resizing, reordering, duplicating, and deleting components
- Lets you assign entry animations (pop, blur, slide, fade) per element

**Keyboard shortcuts in Edit Mode:**

| Shortcut | Action |
|---|---|
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Backspace / Delete` | Delete selected element |

**Saving changes:** Click "Bake into Code" in the editor toolbar to persist the layout back to `src/data/defaultLayout.json` and `src/data/defaultDynamicElements.json` via the Vite dev plugin (`POST /api/save-layout`). Production builds always read these baked-in files.

## Adding a New Component to the Canvas

1. Create the component in `src/components/MyComponent.tsx`
2. Add it to `ComponentRegistry.tsx` so the editor can clone it:
   ```ts
   MyComponent: React.lazy(() => import('./MyComponent')),
   ```
3. Wrap it in `<FigmaElement>` in `App.tsx` (or the relevant page)

## Deployment

The project is configured for Vercel. Push to `main` to deploy. `vercel.json` includes:
- SPA rewrite rule (`/*` → `index.html`)
- Long-term cache headers for gallery images and built assets
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)
