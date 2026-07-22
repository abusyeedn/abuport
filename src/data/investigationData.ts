/**
 * investigationData.ts
 *
 * Procedurally generates ~100 evidence items scattered across a
 * 6000 × 4000 detective investigation wall, plus ~20 red-string
 * connections between related items.
 */

// ── Types ──────────────────────────────────────────────────────────────────────

export type EvidenceType =
  | 'photo'
  | 'sticky'
  | 'newspaper'
  | 'map'
  | 'letter'
  | 'document'
  | 'polaroid'
  | 'passport'
  | 'handwritten'
  | 'receipt'
  | 'fingerprint'
  | 'plate'
  | 'timeline'
  | 'label'

export interface EvidenceItem {
  id: string
  type: EvidenceType
  x: number
  y: number
  width: number
  height: number
  rotation: number        // degrees, -8 to +8
  zIndex: number
  title: string
  content: string
  pinColor: string
  bgColor: string        // paper/card background tint
}

export interface RedString {
  fromId: string
  toId: string
}

// ── Constants ──────────────────────────────────────────────────────────────────

export const WORLD_WIDTH = 6000
export const WORLD_HEIGHT = 4000

// ── Seeded random (deterministic) ──────────────────────────────────────────────

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(42)

function randRange(min: number, max: number) {
  return min + rand() * (max - min)
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}

// ── Evidence Templates ─────────────────────────────────────────────────────────

const PIN_COLORS = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#7c3aed', '#db2777']

interface Template {
  type: EvidenceType
  w: [number, number]
  h: [number, number]
  titles: string[]
  contents: string[]
  bg: string
}

const templates: Template[] = [
  {
    type: 'photo',
    w: [160, 220], h: [120, 180],
    titles: ['Suspect A — Parking Lot', 'CCTV Frame #4471', 'Crime Scene — Exterior', 'Vehicle Plate Match', 'Surveillance — 11:42 PM', 'Witness ID Photo', 'Traffic Camera Still'],
    contents: ['Captured 03/14 22:15', 'Motion detected', 'Low light — enhanced', 'Timestamp verified', 'Cross-ref case #7792'],
    bg: '#1a1a1a'
  },
  {
    type: 'sticky',
    w: [130, 180], h: [130, 180],
    titles: ['CHECK ALIBI', 'FOLLOW UP', 'Call forensics', 'Timeline gap?', 'Re-interview witness', 'URGENT — Lab results', 'Cross-reference DB', 'Phone records pending'],
    contents: ['Mon 9am — verify', 'Ask about the car', 'DNA results due Fri', '2hr window unaccounted', 'Changed story twice', 'Toxicology report needed', 'Cell tower data'],
    bg: '#fef08a'
  },
  {
    type: 'newspaper',
    w: [200, 280], h: [160, 240],
    titles: ['LOCAL MAN REPORTED MISSING', 'POLICE SEEK WITNESSES', 'INVESTIGATION CONTINUES', 'NEW EVIDENCE SURFACES', 'ARREST MADE IN COLD CASE', 'SUSPECT IDENTIFIED'],
    contents: ['Authorities confirmed today...', 'The investigation remains ongoing...', 'Sources close to the case reveal...', 'Detectives are pursuing new leads...', 'The district attorney stated...'],
    bg: '#f5f0e6'
  },
  {
    type: 'map',
    w: [240, 320], h: [200, 280],
    titles: ['Area of Interest — Sector 7', 'Route Analysis', 'Last Known Location', 'Cell Tower Coverage Map', 'Crime Scene Perimeter'],
    contents: ['Red markers indicate sightings', '3 mile radius highlighted', 'Search grid overlay', 'GPS coordinates verified'],
    bg: '#e8e4d8'
  },
  {
    type: 'letter',
    w: [180, 240], h: [240, 320],
    titles: ['Anonymous Tip — Ref#4419', 'Intercepted Communication', 'Ransom Note Copy', 'Confession Draft', 'Witness Statement — Sworn'],
    contents: ['I know what happened that night...', 'The package was delivered at 3am...', 'Subject was last seen heading north...', 'I saw everything from my window...'],
    bg: '#fdfcf8'
  },
  {
    type: 'document',
    w: [200, 260], h: [280, 340],
    titles: ['FORENSIC REPORT #2847', 'AUTOPSY FINDINGS', 'CASE BRIEF — CONFIDENTIAL', 'WARRANT APPLICATION', 'EVIDENCE LOG', 'CHAIN OF CUSTODY'],
    contents: ['Classification: RESTRICTED', 'Filed under case #JD-4419', 'Pending review by DA office', 'Laboratory analysis complete', 'Approved by Judge Morrison'],
    bg: '#f8f8f8'
  },
  {
    type: 'polaroid',
    w: [150, 190], h: [180, 220],
    titles: ['Unknown Subject', 'Location B — Night', 'Evidence Item #12', 'Scene Photo — Kitchen', 'Basement Entry', 'Garage — 2nd Visit', 'Backyard — Dig Site'],
    contents: ['Who is this?', 'Found in suspect wallet', 'Recovered from scene', 'Date unknown', 'Developed from film roll'],
    bg: '#fefefe'
  },
  {
    type: 'passport',
    w: [120, 140], h: [160, 180],
    titles: ['DOE, JOHN — US', 'SMITH, JANE — UK', 'UNKNOWN ALIAS', 'EXPIRED — SEIZED', 'FORGED — REF#882'],
    contents: ['DOB: 04/15/1978', 'Last entry: Mexico', 'Multiple stamps — EU', 'Flagged by Interpol', 'Biometric mismatch'],
    bg: '#1e3a5f'
  },
  {
    type: 'handwritten',
    w: [160, 220], h: [100, 160],
    titles: ['Det. Notes — 3/14', 'Quick observation', 'Theory #3', 'Connection??', 'LOOK INTO THIS'],
    contents: ['Doesn\'t add up — check timeline again', 'Witness contradicts #2\'s account', 'Follow the money trail', 'Same MO as 2019 case', 'Blood type doesn\'t match'],
    bg: '#fefce8'
  },
  {
    type: 'receipt',
    w: [100, 140], h: [180, 260],
    titles: ['GAS STATION — 11:58 PM', 'HARDWARE STORE', 'MOTEL CHECK-IN', 'BURNER PHONE PURCHASE', 'DINER — 2 MEALS'],
    contents: ['$47.82 — Cash', '$156.00 — Visa ending 4419', '$89.00/night — 3 nights', 'Prepaid — $29.99', 'Paid 6:15 AM — who eats at 6?'],
    bg: '#fafaf0'
  },
  {
    type: 'fingerprint',
    w: [120, 160], h: [120, 160],
    titles: ['LATENT #1 — PARTIAL', 'PRINT — RIGHT INDEX', 'UNIDENTIFIED MATCH', 'PALM PRINT — DOOR', 'PRINT SET — 4 OF 5'],
    contents: ['12-point match', 'AFIS search pending', 'Lifted from glass surface', 'Smudged — partial only', 'Cross-ref with suspect B'],
    bg: '#f0f0f0'
  },
  {
    type: 'plate',
    w: [180, 220], h: [80, 100],
    titles: ['CA 4J-K991', 'NY ABC-1234', 'TX R8G-2201', 'FL STOLEN PLT', 'NV 227-BKR'],
    contents: ['2019 Honda Civic — Black', 'Rental — Enterprise', 'Registered to shell company', 'Reported stolen 3/12', 'Seen near scene — 2x'],
    bg: '#e0e7ef'
  },
  {
    type: 'timeline',
    w: [260, 340], h: [120, 180],
    titles: ['TIMELINE — MARCH 14', 'SEQUENCE OF EVENTS', 'GAP ANALYSIS', 'SUSPECT MOVEMENTS', 'WITNESS ACCOUNTS'],
    contents: ['9:00 PM — Left restaurant\n10:15 PM — ATM withdrawal\n11:58 PM — Gas station\n1:30 AM — ???\n3:45 AM — 911 call', '6:00 AM — Body discovered\n6:15 AM — First responders\n7:00 AM — Scene secured'],
    bg: '#fff'
  },
  {
    type: 'label',
    w: [100, 160], h: [40, 60],
    titles: ['EXHIBIT A', 'EXHIBIT B', 'EVIDENCE #12', 'REF: JD-4419', 'CLASSIFIED', 'DO NOT REMOVE', 'PENDING ANALYSIS', 'PRIORITY — RUSH'],
    contents: ['Filed 03/15', 'Chain of custody verified', 'See attached report', 'Cross-reference required'],
    bg: '#fbbf24'
  }
]

