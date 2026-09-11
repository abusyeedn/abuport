/**
 * Seo.tsx
 *
 * Keeps <title>, the description/OG/Twitter tags and <link rel="canonical"> in
 * sync with the current route. index.html already ships correct tags for the
 * home page, so this only matters once the router swaps pages client-side -
 * without it every route would keep reporting the home page's title.
 *
 * Mounted in both the desktop and mobile trees. It renders nothing.
 */
import { useEffect } from 'react'
import { OG_IMAGE, SITE_URL, seoForPath, type SeoEntry } from './seoConfig'

/** Upsert a <meta> tag, matching on `property` (OG) or `name` (everything else). */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

// Route-specific structured data (e.g. the /mentors page's "mentions" list) -
// index.html's Person/WebSite graph stays untouched, this is an extra script
// tag scoped to whichever route is live, removed again when it changes.
const STRUCTURED_DATA_ID = 'route-structured-data'
function setStructuredData(data: SeoEntry['structuredData']) {
  const existing = document.getElementById(STRUCTURED_DATA_ID)
  if (!data) {
    existing?.remove()
    return
  }
  const el = existing ?? document.createElement('script')
  el.id = STRUCTURED_DATA_ID
  el.setAttribute('type', 'application/ld+json')
  el.textContent = JSON.stringify(data)
  if (!existing) document.head.appendChild(el)
}

export function applySeo(pathname: string, entry: SeoEntry = seoForPath(pathname)) {
  const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`

  document.title = entry.title
  setMeta('name', 'description', entry.description)
  setCanonical(url)

  setMeta('property', 'og:title', entry.title)
  setMeta('property', 'og:description', entry.description)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', OG_IMAGE)

  setMeta('name', 'twitter:title', entry.title)
  setMeta('name', 'twitter:description', entry.description)
  setMeta('name', 'twitter:image', OG_IMAGE)

  setStructuredData(entry.structuredData)
}

/**
 * `pathname` is passed in rather than read from useLocation() so this works in
 * the mobile tree too, which renders outside a Router and would otherwise throw.
 */
export default function Seo({ pathname }: { pathname: string }) {
  useEffect(() => {
    applySeo(pathname)
  }, [pathname])

  return null
}
