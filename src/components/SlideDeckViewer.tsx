import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import * as pdfjsLib from 'pdfjs-dist'
// Vite needs the worker as a resolvable URL it can bundle/serve, rather than
// pdf.js's default of fetching it from a CDN at runtime (same fix
// BrandGuideDetailPage.tsx already uses).
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { FONTS } from '../theme'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

// One slide at a time (next/back), not BrandGuideDetailPage's continuous
// scroll - a slide deck reads as discrete slides, not a long document. Every
// page is rendered to its own canvas up front (same real-progress loader
// pattern as BrandGuideDetailPage) so paging between slides is instant
// afterwards, no per-click re-render.
//
// Fullscreen uses the real browser Fullscreen API on this component's own
// container (not a CSS-only fixed overlay) - that's what actually hides the
// browser chrome and is what "left/right should still work in fullscreen"
// means in practice, since the container just keeps rendering in place
// rather than being torn down and rebuilt inside a portal. An earlier
// portal-based version relocated the canvas's host div to a different
// parent on every fullscreen toggle, which unmounted and recreated that div -
// the canvas-attach effect only watched [canvases, index], so it never
// re-ran on that remount, leaving the view blank after returning from
// fullscreen. Keeping one stable container node the whole time removes the
// remount entirely, which is what actually fixes that bug.
export default function SlideDeckViewer({ src }: { src: string }) {
  const [canvases, setCanvases] = useState<HTMLCanvasElement[]>([])
  const [aspectRatio, setAspectRatio] = useState(16 / 9)
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setProgress(0)
    setLoadError(null)
    ;(async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ url: src })
        loadingTask.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
          if (!total || cancelled) return
          setProgress(Math.round((loaded / total) * 50))
        }
        const pdf = await loadingTask.promise
        if (cancelled) return
        setProgress(50)

        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        // Rendered at a fixed, generous width regardless of the panel's own
        // (narrower) content column - CSS scales the canvas back down to fit,
        // so slides still look crisp at fullscreen size instead of blurring
        // up from a render sized to the small inline view.
        const targetWidth = 1400

        const rendered: HTMLCanvasElement[] = []
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return
          const page = await pdf.getPage(i)
          const baseViewport = page.getViewport({ scale: 1 })
          if (i === 1) setAspectRatio(baseViewport.width / baseViewport.height)
          const scale = (targetWidth / baseViewport.width) * dpr
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.width = '100%'
          canvas.style.height = '100%'
          canvas.style.display = 'block'
          const ctx = canvas.getContext('2d')
          if (ctx) await page.render({ canvasContext: ctx, viewport, canvas } as any).promise
          rendered.push(canvas)
          setProgress(50 + Math.round((i / pdf.numPages) * 50))
        }
        if (!cancelled) {
          setCanvases(rendered)
          setLoading(false)
        }
      } catch (err) {
        console.error('Slide deck PDF render failed:', err)
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : String(err))
          setLoading(false)
        }
      }
    })()
    return () => { cancelled = true }
  }, [src])

  const goPrev = () => setIndex((i) => Math.max(0, i - 1))
  const goNext = () => setIndex((i) => Math.min(canvases.length - 1, i + 1))

  // Left/right paging - works identically in and out of fullscreen since the
  // listener lives on window and the container is never torn down. Escape is
  // left to the browser's own native fullscreen-exit handling, not
  // reimplemented here.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvases.length])

  // Keeps our chrome (icon, layout) in sync even when fullscreen is exited
  // by means we don't control directly - the browser's own Escape handling,
  // an OS gesture, or another exit-fullscreen UI - not just our own button.
  useEffect(() => {
    function onFullscreenChange() {
      setFullscreen(document.fullscreenElement === containerRef.current)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current?.requestFullscreen()
    }
  }

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvases[index]
    if (!host || !canvas) return
    host.innerHTML = ''
    host.appendChild(canvas)
  }, [canvases, index])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        background: fullscreen ? '#0a0e0c' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: fullscreen ? 'center' : 'stretch',
        justifyContent: fullscreen ? 'center' : 'flex-start',
        minHeight: fullscreen ? '100vh' : undefined,
        padding: fullscreen ? '2rem' : 0,
      }}
    >
      <div style={{ width: '100%', maxWidth: fullscreen ? 1400 : '100%' }}>
        <div style={{
          position: 'relative', width: '100%', aspectRatio: aspectRatio,
          borderRadius: fullscreen ? 12 : 16, overflow: 'hidden', background: '#0f172a',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }}>
          {(loading || loadError) && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {loading && (
                <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontVariantNumeric: 'tabular-nums' }}>
                  Loading slides… {progress}%
                </span>
              )}
              {loadError && (
                <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: '#f87171', padding: '0 1.5rem', textAlign: 'center' }}>
                  Couldn't load the slide deck. {loadError}
                </span>
              )}
            </div>
          )}
          <div ref={hostRef} style={{ width: '100%', height: '100%', lineHeight: 0 }} />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 0.25rem 0', gap: '1rem',
        }}>
          <button
            onClick={goPrev}
            disabled={index === 0}
            aria-label="Previous slide"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, borderRadius: '50%', border: fullscreen ? '1px solid rgba(255,255,255,0.25)' : '1px solid var(--color-border)',
              background: fullscreen ? 'rgba(255,255,255,0.08)' : '#ffffff',
              color: fullscreen ? '#ffffff' : 'inherit',
              cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.35 : 1,
            }}
          >
            <Icon icon="solar:arrow-left-outline" width={18} />
          </button>

          <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: fullscreen ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {canvases.length > 0 ? `${index + 1} / ${canvases.length}` : ''}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={toggleFullscreen}
              aria-label={fullscreen ? 'Exit fullscreen' : 'View fullscreen'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: '50%', border: fullscreen ? '1px solid rgba(255,255,255,0.25)' : '1px solid var(--color-border)',
                background: fullscreen ? 'rgba(255,255,255,0.08)' : '#ffffff',
                color: fullscreen ? '#ffffff' : 'inherit',
                cursor: 'pointer',
              }}
            >
              <Icon icon={fullscreen ? 'solar:quit-full-screen-square-outline' : 'solar:full-screen-square-outline'} width={18} />
            </button>
            <button
              onClick={goNext}
              disabled={canvases.length === 0 || index >= canvases.length - 1}
              aria-label="Next slide"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: '50%', border: fullscreen ? '1px solid rgba(255,255,255,0.25)' : '1px solid var(--color-border)',
                background: fullscreen ? 'rgba(255,255,255,0.08)' : '#ffffff',
                color: fullscreen ? '#ffffff' : 'inherit',
                cursor: canvases.length === 0 || index >= canvases.length - 1 ? 'default' : 'pointer',
                opacity: canvases.length === 0 || index >= canvases.length - 1 ? 0.35 : 1,
              }}
            >
              <Icon icon="solar:arrow-right-outline" width={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
