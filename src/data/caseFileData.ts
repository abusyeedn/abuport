/**
 * caseFileData.ts
 *
 * Master data file for CASE FILE: WHO IS ABU?
 * Contains all 7 case definitions, clue items, zone positions,
 * and interactive content.
 *
 * All personal content is placeholder — easy to swap in real details.
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
  story?: string      // personal story revealed on click (Case 01)
  emoji?: string      // icon/emoji for the clue card
  pinColor: string
  bgColor: string
}

export interface ConnectionPath {
  nodes: string[]  // sequence of labels: ["Running", "Clear Mind", "Better UX", "Better Products"]
}

export interface WorkspaceObject {
  id: string
  name: string
  emoji: string
  description: string
  finalX: number  // final position on desk (relative)
  finalY: number
}

export interface ChoicePair {
  id: string
  optionA: string
  optionB: string
  abuChoice: 'a' | 'b'
  explanation: string
}

export interface ProjectCard {
  id: string
  name: string
  emoji: string
  problem: string
  research: string
  challenges: string
  iterations: string
  solution: string
  impact: string
}

export interface JourneyMilestone {
  id: string
  year: string
  title: string
  description: string
  lesson: string
  order: number  // correct timeline order
}

export interface RapidQuestion {
  id: string
  optionA: string
  optionB: string
  abuChoice: 'a' | 'b'
  explanation: string
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
    title: 'FIRST IMPRESSION',
    subtitle: 'Case File 01',
    objective: 'Find five clues that describe Abu.',
    zone: { x: 2200, y: 1400, width: 1600, height: 1200 },
    requiredClues: 5,
    hint: 'Click any 5 polaroid cards to review field notes and collect them as active evidence.',
  },
  {
    id: 2,
    title: 'CONNECT THE DOTS',
    subtitle: 'Case File 02',
    objective: 'Understand how Abu thinks.',
    zone: { x: 4000, y: 600, width: 1600, height: 1200 },
    requiredClues: 3,
    hint: 'Drag red strings between cards to connect matching pairs (e.g. Running -> Clear Mind).',
  },
  {
    id: 3,
    title: 'MISSING EVIDENCE',
    subtitle: 'Case File 03',
    objective: 'Find these elements in the wall: A coffee-stained notebook, A Figma wireframe, A running medal, A handwritten notebook page.',
    zone: { x: 4000, y: 2400, width: 1600, height: 1200 },
    requiredClues: 4,
    hint: 'Look across the entire board. Spot the notebook (📓), Figma wireframe (📊), running medal (🏅), and journal page (📝) hidden among other elements.',
  },
  {
    id: 4,
    title: 'THINK LIKE ABU',
    subtitle: 'Case File 04',
    objective: 'Make choices. See how Abu thinks.',
    zone: { x: 2200, y: 2800, width: 1600, height: 1000 },
    requiredClues: 5,
    hint: 'Review both options A & B, then click the card that represents your design approach.',
  },
  {
    id: 5,
    title: 'PROJECT INVESTIGATION',
    subtitle: 'Case File 05',
    objective: 'Open the project folders. Investigate the work.',
    zone: { x: 400, y: 2400, width: 1600, height: 1200 },
    requiredClues: 3,
    hint: 'Open and read at least 3 manila project folders. Use the tabs (Problem, Solution, etc.) to review details.',
  },
  {
    id: 6,
    title: 'MY JOURNEY',
    subtitle: 'Case File 06',
    objective: 'Arrange the milestones. Build the timeline.',
    zone: { x: 400, y: 600, width: 1600, height: 1200 },
    requiredClues: 5,
    hint: 'Select the scattered career milestone cards chronologically to organize them along the timeline base.',
  },
  {
    id: 7,
    title: 'RAPID PROFILE',
    subtitle: 'Case File 07',
    objective: 'Answer quick questions. Compare with Abu.',
    zone: { x: 2200, y: 200, width: 1600, height: 800 },
    requiredClues: 8,
    hint: 'Make snap judgments. Answer all 8 questions instinctually by clicking Option A or Option B.',
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
// CASE 01 — FIRST IMPRESSION (15 Pinterest-style clues, need 5)
// ═══════════════════════════════════════════════════════════════════════════════

export const case01Clues: Clue[] = [
  {
    id: 'c01-running', caseId: 1, type: 'polaroid',
    x: 80, y: 120, width: 170, height: 210, rotation: -3,
    title: 'RUNNING', emoji: '🏃',
    content: 'Evidence: Subject runs regularly',
    story: 'I run because it clears my mind. Most of my best product ideas happen after long runs.',
    pinColor: PIN.red, bgColor: '#fefefe',
  },
  {
    id: 'c01-architecture', caseId: 1, type: 'polaroid',
    x: 320, y: 80, width: 170, height: 210, rotation: 2,
    title: 'ARCHITECTURE', emoji: '🏛️',
    content: 'Evidence: Deep appreciation for structure',
    story: 'I see buildings the way I see interfaces — every element has a reason to exist.',
    pinColor: PIN.blue, bgColor: '#fefefe',
  },
  {
    id: 'c01-minimalism', caseId: 1, type: 'polaroid',
    x: 560, y: 140, width: 170, height: 210, rotation: -1,
    title: 'MINIMALISM', emoji: '◻️',
    content: 'Evidence: Less is more philosophy',
    story: 'I don\'t add. I subtract. The best design is the one with nothing left to remove.',
    pinColor: PIN.purple, bgColor: '#fefefe',
  },
  {
    id: 'c01-music', caseId: 1, type: 'polaroid',
    x: 800, y: 90, width: 170, height: 210, rotation: 3,
    title: 'MUSIC', emoji: '🎵',
    content: 'Evidence: Always has headphones on',
    story: 'I rarely design in silence. Music sets the rhythm for my creative flow.',
    pinColor: PIN.orange, bgColor: '#fefefe',
  },
  {
    id: 'c01-coffee', caseId: 1, type: 'polaroid',
    x: 1040, y: 150, width: 170, height: 210, rotation: -2,
    title: 'COFFEE', emoji: '☕',
    content: 'Evidence: Excessive caffeine consumption',
    story: 'My thinking ritual. Every deep design session starts with a cup.',
    pinColor: PIN.yellow, bgColor: '#fefefe',
  },
  {
    id: 'c01-technology', caseId: 1, type: 'polaroid',
    x: 1280, y: 100, width: 170, height: 210, rotation: 1,
    title: 'TECHNOLOGY', emoji: '💻',
    content: 'Evidence: Early adopter of new tools',
    story: 'I\'m fascinated by how technology shapes human behaviour. That\'s why I build.',
    pinColor: PIN.green, bgColor: '#fefefe',
  },
  {
    id: 'c01-photography', caseId: 1, type: 'polaroid',
    x: 130, y: 400, width: 170, height: 210, rotation: 2,
    title: 'PHOTOGRAPHY', emoji: '📷',
    content: 'Evidence: Captures moments obsessively',
    story: 'Photography taught me composition, light, and storytelling — skills I use in UI design daily.',
    pinColor: PIN.pink, bgColor: '#fefefe',
  },
  {
    id: 'c01-nature', caseId: 1, type: 'polaroid',
    x: 370, y: 450, width: 170, height: 210, rotation: -4,
    title: 'NATURE', emoji: '🌿',
    content: 'Evidence: Prefers outdoor environments',
    story: 'Nature resets my perspective. I return to the screen with better clarity every time.',
    pinColor: PIN.green, bgColor: '#fefefe',
  },
  {
    id: 'c01-football', caseId: 1, type: 'polaroid',
    x: 610, y: 420, width: 170, height: 210, rotation: 3,
    title: 'FOOTBALL', emoji: '⚽',
    content: 'Evidence: Team sport enthusiast',
    story: 'Football taught me teamwork, strategy, and reading patterns — the same skills I use in product design.',
    pinColor: PIN.red, bgColor: '#fefefe',
  },
  {
    id: 'c01-typography', caseId: 1, type: 'polaroid',
    x: 850, y: 380, width: 170, height: 210, rotation: -2,
    title: 'TYPOGRAPHY', emoji: '𝐀',
    content: 'Evidence: Font obsession detected',
    story: 'Typography is 90% of design. I can tell a brand\'s personality from its typeface.',
    pinColor: PIN.blue, bgColor: '#fefefe',
  },
  {
    id: 'c01-travel', caseId: 1, type: 'polaroid',
    x: 1100, y: 430, width: 170, height: 210, rotation: 1,
    title: 'TRAVEL', emoji: '✈️',
    content: 'Evidence: Multiple passport stamps',
    story: 'Travel expands how I see problems. Every culture designs differently.',
    pinColor: PIN.orange, bgColor: '#fefefe',
  },
  {
    id: 'c01-reading', caseId: 1, type: 'polaroid',
    x: 200, y: 700, width: 170, height: 210, rotation: -1,
    title: 'READING', emoji: '📚',
    content: 'Evidence: Extensive book collection',
    story: 'I read across domains — psychology, architecture, business. Cross-pollination creates the best ideas.',
    pinColor: PIN.purple, bgColor: '#fefefe',
  },
  {
    id: 'c01-ai', caseId: 1, type: 'polaroid',
    x: 500, y: 740, width: 170, height: 210, rotation: 2,
    title: 'ARTIFICIAL INTELLIGENCE', emoji: '🤖',
    content: 'Evidence: AI & Data Science graduate',
    story: 'I studied AI not to replace designers, but to understand the tools that will reshape our craft.',
    pinColor: PIN.green, bgColor: '#fefefe',
  },
  {
    id: 'c01-cooking', caseId: 1, type: 'polaroid',
    x: 800, y: 700, width: 170, height: 210, rotation: -3,
    title: 'COOKING', emoji: '🍳',
    content: 'Evidence: Kitchen experiments documented',
    story: 'Cooking is prototyping with ingredients. Same process: experiment, iterate, serve.',
    pinColor: PIN.yellow, bgColor: '#fefefe',
  },
  {
    id: 'c01-design', caseId: 1, type: 'polaroid',
    x: 1100, y: 720, width: 170, height: 210, rotation: 4,
    title: 'DESIGN', emoji: '🎨',
    content: 'Evidence: Primary vocation',
    story: 'I don\'t enjoy making interfaces. I enjoy solving problems. Design is just my tool.',
    pinColor: PIN.red, bgColor: '#fefefe',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CASE 02 — CONNECT THE DOTS
// ═══════════════════════════════════════════════════════════════════════════════

export const case02Concepts = [
  { id: 'c02-running', label: 'Running', emoji: '🏃', x: 200, y: 200 },
  { id: 'c02-ai', label: 'AI', emoji: '🤖', x: 450, y: 150 },
  { id: 'c02-design-systems', label: 'Design Systems', emoji: '🧩', x: 700, y: 200 },
  { id: 'c02-music', label: 'Music', emoji: '🎵', x: 200, y: 400 },
  { id: 'c02-travel', label: 'Travel', emoji: '✈️', x: 450, y: 350 },
  { id: 'c02-coffee', label: 'Coffee', emoji: '☕', x: 700, y: 400 },
  { id: 'c02-technology', label: 'Technology', emoji: '💻', x: 950, y: 300 },
  { id: 'c02-minimalism', label: 'Minimalism', emoji: '◻️', x: 450, y: 550 },
]

export const case02Connections: ConnectionPath[] = [
  { nodes: ['Running', 'Clear Mind', 'Better UX Decisions', 'Better Products'] },
  { nodes: ['Music', 'Emotion', 'Motion Design', 'Storytelling'] },
  { nodes: ['AI', 'Pattern Recognition', 'Data-Driven Design', 'Smarter Products'] },
  { nodes: ['Travel', 'New Perspectives', 'Diverse User Empathy', 'Inclusive Design'] },
  { nodes: ['Coffee', 'Focus', 'Deep Work', 'Quality Output'] },
  { nodes: ['Design Systems', 'Consistency', 'Scalable Products', 'Team Velocity'] },
  { nodes: ['Technology', 'Prototyping', 'Feasibility Checks', 'Realistic Design'] },
  { nodes: ['Minimalism', 'Clarity', 'User Focus', 'Elegant Solutions'] },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CASE 03 — BUILD MY WORKSPACE
// ═══════════════════════════════════════════════════════════════════════════════

export const case03Objects: WorkspaceObject[] = [
  { id: 'ws-notebook', name: 'Notebook', emoji: '📓', description: 'I write ideas before they disappear.', finalX: 250, finalY: 400 },
  { id: 'ws-wireframe', name: 'Figma Wireframe', emoji: '📊', description: 'I prototype before I polish.', finalX: 700, finalY: 350 },
  { id: 'ws-medal', name: 'Running Medal', emoji: '🏅', description: 'Discipline is built outside work.', finalX: 400, finalY: 300 },
  { id: 'ws-journal', name: 'Journal Page', emoji: '📝', description: 'My best products begin with questions.', finalX: 550, finalY: 280 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CASE 04 — THINK LIKE ABU
// ═══════════════════════════════════════════════════════════════════════════════

export const case04Choices: ChoicePair[] = [
  {
    id: 'ch-01',
    optionA: 'More Features',
    optionB: 'Better Experience',
    abuChoice: 'b',
    explanation: 'Features don\'t matter if the experience is broken. I always start with how it feels.',
  },
  {
    id: 'ch-02',
    optionA: 'Minimalism',
    optionB: 'Decoration',
    abuChoice: 'a',
    explanation: 'Every element should earn its place on the screen. If it doesn\'t serve a purpose, it goes.',
  },
  {
    id: 'ch-03',
    optionA: 'Fast Prototype',
    optionB: 'Perfect Mockup',
    abuChoice: 'a',
    explanation: 'Speed of learning beats perfection of output. Ship fast, learn faster.',
  },
  {
    id: 'ch-04',
    optionA: 'Apple',
    optionB: 'Android',
    abuChoice: 'a',
    explanation: 'Ecosystem cohesion. When hardware and software work together, magic happens.',
  },
  {
    id: 'ch-05',
    optionA: 'Dark Mode',
    optionB: 'Light Mode',
    abuChoice: 'a',
    explanation: 'Dark mode is my natural habitat. Easier on the eyes, better contrast for design work.',
  },
  {
    id: 'ch-06',
    optionA: 'Figma',
    optionB: 'Code',
    abuChoice: 'b',
    explanation: 'I design in Figma, but I think in code. Knowing what\'s possible makes my designs better.',
  },
  {
    id: 'ch-07',
    optionA: 'Move Fast',
    optionB: 'Get It Right',
    abuChoice: 'a',
    explanation: 'Iteration beats deliberation. Real users reveal more than theoretical analysis ever will.',
  },
  {
    id: 'ch-08',
    optionA: 'Solo Focus',
    optionB: 'Team Collaboration',
    abuChoice: 'b',
    explanation: 'The best products come from diverse minds colliding. I thrive in collaborative environments.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CASE 05 — PROJECT INVESTIGATION
// ═══════════════════════════════════════════════════════════════════════════════

export const case05Projects: ProjectCard[] = [
  {
    id: 'proj-design-system',
    name: 'Design System',
    emoji: '🧩',
    problem: 'Multiple product teams were building inconsistent interfaces. No shared language between design and engineering.',
    research: 'Audited 400+ components across 3 products. Interviewed 12 developers and 5 designers. Analyzed adoption patterns of existing style guides.',
    challenges: 'Getting buy-in from teams with existing workflows. Balancing flexibility with consistency. Versioning across products.',
    iterations: 'Started with token system → component library → documentation platform → migration toolkit. 4 major iterations over 8 months.',
    solution: 'A comprehensive design system with 60+ components, automated token sync, Figma-to-code pipeline, and living documentation.',
    impact: 'Reduced design-to-development time by 40%. Achieved 95% consistency score across products. Adopted by 3 product teams.',
  },
  {
    id: 'proj-quiz-platform',
    name: 'Quiz Platform',
    emoji: '❓',
    problem: 'Students needed an engaging way to practice for exams. Existing tools felt like boring spreadsheets.',
    research: 'Surveyed 200+ students. Analysed gamification patterns in Duolingo, Kahoot, and Quizlet.',
    challenges: 'Making learning feel like play without losing educational value. Handling diverse question types.',
    iterations: 'Card-based UI → gamified progress → social leaderboards → adaptive difficulty.',
    solution: 'An interactive quiz platform with spaced repetition, real-time multiplayer, and performance analytics.',
    impact: 'Used by 500+ students. Average study time increased 3x. Pass rates improved 25%.',
  },
  {
    id: 'proj-portfolio',
    name: 'This Portfolio',
    emoji: '🎯',
    problem: 'Traditional portfolios are passive. Visitors skim, bounce, forget. I wanted to be remembered.',
    research: 'Studied 100+ designer portfolios. Identified: most are beautiful but forgettable. None are interactive investigations.',
    challenges: 'Balancing immersion with usability. Ensuring it works without instructions. Making it feel natural, not gimmicky.',
    iterations: 'Static page → scroll-based → investigation wall → full detective experience.',
    solution: 'You\'re looking at it. An immersive detective experience that makes discovering who I am feel like solving a case.',
    impact: 'You tell me. Are you still here? Then it worked.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CASE 06 — MY JOURNEY
// ═══════════════════════════════════════════════════════════════════════════════

export const case06Milestones: JourneyMilestone[] = [
  {
    id: 'j-01', year: '2018', order: 1,
    title: 'Started Designing',
    description: 'Opened Photoshop for the first time. Made terrible posters. Fell in love anyway.',
    lesson: 'Everyone starts somewhere. The first step is always the ugliest.',
  },
  {
    id: 'j-02', year: '2019', order: 2,
    title: 'Discovered UI/UX',
    description: 'Realized design wasn\'t just making things pretty — it was about solving problems for real people.',
    lesson: 'Design is problem-solving dressed in pixels.',
  },
  {
    id: 'j-03', year: '2020', order: 3,
    title: 'Built First Product',
    description: 'Shipped a student productivity app. 50 users. Felt like a million.',
    lesson: 'Shipping beats planning. Always.',
  },
  {
    id: 'j-04', year: '2021', order: 4,
    title: 'Graduated — AI & Data Science',
    description: 'Combined design thinking with technical depth. A rare combination.',
    lesson: 'The best designers understand the technology beneath their designs.',
  },
  {
    id: 'j-05', year: '2022', order: 5,
    title: 'Joined Startup',
    description: 'Built design systems from scratch. Led product design for a growing team.',
    lesson: 'Constraints breed creativity. Startups teach you to do more with less.',
  },
  {
    id: 'j-06', year: '2023', order: 6,
    title: 'Launched Products',
    description: 'Multiple products shipped. Real users. Real impact. Real responsibility.',
    lesson: 'Impact is measured in people helped, not pixels pushed.',
  },
  {
    id: 'j-07', year: '2024', order: 7,
    title: 'Created This Portfolio',
    description: 'Decided that a traditional portfolio wouldn\'t do justice to who I am.',
    lesson: 'The medium is the message. How you present your work is part of the work.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// CASE 07 — RAPID PROFILE
// ═══════════════════════════════════════════════════════════════════════════════

export const case07Questions: RapidQuestion[] = [
  { id: 'rp-01', optionA: 'Coffee', optionB: 'Tea', abuChoice: 'a', explanation: 'Fuel for deep work. No exceptions.' },
  { id: 'rp-02', optionA: 'Morning', optionB: 'Night', abuChoice: 'b', explanation: 'My best ideas arrive after midnight.' },
  { id: 'rp-03', optionA: 'Books', optionB: 'Podcasts', abuChoice: 'a', explanation: 'Books let me pause and think. Podcasts keep moving.' },
  { id: 'rp-04', optionA: 'Remote', optionB: 'Office', abuChoice: 'a', explanation: 'Deep focus requires deep silence. Hard to find in an open office.' },
  { id: 'rp-05', optionA: 'Figma', optionB: 'Code', abuChoice: 'b', explanation: 'I design in Figma but I think in code.' },
  { id: 'rp-06', optionA: 'Running', optionB: 'Gym', abuChoice: 'a', explanation: 'Running is meditation in motion.' },
  { id: 'rp-07', optionA: 'Movies', optionB: 'Series', abuChoice: 'b', explanation: 'Character development needs time. So do great products.' },
  { id: 'rp-08', optionA: 'iOS', optionB: 'Android', abuChoice: 'a', explanation: 'Design quality. Ecosystem. Privacy. The trifecta.' },
  { id: 'rp-09', optionA: 'Minimal', optionB: 'Expressive', abuChoice: 'a', explanation: 'Clarity over decoration. Always.' },
  { id: 'rp-10', optionA: 'Plan First', optionB: 'Build First', abuChoice: 'b', explanation: 'Prototypes teach faster than plans. Start building.' },
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
    { label: 'Resume', url: '/resume', icon: '📄' },
    { label: 'Portfolio', url: '/', icon: '🎯' },
    { label: 'Case Studies', url: '/casestudies', icon: '📁' },
    { label: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
    { label: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { label: 'Email', url: 'mailto:hello@abu.design', icon: '📧' },
  ],
  closingMessage: "You didn't just browse a portfolio. You investigated a person. Every clue, every story, and every project was a piece of who I am. Thanks for taking the case.",
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
  { id: 'deco-01', type: 'sticky', x: 150, y: 150, width: 140, height: 140, rotation: -5, title: 'WHO IS HE?', content: 'Subject exhibits unusual design obsession', pinColor: PIN.red, bgColor: '#fef08a' },
  { id: 'deco-02', type: 'newspaper', x: 1800, y: 300, width: 240, height: 180, rotation: 2, title: 'DESIGNER BUILDS DETECTIVE PORTFOLIO', content: 'In an unprecedented move, a product designer has turned their portfolio into an investigation...', pinColor: PIN.blue, bgColor: '#f5f0e6' },
  { id: 'deco-03', type: 'handwritten', x: 3700, y: 1900, width: 180, height: 120, rotation: -3, title: 'Note to self', content: 'Check the connections between his interests and his work...', pinColor: PIN.purple, bgColor: '#fefce8' },
  { id: 'deco-04', type: 'label', x: 5500, y: 500, width: 130, height: 50, rotation: 1, title: 'CLASSIFIED', content: 'Level 5 clearance required', pinColor: PIN.red, bgColor: '#fbbf24' },
  { id: 'deco-05', type: 'sticky', x: 100, y: 3500, width: 150, height: 150, rotation: 3, title: 'FOLLOW THE CLUES', content: 'Each zone reveals another piece of the puzzle', pinColor: PIN.green, bgColor: '#bbf7d0' },
  { id: 'deco-06', type: 'fingerprint', x: 5200, y: 3200, width: 130, height: 130, rotation: -2, title: 'LATENT PRINT #7', content: 'Match pending', pinColor: PIN.orange, bgColor: '#f0f0f0' },
  { id: 'deco-07', type: 'receipt', x: 3500, y: 3600, width: 110, height: 200, rotation: 4, title: 'COFFEE SHOP — 2:15 AM', content: 'Americano x3\nDesign sprint fuel\n$14.50', pinColor: PIN.yellow, bgColor: '#fafaf0' },
  { id: 'deco-08', type: 'handwritten', x: 1600, y: 3200, width: 190, height: 110, rotation: -1, title: 'THEORY:', content: 'He thinks in systems, not screens', pinColor: PIN.blue, bgColor: '#fefce8' },
  { id: 'deco-09', type: 'label', x: 300, y: 2200, width: 120, height: 50, rotation: -2, title: 'EXHIBIT A', content: 'Filed under Case #ABU-2024', pinColor: PIN.red, bgColor: '#fbbf24' },
  { id: 'deco-10', type: 'newspaper', x: 5000, y: 1500, width: 220, height: 170, rotation: -3, title: 'INVESTIGATION CONTINUES', content: 'Authorities confirm that the subject is driven by curiosity and an unusual need to solve problems...', pinColor: PIN.purple, bgColor: '#f5f0e6' },
  { id: 'deco-11', type: 'sticky', x: 2800, y: 100, width: 130, height: 130, rotation: 2, title: 'SUSPICIOUS', content: 'Works late. Runs early. Designs always.', pinColor: PIN.pink, bgColor: '#fce7f3' },
  { id: 'deco-12', type: 'handwritten', x: 4800, y: 2800, width: 170, height: 100, rotation: 3, title: 'Connection found', content: 'His AI background influences his design decisions', pinColor: PIN.green, bgColor: '#fefce8' },
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
  // Zone 1 → Zone 6 (top-left)
  { fromX: 2300, fromY: 1500, toX: 1600, toY: 1100 },
  // Zone 6 → Zone 5 (left)
  { fromX: 1200, fromY: 1700, toX: 1100, toY: 2500 },
  // Zone 1 → Zone 7 (top)
  { fromX: 3000, fromY: 1450, toX: 3000, toY: 900 },
  // Cross connections
  { fromX: 4500, fromY: 800, toX: 5200, toY: 2600 },
  { fromX: 800, fromY: 800, toX: 800, toY: 2600 },
  { fromX: 2200, fromY: 500, toX: 4200, toY: 700 },
  { fromX: 4500, fromY: 3200, toX: 2800, toY: 3200 },
  { fromX: 1200, fromY: 3200, toX: 2300, toY: 3200 },
]
