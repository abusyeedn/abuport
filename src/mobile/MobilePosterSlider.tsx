/**
 * MobilePosterSlider.tsx
 *
 * Mobile-only stand-in for desktop's "My posters" CircularGallery (a WebGL/
 * OGL canvas built for a wide horizontal desktop strip). Same poster images,
 * a plain swipeable carousel instead - true infinite loop (the item list is
 * tripled and the scroll position silently wraps around the middle copy),
 * center slide highlighted via a CSS `scale` transform rather than resizing
 * the slide's own box - resizing the box was what caused the previous
 * version to visibly jump up/down as neighbouring slides reflowed on every
 * swipe. Both the Arabic caption and its translation are always shown (not
 * just the active slide) so nothing pops in/out and shifts layout.
 */
import { useEffect, useRef, useState } from 'react'
import { FONTS, MOBILE_TYPE, COLORS } from '../theme'

export type PosterItem = { image: string; text: string }

const SLIDE_WIDTH_VW = 58
const SIDE_PAD_VW = (100 - SLIDE_WIDTH_VW) / 2
const GAP = 14
const IMAGE_HEIGHT = 280

export default function MobilePosterSlider({ items }: { items: PosterItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const n = items.length
  const loop = [...items, ...items, ...items]

  // Land in the middle copy on mount so wrapping in either direction always
  // has real slides on both sides to scroll into.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const target = el.children[n] as HTMLElement | undefined
    if (target) el.scrollLeft = target.offsetLeft - (el.clientWidth - target.clientWidth) / 2
  }, [n])

  useEffect(() => {
    const el = trackRef.current
    if (!el || n === 0) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const center = el.scrollLeft + el.clientWidth / 2
        let closest = 0
        let closestDist = Infinity
        Array.from(el.children).forEach((c, i) => {
          const child = c as HTMLElement
          const childCenter = child.offsetLeft + child.offsetWidth / 2
          const dist = Math.abs(childCenter - center)
          if (dist < closestDist) { closestDist = dist; closest = i }
        })
        setActive(((closest % n) + n) % n)

        // Silently recentre into the middle copy once the visitor drifts
        // into the first or last copy - same content on both sides, so the
        // jump is invisible.
        const oneSetWidth = el.scrollWidth / 3
        if (el.scrollLeft < oneSetWidth * 0.5) el.scrollLeft += oneSetWidth
        else if (el.scrollLeft > oneSetWidth * 2.5) el.scrollLeft -= oneSetWidth
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [n])

  return (
    <div>
      <div
        ref={trackRef}
        style={{
          display: 'flex', alignItems: 'center', gap: GAP,
          overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
          padding: `0 ${SIDE_PAD_VW}vw`,
          scrollbarWidth: 'none',
        } as React.CSSProperties}
        className="mobile-poster-track"
      >
        {loop.map((item, i) => {
          const isActive = ((i % n) + n) % n === active
          const [ar, en] = item.text.split('\n')
          return (
            <div
              key={i}
              style={{
                flexShrink: 0, width: `${SLIDE_WIDTH_VW}vw`, scrollSnapAlign: 'center',
                transform: isActive ? 'scale(1)' : 'scale(0.8)',
                opacity: isActive ? 1 : 0.5,
                transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease',
              }}
            >
              <div style={{ width: '100%', height: IMAGE_HEIGHT, borderRadius: 16, overflow: 'hidden' }}>
                <img src={item.image} alt={en || ar} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ marginTop: '0.85rem', textAlign: 'center', padding: '0 0.5rem' }}>
                <p dir="rtl" style={{ margin: 0, fontFamily: "'Noto Naskh Arabic', 'Segoe UI', sans-serif", fontSize: MOBILE_TYPE.md, color: COLORS.textPrimary }}>
                  {ar}
                </p>
                <p style={{ margin: '3px 0 0', fontFamily: FONTS.body, fontSize: MOBILE_TYPE.xs, color: COLORS.textMuted }}>
                  {en}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <style>{`.mobile-poster-track::-webkit-scrollbar { display: none; }`}</style>
    </div>
  )
}
