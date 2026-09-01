import { useNavigate, useLocation } from 'react-router-dom'
import type { TopHeaderItemData } from './TopHeader'

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
// Omit it on the homepage, which has no "active" nav item.
export function useSiteNavItems(activePath?: string): TopHeaderItemData[] {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  const sectionItems: TopHeaderItemData[] = SECTION_LINKS.map((l) => ({
    label: l.label,
    onClick: () => (onHome ? scrollToId(l.id) : navigate(`/#${l.id}`)),
    dividerAfter: l.dividerAfter,
  }))

  const pageItems: TopHeaderItemData[] = PAGE_LINKS.map((l) => ({
    label: l.label,
    onClick: () => {
      if (l.path !== activePath) navigate(l.path)
    },
    active: l.path === activePath,
  }))

  return [...sectionItems, ...pageItems]
}
