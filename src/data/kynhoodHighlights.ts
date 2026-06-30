export interface HighlightItem {
  id: number;
  num: string;
  meta: string;
  title: string;
  body: string;
  images?: string[];
  tabColor: string;
  borderColor: string;
  accentColor: string;
  textColor: string;
  hasFigmaLogo?: boolean;
}

export const kynhoodHighlights: HighlightItem[] = [
  {
    id: 1,
    num: "01",
    meta: "01 / Main Quest / Feature",
    title: "Registration Funnel",
    body: "Designed a multi-phase registration-to-booking funnel for events. Enabled organizers to gather registrations, screen participants via custom questionnaires, and selectively approve attendees.",
    images: ["/gallery/kyn-cover.png"],
    tabColor: "#0c4a6e",
    borderColor: "#0284c7",
    accentColor: "#38bdf8",
    textColor: "#e0f2fe"
  },
  {
    id: 2,
    num: "02",
    meta: "02 / Main Quest / Feature",
    title: "Partial Payments",
    body: "Designed and defined a partial payment system allowing attendees to reserve event tickets by paying a portion upfront and completing the balance later, reducing checkout friction for high-value experiences.",
    images: ["/gallery/kyn-screens.png"],
    tabColor: "#7c2d12",
    borderColor: "#ea580c",
    accentColor: "#fb923c",
    textColor: "#ffedd5"
  },
  {
    id: 3,
    num: "03",
    meta: "03 / Main Quest / Feature",
    title: "Event Operations Platform",
    body: "End-to-end QR validation, multi-volunteer access control, and live attendance analytics — turning a basic scanner into a scalable event operations dashboard.",
    images: ["/gallery/kyn-screens.png"],
    tabColor: "#581c87",
    borderColor: "#9333ea",
    accentColor: "#c084fc",
    textColor: "#faf5ff"
  },
  {
    id: 4,
    num: "04",
    meta: "04 / Side Quest / Product",
    title: "Unified Inventory Sync",
    body: "Architected an Android-driven inventory synchronization system for slot-based sports venues, parsing booking notifications in real time to prevent double bookings across platforms.",
    images: ["/gallery/kyn1.jpg"],
    tabColor: "#064e3b",
    borderColor: "#16a34a",
    accentColor: "#4ade80",
    textColor: "#f0fdf4"
  },
  {
    id: 5,
    num: "05",
    meta: "05 / Side Quest / Product",
    title: "Quick-Fire Cricket Quiz",
    body: "A live real-time cricket quiz web app where admins run a quiz and players join on their phones to answer questions and compete on a leaderboard. Built on React + Supabase.",
    images: ["/gallery/kyn2.png"],
    tabColor: "#7f1d1d",
    borderColor: "#dc2626",
    accentColor: "#f87171",
    textColor: "#fef2f2"
  },
  {
    id: 6,
    num: "06",
    meta: "06 / Design Systems / Kynhood",
    title: "Neighbourhood Design System",
    body: "Built Kynhood's design system from scratch as the sole designer — a token-driven component library covering all three platforms (consumer app, operator portal, admin dashboard) with semantic color, typography, spacing, and elevation tokens.",
    images: ["/gallery/kyn-cover.png"],
    tabColor: "#115e59",
    borderColor: "#0d9488",
    accentColor: "#2dd4bf",
    textColor: "#f0fdfa"
  },
  {
    id: 7,
    num: "07",
    meta: "07 / AI Tool / Figma Plugin",
    title: "Events Content Plugin",
    body: "A custom Figma plugin that pulls live event data from Kynhood's API and auto-fills design mockups — titles, dates, prices, locations, images — across any number of frames in one click.",
    tabColor: "#1e1b4b",
    borderColor: "#4f46e5",
    accentColor: "#818cf8",
    textColor: "#e0e7ff",
    hasFigmaLogo: true
  }
];
