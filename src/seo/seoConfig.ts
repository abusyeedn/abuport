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
import { BRAND_GUIDES } from '../data/brandGuides'
import { MENTORS } from '../data/mentors'
import { EVENTS } from '../data/events'

export const SITE_URL = 'https://abux.in'
export const SITE_NAME = 'Abusyeed - Portfolio'
export const OG_IMAGE = `${SITE_URL}/gallery/portfolioicon.png`

export interface SeoEntry {
  title: string
  description: string
  /** Optional JSON-LD object(s) injected for this route only, on top of the
   *  base Person/WebSite graph that already lives in index.html. */
  structuredData?: Record<string, unknown> | Record<string, unknown>[]
  /** Sets <meta name="robots"> to "noindex, nofollow" for this route -
   *  used for pages that duplicate content living at a canonical URL
   *  elsewhere (e.g. the archived /casestudies/:caseId pages, superseded by
   *  /writings/:slug and /old-case-studies), so they don't compete with or
   *  dilute the real page in search results. */
  noindex?: boolean
}

export const DEFAULT_SEO: SeoEntry = {
  title: 'Abusyeed - Product Designer & UX Designer, Chennai',
  description:
    "Product designer in Chennai. Shipped Kynhood's events platform 0→1 to ₹15Cr+ GMV in 14 months, tripled retention 10%→31%. Featured on Wall of Portfolios, 2026.",
}

// The /mentors page names real people and links to their LinkedIn profiles.
// This "mentions" block is honest structured data - it says this page
// mentions these people, which is true - it does not and cannot make
// abux.in show up when someone searches one of their names; that would
// require them linking back here, which is out of scope for on-page SEO.
const MENTORS_SEO: SeoEntry = {
  title: 'Design Mentors - Designers Abusyeed Follows and Learns From | Abusyeed',
  description:
    'Product designers and UX creators Abusyeed follows, watches, and has learned design from, including Anil Reddy, Saptarshi Prakash, and Chethan KVS.',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}/mentors#webpage`,
    url: `${SITE_URL}/mentors`,
    name: 'Design Mentors | Abusyeed',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    mentions: MENTORS.map((m) => ({
      '@type': 'Person',
      name: m.name,
      sameAs: [m.url],
    })),
  },
}

// The /timeline page leads with real event photos (meetups, panels, college
// sessions) before the chronological timeline itself - each photo is listed
// as an ImageObject so it's individually eligible for image search, not just
// bundled invisibly into the page.
const TIMELINE_SEO: SeoEntry = {
  title: 'Events & Timeline | Abusyeed',
  description:
    'Photos from meetups, panels, and sessions Abusyeed has attended, plus a timeline of his path from B.Tech AI & Data Science to product design at Kynhood.',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}/timeline#webpage`,
    url: `${SITE_URL}/timeline`,
    name: 'Events & Timeline | Abusyeed',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#person` },
    image: EVENTS.map((e) => `${SITE_URL}${encodeURI(e.src)}`),
    mentions: EVENTS.map((e) => ({
      '@type': 'ImageObject',
      name: e.caption,
      contentUrl: `${SITE_URL}${encodeURI(e.src)}`,
    })),
  },
}

// /casestudies, /resume, and /about are archived (unrouted) - their entries
// are removed here too so an old bookmarked/indexed link just falls back to
// DEFAULT_SEO instead of advertising metadata for a page that no longer renders.
export const ROUTE_SEO: Record<string, SeoEntry> = {
  '/': DEFAULT_SEO,
  '/kynhood2': {
    title: 'Kynhood - 0→1 Events Product & Design System | Abusyeed',
    description:
      'How Kynhood’s events product went 0→1 to ₹15Cr+ GMV: registration funnel, partial payments, 35,000+ QR gate scans with zero downtime, and a token-driven design system.',
  },
  '/visual-ui': {
    title: 'UI and Visuals | Abusyeed',
    description:
      'A wall of real interface work across every project Abusyeed has designed, Kynhood and beyond, screen by screen.',
  },
  '/spaarks': {
    title: 'Spaarks - Design System & UX Audit | Abusyeed',
    description:
      'Building a computational design system from scratch at Spaarks, plus an end-to-end usability and accessibility audit of the product.',
  },
  '/photography': {
    title: 'Photos | Abusyeed',
    description:
      'A few frames outside of design work - photography by Abusyeed, product designer based in Chennai, India.',
  },
  '/writings': {
    title: 'Writings | Abusyeed',
    description:
      'Ideas and product thinking from Abusyeed that don’t belong to a single shipped project.',
  },
  '/old-case-studies': {
    title: 'Old Case Studies | Abusyeed',
    description:
      'Redesigned conceptual projects and take-home assignments by Abusyeed, product designer based in Chennai, India.',
  },
  '/mentors': MENTORS_SEO,
  '/timeline': TIMELINE_SEO,
  '/brand-guide': {
    title: 'Brand Guide | Abusyeed',
    description:
      'Brand identity guidelines designed by Abusyeed, product designer based in Chennai, India.',
  },
}