// ── Generate Items ─────────────────────────────────────────────────────────────

function generateItems(): EvidenceItem[] {
  const items: EvidenceItem[] = []

  // Create a grid of ~10 columns × ~10 rows with jitter
  const COLS = 10
  const ROWS = 10
  const cellW = WORLD_WIDTH / COLS
  const cellH = WORLD_HEIGHT / ROWS

  let id = 0
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const template = pick(templates)
      const w = Math.round(randRange(template.w[0], template.w[1]))
      const h = Math.round(randRange(template.h[0], template.h[1]))

      // Position within grid cell with jitter
      const baseX = col * cellW + cellW * 0.15
      const baseY = row * cellH + cellH * 0.15
      const jitterX = randRange(0, cellW * 0.5)
      const jitterY = randRange(0, cellH * 0.5)
      const x = Math.round(baseX + jitterX)
      const y = Math.round(baseY + jitterY)

      items.push({
        id: `ev-${id}`,
        type: template.type,
        x: Math.min(x, WORLD_WIDTH - w - 20),
        y: Math.min(y, WORLD_HEIGHT - h - 20),
        width: w,
        height: h,
        rotation: Math.round(randRange(-8, 8) * 10) / 10,
        zIndex: Math.floor(randRange(1, 10)),
        title: pick(template.titles),
        content: pick(template.contents),
        pinColor: pick(PIN_COLORS),
        bgColor: template.bg,
      })
      id++
    }
  }

  return items
}

// ── Generate Red Strings ───────────────────────────────────────────────────────

function generateStrings(items: EvidenceItem[]): RedString[] {
  const strings: RedString[] = []
  const count = 22

  for (let i = 0; i < count; i++) {
    const from = items[Math.floor(rand() * items.length)]
    // Pick a nearby-ish item (within ~1500px)
    const candidates = items.filter(it =>
      it.id !== from.id &&
      Math.abs(it.x - from.x) < 1500 &&
      Math.abs(it.y - from.y) < 1200
    )
    if (candidates.length === 0) continue
    const to = pick(candidates)
    // Avoid duplicates
    if (!strings.some(s => (s.fromId === from.id && s.toId === to.id) || (s.fromId === to.id && s.toId === from.id))) {
      strings.push({ fromId: from.id, toId: to.id })
    }
  }

  return strings
}

// ── Exported Data ──────────────────────────────────────────────────────────────

export const evidenceItems = generateItems()
export const redStrings = generateStrings(evidenceItems)
