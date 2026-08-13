/**
 * caseFileData.ts
 *
 * Master data file for CASE FILE: THE MISSING DESIGNER
 * A 4-level investigation where every puzzle reconstructs another
 * piece of Abu's identity - never asks the player to guess facts,
 * only ever reveals them.
 *
 * All personal content is placeholder - easy to swap in real details.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface CaseZone {
  x: number
  y: number
  width: number
  height: number
}

export interface CaseFile {
  id: number
  title: string
  subtitle: string
  objective: string
  zone: CaseZone
  requiredClues: number
  hint: string
}

export interface Clue {
  id: string
  caseId: number
  type: 'pinterest' | 'sticky' | 'polaroid' | 'newspaper' | 'document' | 'photo' | 'handwritten' | 'label' | 'map' | 'letter'
  x: number  // relative to zone
  y: number
  width: number
  height: number
  rotation: number
  title: string
  content: string
  story?: string      // personal story revealed on restoration (Case 01)
  emoji?: string      // icon/emoji for the clue card
  pinColor: string
  bgColor: string
}

export interface MemoryChain {
  id: string
  rootLabel: string
  rootEmoji: string
  /** sequential nodes the player links, in required order */
  nodes: { label: string; insight: string }[]
}

export interface MemoryFragment {
  id: string
  label: string
  emoji: string
  content: string
}