// /writings/:slug title+description, kept here as lightweight metadata only
// (not imported from ../data/writings) - that module's WRITINGS array carries
// every writing's full body text, and Seo.tsx (which reads this file) is
// mounted eagerly in main.tsx, so importing it would pull all that body text
// into the main bundle instead of the writings/detail-page chunks that
// actually need it. Add a line here whenever a new writing is added.
const WRITING_SEO: Record<string, { title: string; description: string }> = {
  'school-bus-tracker-observations': {
    title: 'School Bus Tracker - Observations',
    description: 'A take-home audit of a school bus tracking prototype, covering what breaks for parents and drivers, and a revamped set of screens for the top issues.',
  },
  'the-last-100-metres-problem': {
    title: 'The Last 100 Metres Problem',
    description: 'A case study on reducing delivery calls.',
  },
  'phonepe-2-0-behind-the-redesign': {
    title: 'PhonePe 2.0 - Behind the Redesign',
    description: "An analysis of PhonePe's 2024 UI overhaul - bento layouts, muscle memory, and UPI design constraints.",
  },
  'events-content-plugin': {
    title: 'The Events Content Plugin',
    description: 'A Figma plugin that turned 30 minutes of mock-filling into 5 seconds, built by reading real event data into layout mockups automatically.',
  },
  'medrep-making-lab-reports-readable': {
    title: 'Medrep - Making Lab Reports Readable',
    description: 'An AI layer that reads lab reports the way a person would, scan, upload, or type in values, and get a plain-language explanation back.',
  },
  'foreverstage-deal-intelligence-for-sales-teams': {
    title: 'Foreverstage - Deal Intelligence for Sales Teams',
    description: 'A Deal Intelligence Layer that listens to sales calls, drafts CRM updates for review, and surfaces only what reps, managers, and VPs actually need to see.',
  },
  'coinpedia-redesign-concept': {
    title: 'Coinpedia - Redesign Concept',
    description: "A UI/UX redesign of Coinpedia's market and Bitcoin pages, focused on cleaner data visualization and layout.",
  },
  'real-estate-platforms-competitive-ux-audit': {
    title: 'Real Estate Platforms - Competitive UX Audit',
    description: 'A comparative UX audit of 99acres, Housing.com, and Magicbricks - usability, navigation, and brand trust.',
  },
  'foundit-landing-page-ux-case-study': {
    title: 'FoundIt - Landing Page UX Case Study',
    description: 'A responsive landing page redesign for FoundIt (formerly Monster.com), putting job search front and center.',
  },
  'recruit-crm-advanced-search-enhancement': {
    title: 'Recruit CRM - Advanced Search Enhancement',
    description: 'Simplifying case-sensitive Boolean search and advanced filters for recruiters.',
  },
  'recruit-crm-header-and-navigation-enhancement': {
    title: 'Recruit CRM - Header & Navigation Enhancement',
    description: 'Cleaning up header icons and navigation for better discoverability and accessibility.',
  },
}

