import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as pdfjsLib from 'pdfjs-dist'
// Vite needs the worker as a resolvable URL it can bundle/serve, rather than
// pdf.js's default of fetching it from a CDN at runtime (which would also
// break offline/self-hosted use).
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { FONTS, MOTION } from '../theme'
import { BRAND_GUIDES } from '../data/brandGuides'
import { useZoomScale } from '../components/ViewportScaler'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

const PAGE_BG = '#F8F6F3'

export default function BrandGuideDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const doc = BRAND_GUIDES.find((d) => d.slug === slug)
  // ViewportScaler applies a CSS zoom to the whole page (~0.8 on most
  // desktop screens) - rendering the canvas at the raw window width would
  // then get visually shrunk back down by that same zoom, leaving a gap at
  // the edges instead of truly filling the screen. Compensating here is the
  // same fix PageTransition uses for `100vh` under zoom.
  const zoomScale = useZoomScale()

  const [pageCanvases, setPageCanvases] = useState<HTMLCanvasElement[]>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // See WritingsPage.tsx for why this matches body's color, not just the div's.
  useEffect(() => {
    const original = document.body.style.backgroundColor
    document.body.style.backgroundColor = PAGE_BG
    return () => { document.body.style.backgroundColor = original }
  }, [])

  // Renders every PDF page to its own canvas at a width matching the content
  // column - a plain scrollable stack of full-bleed page images (Behance-style
  // project page), not a browser PDF viewer with its own toolbar/scrollbar/zoom
  // chrome fighting the page's own scroll.
  useEffect(() => {
    if (!doc) return
    let cancelled = false
    setLoading(true)
    setProgress(0)
    setLoadError(null)
    ;(async () => {
      try {
        // Real progress, not a fake timer, in two genuine phases: the PDF's
        // own byte download (0-50%, via pdf.js's own onProgress) and then
        // segment rendering (50-100%, actual segments drawn / total planned)
        // - same "percentage always matches real work done" rule AppLoader
        // uses for the homepage loader.
        const loadingTask = pdfjsLib.getDocument({ url: doc.file })
        loadingTask.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
          if (!total || cancelled) return
          setProgress(Math.round((loaded / total) * 50))
        }
        const pdf = await loadingTask.promise
        if (cancelled) return
        setProgress(50)
        // Full viewport width, edge to edge - no side padding/margin/max-width
        // cap, unlike the reading-column pages (Writings etc). `clientWidth`
        // (not `innerWidth`, which includes the scrollbar's own width) sets
        // how many pixels to actually raster for crispness; divided by the
        // zoom scale so ViewportScaler's page-wide CSS zoom doesn't shrink
        // the raster below the real screen size. The CSS size is then just
        // `100%` (not a hardcoded px value) so it always matches its full-
        // width parent exactly, with no gap, at any window size - including
        // ones that don't match whatever was measured at render time.
        const targetWidth = document.documentElement.clientWidth / (zoomScale || 1)
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        // Some brand-guide PDFs are a single Figma frame exported as one
        // continuous, very tall page (the whole scrolling layout as one
        // page) rather than paginated normally - Haven's is 595x10072pt, a
        // 0.06 aspect ratio. Scaling that up to fill a wide desktop screen
        // pushes the raster height into the hundreds of thousands of
        // pixels, past the browser's canvas size limit, which is what was
        // corrupting/blanking out the render. Slicing a too-tall page into
        // several safely-sized canvases (each a plain vertical crop of the
        // same full-width render, stacked with no gap so they still read as
        // one continuous image) keeps every page - short or absurdly tall -
        // within a size every browser can actually rasterize.
        const MAX_SEGMENT_HEIGHT = 6000

        // Plan every segment across every page first, so the total count is
        // known upfront and the render-phase percentage is real (segments
        // actually drawn / segments actually planned), not a guess.
        type Job = { page: Awaited<ReturnType<typeof pdf.getPage>>; viewport: ReturnType<Awaited<ReturnType<typeof pdf.getPage>>['getViewport']>; startY: number; segmentHeight: number }
        const jobs: Job[] = []
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) return
          const page = await pdf.getPage(i)
          const baseViewport = page.getViewport({ scale: 1 })
          const scale = (targetWidth / baseViewport.width) * dpr
          const viewport = page.getViewport({ scale })
          const totalHeight = viewport.height
          const segmentCount = Math.max(1, Math.ceil(totalHeight / MAX_SEGMENT_HEIGHT))
          for (let s = 0; s < segmentCount; s++) {
            const startY = s * MAX_SEGMENT_HEIGHT
            const segmentHeight = Math.min(MAX_SEGMENT_HEIGHT, totalHeight - startY)
            jobs.push({ page, viewport, startY, segmentHeight })
          }
        }

        const canvases: HTMLCanvasElement[] = []
        for (let j = 0; j < jobs.length; j++) {
          if (cancelled) return
          const { page, viewport, startY, segmentHeight } = jobs[j]
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = segmentHeight
          canvas.style.width = '100%'
          canvas.style.height = 'auto'
          canvas.style.display = 'block'
          const ctx = canvas.getContext('2d')
          if (ctx) {
            if (startY > 0) ctx.translate(0, -startY)
            await page.render({ canvasContext: ctx, viewport, canvas } as any).promise
          }
          canvases.push(canvas)
          setProgress(50 + Math.round(((j + 1) / jobs.length) * 50))
        }
        if (!cancelled) {
          setPageCanvases(canvases)
          setLoading(false)
        }
      } catch (err) {
        console.error('Brand guide PDF render failed:', err)
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : String(err))
          setLoading(false)
        }
      }
    })()
    return () => { cancelled = true }
  }, [doc])

  if (!doc) {
    navigate('/brand-guide')
    return null
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: PAGE_BG }}>
      {/* No title/label here on purpose - the document's own cover page is
          the first thing rendered below, so a "Haven / Brand guide" heading
          would just be a redundant duplicate of what the PDF already shows. */}
      {(loading || loadError) && (
        <div style={{ paddingTop: '11.5rem' }}>
          {loading && (
            <p style={{ fontFamily: FONTS.body, fontSize: '0.9rem', color: '#5c6b64', margin: 0, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
              Loading… {progress}%
            </p>
          )}
          {loadError && (
            <p style={{ fontFamily: FONTS.body, fontSize: '0.9rem', color: '#b23b3b', margin: 0, textAlign: 'center' }}>
              Couldn't load this document. {loadError}
            </p>
          )}
        </div>
      )}

      {/* Full-bleed, edge to edge - no side padding/margin/max-width, unlike
          the reading column above. Each canvas is already rendered at the
          full viewport width, so this just stacks them with no gap. */}
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: MOTION.easeArray }}
        style={{ display: 'flex', flexDirection: 'column', paddingTop: '7rem', paddingBottom: '6rem' }}
      >
        {pageCanvases.map((canvas, i) => (
          <CanvasImg key={i} canvas={canvas} />
        ))}
      </motion.div>
    </div>
  )
}

// A rendered pdf.js canvas can't be handed to React as a prop directly (it's
// a live DOM node, not serializable JSX) - this just mounts the already-drawn
// canvas element into the tree via a ref, once, instead of re-rendering it.
function CanvasImg({ canvas }: { canvas: HTMLCanvasElement }) {
  const hostRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    host.appendChild(canvas)
    return () => { if (host.contains(canvas)) host.removeChild(canvas) }
  }, [canvas])
  return <div ref={hostRef} style={{ lineHeight: 0 }} />
}
