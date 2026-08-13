/**
 * Per-route SEO metadata.
 *
 * index.html carries the base/home tags (plus the JSON-LD profile) so crawlers
 * and link unfurlers get correct data without executing JS. This table is what
 * <Seo /> swaps in on client-side route changes, which static HTML can't cover
 * in a single-page app.
 *
 * Descriptions are kept to ~155 chars - past roughly that, Google truncates.
 */
export const SITE_URL = 'https://abux.in'
export const SITE_NAME = 'Abusyeed - Portfolio'
export const OG_IMAGE = `${SITE_URL}/gallery/portfolioicon.png`

export interface SeoEntry {
  title: string
  description: string
}

export const DEFAULT_SEO: SeoEntry = {
  title: 'Abusyeed - Product Designer & UX Designer, Chennai',
  description:
    "Product designer in Chennai. Shipped Kynhood's events platform 0→1 to ₹3Cr GMV in 8 months and tripled retention 10%→31%. Design systems, Figma, AI-driven prototyping.",
}

// /casestudies, /resume, and /about are archived (unrouted) - their entries
// are removed here too so an old bookmarked/indexed link just falls back to
// DEFAULT_SEO instead of advertising metadata for a page that no longer renders.
export const ROUTE_SEO: Record<string, SeoEntry> = {
  '/': DEFAULT_SEO,
  '/kynhood2': {
    title: 'Kynhood - 0→1 Events Product & Design System | Abusyeed',
    description:
      'How Kynhood’s events product went 0→1 across 3 platforms to ₹3Cr GMV in 8 months: registration funnel, partial payments, QR event ops and a token-driven design system.',
  },
  '/spaarks': {
    title: 'Spaarks - Design System & UX Audit | Abusyeed',
    description:
      'Building a computational design system from scratch at Spaarks, plus an end-to-end usability and accessibility audit of the product.',
  },
}

export function seoForPath(pathname: string): SeoEntry {
  return ROUTE_SEO[pathname] ?? DEFAULT_SEO
}