// /kynhood2/case/:slug title+description, keyed by the same slugify(title)
// the pages themselves use - kept here as lightweight metadata only (not
// imported from ../components/KynhoodBentoCards), same reasoning as
// WRITING_SEO: that file carries every case study's full body/image data,
// and Seo.tsx is mounted eagerly in main.tsx, so importing it would pull all
// of that into the main bundle. Add a line here whenever a card's title
// changes - the slug is derived from the title, so a rename changes the URL.
const KYNHOOD_CASE_SEO: Record<string, { title: string; description: string }> = {
  'helping-organizers-list-their-six-month-scheduled-complex-events-easily-in-six-steps': {
    title: 'Recurring Events - Kynhood Case Study',
    description: "Designing a portal flow for Kynhood organizers to configure events that repeat over six months, modeled on Outlook's recurring meeting option.",
  },
  'helping-users-on-the-platform-handle-high-volume-transaction-booking-spikes-on-the-launch-day-of-big-concerts': {
    title: 'Registration, Pre-Booking & Booking - Kynhood Case Study',
    description: 'Rebuilding Kynhood’s booking flow after a 12K-buyer launch-day crash, with a pre-booking system to handle high-volume transaction spikes.',
  },
  'a-real-time-multiplayer-cricket-quiz-app-with-live-emcee-control-and-a-leaderboard': {
    title: 'Chase & Cheer - Live Multiplayer Cricket Quiz',
    description: "A real-time multiplayer cricket quiz app built for Marina Mall's IPL screening, with live emcee control and 150+ concurrent players.",
  },
  'a-poc-using-android-notifications-to-sync-booking-inventory-in-real-time': {
    title: 'Notify - Notification-Driven Inventory Sync',
    description: 'A 2-day PoC using Android notifications as an integration layer to sync booking inventory in real time.',
  },
  'helping-gen-z-pay-for-high-priced-tickets-by-splitting-the-money': {
    title: 'Partial Payments - Kynhood Case Study',
    description: 'Letting Kynhood users reserve premium event tickets with a percentage deposit, reducing checkout drop-offs on high-priced tickets.',
  },
  'helping-40-000-users-and-organizers-with-an-inbuilt-qr-validation-system-to-make-operations-easy': {
    title: 'QR Validation & Live Attendance - Kynhood Case Study',
    description: 'How I replaced vendors, laptops and Excel sheets with a multi-gate QR validation system and live attendance dashboard for event organizers: 35,000+ gate scans, zero downtime, built over six phases.',
  },
  'style-guide-design-system': {
    title: 'Style Guide → Design System - Kynhood',
    description: "Kynhood's Figma-to-production component pipeline, turning a style guide into a fully tested, version-controlled design system.",
  },
  'neighbourhood-design-system': {
    title: 'Neighbourhood Design System - Kynhood',
    description: "Kynhood's token-driven design system, built from scratch across consumer app, operator portal, and admin dashboard.",
  },
}

// /writings/:slug and /brand-guide/:slug are dynamic, so a new writing or
// brand guide gets a distinct, correct title/description automatically
// instead of every one of them reporting the generic homepage metadata
// (which reads to Google as duplicate content across every one of those URLs).
function dynamicSeoForPath(pathname: string): SeoEntry | undefined {
  const writingMatch = pathname.match(/^\/writings\/([^/]+)\/?$/)
  if (writingMatch) {
    const writing = WRITING_SEO[writingMatch[1]]
    if (writing) {
      return { title: `${writing.title} | Abusyeed`, description: writing.description }
    }
  }

  const brandMatch = pathname.match(/^\/brand-guide\/([^/]+)\/?$/)
  if (brandMatch) {
    const guide = BRAND_GUIDES.find((g) => g.slug === brandMatch[1])
    if (guide) {
      return {
        title: `${guide.title} Brand Guide | Abusyeed`,
        description: `${guide.title} - ${guide.subtitle}, designed by Abusyeed.`,
      }
    }
  }

  const kynhoodCaseMatch = pathname.match(/^\/kynhood2\/case\/([^/]+)\/?$/)
  if (kynhoodCaseMatch) {
    const entry = KYNHOOD_CASE_SEO[kynhoodCaseMatch[1]]
    if (entry) {
      const url = `${SITE_URL}/kynhood2/case/${kynhoodCaseMatch[1]}`
      return {
        title: `${entry.title} | Abusyeed`,
        description: entry.description,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          '@id': `${url}#creativework`,
          url,
          name: entry.title,
          description: entry.description,
          author: { '@id': `${SITE_URL}/#person` },
          isPartOf: { '@id': `${SITE_URL}/#website` },
        },
      }
    }
  }

  // Archived index (/casestudies/:caseId) - every one of these duplicates a
  // writing that now lives at /writings/:slug or /old-case-studies with its
  // own distinct SEO entry, and nothing in the live UI links to these
  // anymore (see main.tsx's comment on the archived route). Noindexing them
  // stops them from competing with or diluting the real, canonical page in
  // search results instead of quietly reporting the homepage's title.
  const archivedCaseStudyMatch = pathname.match(/^\/casestudies\/([^/]+)\/?$/)
  if (archivedCaseStudyMatch) {
    return { ...DEFAULT_SEO, noindex: true }
  }

  return undefined
}

export function seoForPath(pathname: string): SeoEntry {
  return ROUTE_SEO[pathname] ?? dynamicSeoForPath(pathname) ?? DEFAULT_SEO
}
