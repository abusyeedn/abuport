import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { TopHeaderItemData } from './TopHeader'
import { NEW_EVENT_SEEN_KEY } from '../data/events'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Homepage sections - scrolled to directly when already on "/", or reached
// via a "/#id" navigation (then scrolled once mounted, see
// useScrollToHashOnMount in App.tsx) from every other page.
const SECTION_LINKS: { label: string; id: string; dividerAfter?: boolean }[] = [
  { label: 'Case Studies', id: 'work' },
  { label: 'Expertise', id: 'expertise' },
  { label: 'Posters', id: 'posters' },
  { label: 'About', id: 'about', dividerAfter: true },
]

// Separately routed pages - the divider above marks the boundary between
// these and the homepage-section links.
const PAGE_LINKS: { label: string; path: string }[] = [
  { label: 'UI and Visuals', path: '/visual-ui' },
  { label: 'Brand Guide', path: '/brand-guide' },
  { label: 'Writings', path: '/writings' },
  { label: 'Mentors', path: '/mentors' },
  { label: 'Timeline', path: '/timeline' },
  { label: 'Photos', path: '/photography' },
]

// Single source of truth for the nav item list every TopHeader on the site
// renders - this used to be six separately hand-maintained arrays (one per
// page), which is exactly how "Writings" or a divider tweak would land on
// five pages and quietly get missed on the sixth. Add/remove/reorder a nav
// destination here once and every page picks it up.
//
// Pass `activePath` (e.g. '/photography') to highlight that page's own pill.
// Omit it on the homepage - there, the section pills (Case Studies,
// Expertise, Posters, About) light up on their own via scroll position
// instead of a fixed route match.
export function useSiteNavItems(activePath?: string): TopHeaderItemData[] {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  // Tracks which homepage section is currently in view (see the
  // IntersectionObserver in App.tsx that broadcasts this) so the matching
  // pill - Case Studies included - can show as active while scrolling the
  // homepage, the same way a routed page's own pill lights up.
  const [inViewId, setInViewId] = useState<string | null>(null)
  useEffect(() => {
    if (!onHome) { setInViewId(null); return }
    const handler = (e: Event) => setInViewId((e as CustomEvent<string>).detail)
    window.addEventListener('homepage-section-in-view', handler)
    return () => window.removeEventListener('homepage-section-in-view', handler)
  }, [onHome])

  const sectionItems: TopHeaderItemData[] = SECTION_LINKS.map((l) => ({
    label: l.label,
    onClick: () => (onHome ? scrollToId(l.id) : navigate(`/#${l.id}`)),
    dividerAfter: l.dividerAfter,
    active: onHome && l.id === inViewId,
  }))

  // Re-reads fresh on every navigation (pathname is this hook's own
  // dependency via useLocation) - TimelinePage.tsx sets this key once the
  // visitor has actually opened it, so the badge clears the next time they
  // navigate anywhere, without needing a storage-event listener.
  const timelineHasNewEvent = localStorage.getItem(NEW_EVENT_SEEN_KEY) !== '1'

  const pageItems: TopHeaderItemData[] = PAGE_LINKS.map((l) => ({
    label: l.label,
    onClick: () => {
      if (l.path !== activePath) navigate(l.path)
    },
    active: l.path === activePath,
    badge: l.path === '/timeline' && timelineHasNewEvent ? 1 : undefined,
  }))

  return [...sectionItems, ...pageItems]
}
