import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const SOUNDCLOUD_PLAYLIST_URL = 'https://soundcloud.com/sc-playlists-us/sets/late-night-lofi'

declare global { interface Window { SC?: any } }

interface AudioState {
  isPlaying: boolean
  currentSongName: string
  currentTime: number
  songVersion: number   // increments on every song change (manual or auto)
  togglePlayPause: () => void
  nextSong: () => void
}

const AudioCtx = createContext<AudioState>({
  isPlaying: false,
  currentSongName: 'Loading...',
  currentTime: 0,
  songVersion: 0,
  togglePlayPause: () => {},
  nextSong: () => {},
})

export function useAudio() { return useContext(AudioCtx) }

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSongName, setCurrentSongName] = useState('Loading...')
  const [currentTime, setCurrentTime] = useState(0)
  const [songVersion, setSongVersion] = useState(0)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const widgetRef = useRef<any>(null)
  const readyRef = useRef(false)
  const fadeRafRef = useRef<number | null>(null)

  const fadeVolume = useCallback((start: number, end: number, duration = 800) => {
    if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current)
    const widget = widgetRef.current
    if (!widget) return
    const t0 = performance.now()
    const step = (t: number) => {
      const p = Math.min((t - t0) / duration, 1)
      try { widget.setVolume(start + (end - start) * p) } catch { /* ignore */ }
      if (p < 1) fadeRafRef.current = requestAnimationFrame(step)
    }
    fadeRafRef.current = requestAnimationFrame(step)
  }, [])

  const initWidget = useCallback(() => {
    if (!iframeRef.current || !window.SC) return
    const widget = window.SC.Widget(iframeRef.current)
    widgetRef.current = widget
    widget.bind(window.SC.Widget.Events.READY, () => {
      readyRef.current = true
      widget.setVolume(40)
      widget.getSounds((sounds: any[]) => {
        if (sounds?.length) widget.skip(Math.floor(Math.random() * sounds.length))
      })
      widget.getCurrentSound((s: any) => { if (s?.title) setCurrentSongName(s.title) })
    })
    widget.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true))
    widget.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false))
    widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (d: { currentPosition: number }) => {
      setCurrentTime(Math.floor(d.currentPosition / 1000))
    })
    widget.bind(window.SC.Widget.Events.FINISH, () => {
      widget.getSounds((sounds: any[]) => {
        if (sounds?.length) {
          widget.skip(Math.floor(Math.random() * sounds.length))
          widget.play()
          setSongVersion(v => v + 1)
          setTimeout(() => {
            widget.getCurrentSound((s: any) => { if (s?.title) setCurrentSongName(s.title) })
          }, 400)
        }
      })
    })
  }, [])

  useEffect(() => {
    if (window.SC?.Widget) { initWidget(); return }
    const existing = document.getElementById('sc-widget-api')
    if (existing) { existing.addEventListener('load', initWidget); return }
    const script = document.createElement('script')
    script.id = 'sc-widget-api'
    script.src = 'https://w.soundcloud.com/player/api.js'
    script.async = true
    script.onload = initWidget
    document.body.appendChild(script)
    return () => { if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const togglePlayPause = useCallback(() => {
    const widget = widgetRef.current
    if (!widget || !readyRef.current) return
    if (isPlaying) {
      fadeVolume(40, 0)
      setTimeout(() => widget.pause(), 800)
    } else {
      widget.setVolume(0)
      widget.play()
      fadeVolume(0, 40)
    }
  }, [isPlaying, fadeVolume])

  const nextSong = useCallback(() => {
    const widget = widgetRef.current
    if (!widget || !readyRef.current) return
    fadeVolume(40, 0)
    setTimeout(() => {
      widget.getSounds((sounds: any[]) => {
        if (sounds?.length) {
          widget.skip(Math.floor(Math.random() * sounds.length))
          widget.play()
          fadeVolume(0, 40)
        }
      })
      setTimeout(() => {
        widget.getCurrentSound((s: any) => { if (s?.title) setCurrentSongName(s.title) })
      }, 400)
    }, 800)
  }, [fadeVolume])

  return (
    <AudioCtx.Provider value={{ isPlaying, currentSongName, currentTime, songVersion, togglePlayPause, nextSong }}>
      {/* Persistent hidden iframe — lives at root, never unmounts */}
      <iframe
        ref={iframeRef}
        title="SoundCloud Player"
        width="1" height="1"
        style={{ position: 'fixed', opacity: 0, pointerEvents: 'none', zIndex: -1 }}
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(SOUNDCLOUD_PLAYLIST_URL)}&auto_play=false&show_artwork=false`}
      />
      {children}
    </AudioCtx.Provider>
  )
}