export interface ProfileTrait {
  id: string
  label: string
  emoji: string
  description: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// WORLD CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const WORLD_WIDTH = 6000
export const WORLD_HEIGHT = 4000

// ═══════════════════════════════════════════════════════════════════════════════
// CASE FILE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const caseFiles: CaseFile[] = [
  {
    id: 1,
    title: 'MEMORY RECONSTRUCTION',
    subtitle: 'Case File 01',
    objective: 'The wall is destroyed. Restore every photograph, note, and pin - you are not solving anything yet, only rebuilding what was lost.',
    zone: { x: 2200, y: 1400, width: 1600, height: 1200 },
    requiredClues: 15,
    hint: 'Click each crooked photograph to straighten and re-pin it. Restore all of them to see what they form together.',
  },
  {
    id: 2,
    title: 'MEMORY NETWORK',
    subtitle: 'Case File 02',
    objective: 'The reconstructed mind has four glowing memory clusters. Trace each pathway from root to outcome to learn how Abu actually thinks.',
    zone: { x: 4000, y: 600, width: 1600, height: 1200 },
    requiredClues: 4,
    hint: 'Select a root memory, then click each following node in order - the pathway lights up one link at a time.',
  },
  {
    id: 3,
    title: 'THE LOST MEMORY',
    subtitle: 'Case File 03',
    objective: 'One memory survived only as scattered fragments. Reassemble it, piece by piece, to recover the project that defined him.',
    zone: { x: 4000, y: 2400, width: 1600, height: 1200 },
    requiredClues: 6,
    hint: 'Click each floating fragment - Problem, Research, Iterations, Failures, Breakthrough, Impact - to snap it back into the memory.',
  },
  {
    id: 4,
    title: 'PROFILE RECONSTRUCTION',
    subtitle: 'Case File 04',
    objective: 'Everything has been learned already. Drag what you now know about Abu into the silhouette to complete the portrait.',
    zone: { x: 2200, y: 2800, width: 1600, height: 1000 },
    requiredClues: 10,
    hint: 'Click each characteristic card to place it inside the silhouette. Every placement restores another part of the portrait.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// PIN COLORS
// ═══════════════════════════════════════════════════════════════════════════════

const PIN = {
  red: '#dc2626',
  orange: '#ea580c',
  yellow: '#ca8a04',
  green: '#16a34a',
  blue: '#2563eb',
  purple: '#7c3aed',
  pink: '#db2777',
}

// ═══════════════════════════════════════════════════════════════════════════════
// CASE 01 - MEMORY RECONSTRUCTION (15 broken photographs, restore all 15)
// Each item starts rotated / crooked (its `rotation`). Clicking straightens it.
// ═══════════════════════════════════════════════════════════════════════════════

export const case01Clues: Clue[] = [
  {
    id: 'c01-running', caseId: 1, type: 'polaroid',
    x: 80, y: 120, width: 170, height: 210, rotation: -14,
    title: 'RUNNING', emoji: '🏃',
    content: 'Evidence: Subject runs regularly',
    story: 'I run because it clears my mind. Most of my best product ideas happen after long runs.',
    pinColor: PIN.red, bgColor: '#fefefe',
  },
  {
    id: 'c01-architecture', caseId: 1, type: 'polaroid',
    x: 320, y: 80, width: 170, height: 210, rotation: 11,
    title: 'ARCHITECTURE', emoji: '🏛️',
    content: 'Evidence: Deep appreciation for structure',
    story: 'I see buildings the way I see interfaces - every element has a reason to exist.',
    pinColor: PIN.blue, bgColor: '#fefefe',
  },
  {
    id: 'c01-minimalism', caseId: 1, type: 'polaroid',
    x: 560, y: 140, width: 170, height: 210, rotation: -9,
    title: 'MINIMALISM', emoji: '◻️',
    content: 'Evidence: Less is more philosophy',
    story: 'I don\'t add. I subtract. The best design is the one with nothing left to remove.',
    pinColor: PIN.purple, bgColor: '#fefefe',
  },
  {
    id: 'c01-music', caseId: 1, type: 'polaroid',
    x: 800, y: 90, width: 170, height: 210, rotation: 13,
    title: 'MUSIC', emoji: '🎵',
    content: 'Evidence: Always has headphones on',
    story: 'I rarely design in silence. Music sets the rhythm for my creative flow.',
    pinColor: PIN.orange, bgColor: '#fefefe',
  },
  {
    id: 'c01-coffee', caseId: 1, type: 'polaroid',
    x: 1040, y: 150, width: 170, height: 210, rotation: -12,
    title: 'COFFEE', emoji: '☕',
    content: 'Evidence: Excessive caffeine consumption',
    story: 'My thinking ritual. Every deep design session starts with a cup.',
    pinColor: PIN.yellow, bgColor: '#fefefe',
  },
  {
    id: 'c01-technology', caseId: 1, type: 'polaroid',
    x: 1280, y: 100, width: 170, height: 210, rotation: 10,
    title: 'TECHNOLOGY', emoji: '💻',
    content: 'Evidence: Early adopter of new tools',
    story: 'I\'m fascinated by how technology shapes human behaviour. That\'s why I build.',
    pinColor: PIN.green, bgColor: '#fefefe',
  },
  {
    id: 'c01-photography', caseId: 1, type: 'polaroid',
    x: 130, y: 400, width: 170, height: 210, rotation: 12,
    title: 'PHOTOGRAPHY', emoji: '📷',
    content: 'Evidence: Captures moments obsessively',
    story: 'Photography taught me composition, light, and storytelling - skills I use in UI design daily.',
    pinColor: PIN.pink, bgColor: '#fefefe',
  },
  {
    id: 'c01-nature', caseId: 1, type: 'polaroid',
    x: 370, y: 450, width: 170, height: 210, rotation: -15,
    title: 'NATURE', emoji: '🌿',
    content: 'Evidence: Prefers outdoor environments',
    story: 'Nature resets my perspective. I return to the screen with better clarity every time.',
    pinColor: PIN.green, bgColor: '#fefefe',
  },
  {
    id: 'c01-football', caseId: 1, type: 'polaroid',
    x: 610, y: 420, width: 170, height: 210, rotation: 14,
    title: 'FOOTBALL', emoji: '⚽',
    content: 'Evidence: Team sport enthusiast',
    story: 'Football taught me teamwork, strategy, and reading patterns - the same skills I use in product design.',
    pinColor: PIN.red, bgColor: '#fefefe',
  },
  {
    id: 'c01-typography', caseId: 1, type: 'polaroid',
    x: 850, y: 380, width: 170, height: 210, rotation: -10,
    title: 'TYPOGRAPHY', emoji: '𝐀',
    content: 'Evidence: Font obsession detected',
    story: 'Typography is 90% of design. I can tell a brand\'s personality from its typeface.',
    pinColor: PIN.blue, bgColor: '#fefefe',
  },
  {
    id: 'c01-travel', caseId: 1, type: 'polaroid',
    x: 1100, y: 430, width: 170, height: 210, rotation: 9,
    title: 'TRAVEL', emoji: '✈️',
    content: 'Evidence: Multiple passport stamps',
    story: 'Travel expands how I see problems. Every culture designs differently.',
    pinColor: PIN.orange, bgColor: '#fefefe',
  },
  {
    id: 'c01-reading', caseId: 1, type: 'polaroid',
    x: 200, y: 700, width: 170, height: 210, rotation: -11,
    title: 'READING', emoji: '📚',
    content: 'Evidence: Extensive book collection',
    story: 'I read across domains - psychology, architecture, business. Cross-pollination creates the best ideas.',
    pinColor: PIN.purple, bgColor: '#fefefe',
  },
  {
    id: 'c01-ai', caseId: 1, type: 'polaroid',
    x: 500, y: 740, width: 170, height: 210, rotation: 12,
    title: 'ARTIFICIAL INTELLIGENCE', emoji: '🤖',
    content: 'Evidence: AI & Data Science graduate',
    story: 'I studied AI not to replace designers, but to understand the tools that will reshape our craft.',
    pinColor: PIN.green, bgColor: '#fefefe',
  },
  {
    id: 'c01-cooking', caseId: 1, type: 'polaroid',
    x: 800, y: 700, width: 170, height: 210, rotation: -13,
    title: 'COOKING', emoji: '🍳',
    content: 'Evidence: Kitchen experiments documented',
    story: 'Cooking is prototyping with ingredients. Same process: experiment, iterate, serve.',
    pinColor: PIN.yellow, bgColor: '#fefefe',
  },
  {
    id: 'c01-design', caseId: 1, type: 'polaroid',
    x: 1100, y: 720, width: 170, height: 210, rotation: 15,
    title: 'DESIGN', emoji: '🎨',
    content: 'Evidence: Primary vocation',
    story: 'I don\'t enjoy making interfaces. I enjoy solving problems. Design is just my tool.',
    pinColor: PIN.red, bgColor: '#fefefe',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CASE 02 - MEMORY NETWORK
// Four memory clusters. Each root leads through a chain of nodes to an outcome.
// The player connects nodes strictly in order; each link reveals one sentence.
// ═══════════════════════════════════════════════════════════════════════════════

export const case02Chains: MemoryChain[] = [
  {
    id: 'chain-coffee',
    rootLabel: 'Coffee', rootEmoji: '☕',
    nodes: [
      { label: 'Focus', insight: 'Coffee isn\'t a habit - it\'s the switch that turns on deep focus.' },
      { label: 'Deep Work', insight: 'Focus without distraction is where his best thinking happens.' },
      { label: 'UX', insight: 'Deep work sessions are almost always spent untangling the user experience.' },
      { label: 'Products', insight: 'Every product he\'s proud of started in one of those quiet, caffeinated hours.' },
    ],
  },
  {
    id: 'chain-running',
    rootLabel: 'Running', rootEmoji: '🏃',
    nodes: [
      { label: 'Discipline', insight: 'Running daily built a discipline that carried into everything else.' },
      { label: 'Consistency', insight: 'Discipline turned into consistency - showing up, even without motivation.' },
      { label: 'Design Systems', insight: 'That same consistency is why he\'s drawn to building design systems.' },
      { label: 'Scalability', insight: 'A consistent system is what lets a product scale without breaking.' },
    ],
  },
  {
    id: 'chain-music',
    rootLabel: 'Music', rootEmoji: '🎵',
    nodes: [
      { label: 'Emotion', insight: 'Music taught him to notice emotion before logic.' },
      { label: 'Storytelling', insight: 'Emotion is the first ingredient of any story worth telling.' },
      { label: 'Interaction Design', insight: 'He treats every interaction as a small story with a beginning and payoff.' },
      { label: 'Experience', insight: 'String enough of those small stories together and you get an experience people remember.' },
    ],
  },
  {
    id: 'chain-technology',
    rootLabel: 'Technology', rootEmoji: '💻',
    nodes: [
      { label: 'Curiosity', insight: 'Technology never felt like a tool to him - it felt like a question worth chasing.' },
      { label: 'Learning', insight: 'That curiosity turned into a habit of constantly learning how things work.' },
      { label: 'Building', insight: 'He can\'t learn something without eventually trying to build it.' },
      { label: 'Innovation', insight: 'Building things is how he turns curiosity into something new.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CASE 03 - THE LOST MEMORY
// One fragmented project memory, reassembled piece by piece.
// ═══════════════════════════════════════════════════════════════════════════════

export const lostMemoryProjectName = 'The Design System'

export const case03Fragments: MemoryFragment[] = [
  {
    id: 'mem-problem', label: 'Problem', emoji: '❗',
    content: 'Multiple product teams were building inconsistent interfaces. No shared language existed between design and engineering.',
  },
  {
    id: 'mem-research', label: 'Research', emoji: '🔎',
    content: 'Audited 400+ components across 3 products. Interviewed 12 developers and 5 designers to understand where the friction really lived.',
  },
  {
    id: 'mem-iterations', label: 'Iterations', emoji: '🔄',
    content: 'Token system → component library → documentation platform → migration toolkit. Four major iterations over eight months.',
  },
  {
    id: 'mem-failures', label: 'Failures', emoji: '⚠️',
    content: 'The first version was too rigid - teams abandoned it within weeks. Getting buy-in from teams with existing workflows took far longer than expected.',
  },
  {
    id: 'mem-breakthrough', label: 'Breakthrough', emoji: '💡',
    content: 'A comprehensive system with 60+ components, automated token sync, and a Figma-to-code pipeline that finally let design and engineering speak the same language.',
  },
  {
    id: 'mem-impact', label: 'Impact', emoji: '📈',
    content: 'Design-to-development time dropped 40%. Consistency score across products reached 95%. Adopted by three product teams.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CASE 04 - PROFILE RECONSTRUCTION
// Traits learned in Cases 1–3, placed into the silhouette to complete the portrait.
// ═══════════════════════════════════════════════════════════════════════════════

export const case04Traits: ProfileTrait[] = [
  { id: 'trait-runner', label: 'Runner', emoji: '🏃', description: 'Clears his mind in motion before he ever opens a design tool.' },
  { id: 'trait-minimalist', label: 'Minimalist', emoji: '◻️', description: 'Subtracts until only what matters is left on the screen.' },
  { id: 'trait-builder', label: 'Builder', emoji: '🧱', description: 'Doesn\'t stop at ideas - takes them into working prototypes.' },
  { id: 'trait-problem-solver', label: 'Problem Solver', emoji: '🧩', description: 'Sees design as a tool for solving problems, not decoration.' },
  { id: 'trait-storyteller', label: 'Storyteller', emoji: '🎬', description: 'Treats every interaction as a small story with a payoff.' },
  { id: 'trait-curious', label: 'Curious', emoji: '🔭', description: 'Studied AI to understand the tools reshaping his own craft.' },
  { id: 'trait-systems-thinker', label: 'Systems Thinker', emoji: '🕸️', description: 'Builds consistent systems, not one-off screens.' },
  { id: 'trait-ai-graduate', label: 'AI Graduate', emoji: '🤖', description: 'A rare combination of design thinking and technical depth.' },
  { id: 'trait-designer', label: 'Designer', emoji: '🎨', description: 'Design is the tool. Solving the problem is the point.' },
  { id: 'trait-coffee-lover', label: 'Coffee Lover', emoji: '☕', description: 'Every deep work session starts with a cup.' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// FINALE DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const finaleData = {
  name: 'Abu',
  titles: [
    'Product Designer',
    'Design Systems Specialist',
    'AI & Data Science Graduate',
    'Builder',
    'Problem Solver',
    'Curious Learner',
  ],
  links: [
    { label: 'Resume', url: '/gallery/resume.pdf', icon: '📄' },
    { label: 'Portfolio', url: '/', icon: '🎯' },
    { label: 'Case Studies', url: '/#selected-work', icon: '📁' },
    { label: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
    { label: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { label: 'Email', url: 'mailto:hello@abu.design', icon: '📧' },
  ],
  closingMessage: "You didn't solve a crime. You reconstructed a person. Every puzzle restored another memory. Every memory revealed another part of who Abu is. The investigation is complete.",
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATIVE WALL ITEMS (background evidence scattered between zones)
// ═══════════════════════════════════════════════════════════════════════════════

export interface DecoItem {
  id: string
  type: 'sticky' | 'newspaper' | 'handwritten' | 'label' | 'receipt' | 'fingerprint'
  x: number  // absolute world coordinates
  y: number
  width: number
  height: number
  rotation: number
  title: string
  content: string
  pinColor: string
  bgColor: string
}

export const decorativeItems: DecoItem[] = [
  // Scattered across the wall between zones for atmosphere
  { id: 'deco-01', type: 'sticky', x: 150, y: 150, width: 140, height: 140, rotation: -5, title: 'WHO WAS HE?', content: 'A brilliant designer. Then, nothing. No photo. No resume. Only this room.', pinColor: PIN.red, bgColor: '#fef08a' },
  { id: 'deco-02', type: 'newspaper', x: 1800, y: 300, width: 240, height: 180, rotation: 2, title: 'DESIGNER VANISHES WITHOUT A TRACE', content: 'No biography. No LinkedIn. Only an investigation room full of evidence remains...', pinColor: PIN.blue, bgColor: '#f5f0e6' },
  { id: 'deco-03', type: 'handwritten', x: 3700, y: 1900, width: 180, height: 120, rotation: -3, title: 'Note to self', content: 'Don\'t remember what he liked. Discover why those things belong together.', pinColor: PIN.purple, bgColor: '#fefce8' },
  { id: 'deco-04', type: 'label', x: 5500, y: 500, width: 130, height: 50, rotation: 1, title: 'CLASSIFIED', content: 'Level 5 clearance required', pinColor: PIN.red, bgColor: '#fbbf24' },
  { id: 'deco-05', type: 'sticky', x: 100, y: 3500, width: 150, height: 150, rotation: 3, title: 'RECONSTRUCT', content: 'Not by reading. By investigating.', pinColor: PIN.green, bgColor: '#bbf7d0' },
  { id: 'deco-06', type: 'fingerprint', x: 5200, y: 3200, width: 130, height: 130, rotation: -2, title: 'LATENT PRINT #7', content: 'Match pending', pinColor: PIN.orange, bgColor: '#f0f0f0' },
  { id: 'deco-07', type: 'receipt', x: 3500, y: 3600, width: 110, height: 200, rotation: 4, title: 'COFFEE SHOP - 2:15 AM', content: 'Americano x3\nDesign sprint fuel\n$14.50', pinColor: PIN.yellow, bgColor: '#fafaf0' },
  { id: 'deco-08', type: 'handwritten', x: 1600, y: 3200, width: 190, height: 110, rotation: -1, title: 'THEORY:', content: 'These weren\'t hobbies. These were routines.', pinColor: PIN.blue, bgColor: '#fefce8' },
  { id: 'deco-09', type: 'label', x: 300, y: 2200, width: 120, height: 50, rotation: -2, title: 'EXHIBIT A', content: 'Filed under Case #ABU-MISSING', pinColor: PIN.red, bgColor: '#fbbf24' },
  { id: 'deco-10', type: 'newspaper', x: 5000, y: 1500, width: 220, height: 170, rotation: -3, title: 'INVESTIGATION CONTINUES', content: 'Detectives confirm the recovered evidence forms something none of them expected...', pinColor: PIN.purple, bgColor: '#f5f0e6' },
  { id: 'deco-11', type: 'sticky', x: 2800, y: 100, width: 130, height: 130, rotation: 2, title: 'REBUILD THE PERSON', content: 'Not the resume. The person.', pinColor: PIN.pink, bgColor: '#fce7f3' },
  { id: 'deco-12', type: 'handwritten', x: 4800, y: 2800, width: 170, height: 100, rotation: 3, title: 'Connection found', content: 'Every restored memory reveals another piece of who he is.', pinColor: PIN.green, bgColor: '#fefce8' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// RED STRINGS (decorative + meaningful connections between zones)
// ═══════════════════════════════════════════════════════════════════════════════

export interface WallRedString {
  fromX: number
  fromY: number
  toX: number
  toY: number
}

export const wallRedStrings: WallRedString[] = [
  // Zone 1 (center) → Zone 2 (right)
  { fromX: 3800, fromY: 1800, toX: 4200, toY: 1100 },
  // Zone 2 → Zone 3 (bottom-right)
  { fromX: 5200, fromY: 1600, toX: 5000, toY: 2600 },
  // Zone 1 → Zone 4 (bottom)
  { fromX: 3000, fromY: 2500, toX: 3000, toY: 2900 },
  // Zone 3 → Zone 4
  { fromX: 4300, fromY: 3400, toX: 3600, toY: 3300 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SILHOUETTE - shared bust outline path used by Case 01 (build-up) and Case 04
// (final placement). ViewBox is 400×500; components scale it to fit their zone.
// ═══════════════════════════════════════════════════════════════════════════════

export const SILHOUETTE_VIEWBOX = '0 0 400 500'
export const SILHOUETTE_PATH =
  'M60,500 C60,380 92,300 142,268 C120,248 108,218 108,188 C108,116 148,54 200,54 ' +
  'C252,54 292,116 292,188 C292,218 280,248 258,268 C308,300 340,380 340,500 Z'
