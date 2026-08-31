// Shared visual chrome for the token-specimen tables/cards used across every
// "design system" case study (Kynhood Style Guide, Neighbourhood Design
// System, Spark Design System). Each one documents a different underlying
// system with its own type scale/colors/spacing values, but the *container*
// - border, radius, background, row dividers - was three different bespoke
// implementations before this. Import these instead of hand-rolling another
// one, so a fourth "design system" case study doesn't drift again.
import type { CSSProperties } from 'react'

/** Outer card wrapping a token table or specimen grid - white background,
 *  a real border, and a consistent radius, so it always reads as one
 *  distinct documentation block. */
export const dsCardStyle: CSSProperties = {
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  background: '#ffffff',
}

/** One row inside a dsCardStyle table. Pass `isLast` to drop the divider on
 *  the final row. */
export function dsRowStyle(isLast: boolean): CSSProperties {
  return {
    padding: '14px 18px',
    borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
  }
}

/** Small monospace meta label used for token names/sizes in the left column
 *  of a row (e.g. "web-heading-large", "font.size.400"). */
export const dsRowMetaStyle: CSSProperties = {
  fontSize: '0.65rem',
  color: 'var(--color-text-muted-light)',
}
