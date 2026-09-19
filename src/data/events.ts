// Real photos from design/dev meetups and college sessions Abusyeed has
// attended or spoken at - shown as the first section on TimelinePage,
// above the chronological timeline itself.
export type EventPhoto = {
  src: string
  caption: string
  description: string
}

// Flips once the visitor has actually opened /timeline - drives both the
// "New" badge on the first Events photo and the red "1" badge on the
// Timeline nav pill (siteNav.ts), so each only shows before that first
// visit, not on every load after.
export const NEW_EVENT_SEEN_KEY = 'abu-portfolio:timeline-new-seen'

export const EVENTS: EventPhoto[] = [
  {
    src: '/gallery/IMG_0473.jpeg',
    caption: 'Design x AI Meetup',
    description: 'Hosted at Kissflow by **Vadivel** (Director of Product Design), **Bala**, and **Mubarak** and their team, on building AI agents to make better design and prompting techniques to save tokens.',
  },
  {
    src: '/gallery/f1c72f61-5369-48d9-8e0e-8a65c143652d.jpg',
    caption: 'Crabchai - August Edition',
    description: '**Sowmyanarayanan** (Associate Director of Product, Pick Your Trail) spoke on the balance between building fast and building right, and **Nikkitha** (CEO, Superbryn) on AI evals, observability, and what happens beyond the demo.',
  },
  {
    src: '/gallery/1765123273828.jpg',
    caption: 'AI in Product Management',
    description: 'A panel with **Janet** (Founder, Growth Collective), **Sreya** (Product Lead, Ford Motor Company), and **Kamalika** (Product Lead, M2P Fintech) on how AI is influencing product management in India.',
  },
  {
    src: '/gallery/IMG_0500.JPG',
    caption: 'GDG Women Techmakers - December Meetup',
    description: '**Mahalakshmi** (Sutherland) on conversational AI, **Namrutha** on why communities matter, and **Madhumitha** on clean code practices.',
  },
  {
    src: '/gallery/Screenshot 2026-09-19 175341.png',
    caption: 'GDSC Info Session at SMVEC',
    description: 'Part of the Google Developer Student Club at SMVEC, co-hosting GTC sessions with **Jayachandran** as a student club initiative.',
  },
]
