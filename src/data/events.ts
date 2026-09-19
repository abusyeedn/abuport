// Real photos from design/dev meetups and college sessions Abusyeed has
// attended or spoken at - shown as the first section on TimelinePage,
// above the chronological timeline itself.
export type EventPhoto = {
  src: string
  caption: string
}

// Flips once the visitor has actually opened /timeline - drives both the
// "New" badge on the first Events photo and the red "1" badge on the
// Timeline nav pill (siteNav.ts), so each only shows before that first
// visit, not on every load after.
export const NEW_EVENT_SEEN_KEY = 'abu-portfolio:timeline-new-seen'

export const EVENTS: EventPhoto[] = [
  { src: '/gallery/IMG_0473.jpeg', caption: 'Design x AI Meetup' },
  { src: '/gallery/f1c72f61-5369-48d9-8e0e-8a65c143652d.jpg', caption: 'Crabchai - August Edition' },
  { src: '/gallery/1765123273828.jpg', caption: 'Women in Product - AI Management' },
  { src: '/gallery/IMG_0500.JPG', caption: 'GDG WTM - December Meetup' },
  { src: '/gallery/Screenshot 2026-09-19 175341.png', caption: 'GDSC Info Session at SMVEC' },
]
