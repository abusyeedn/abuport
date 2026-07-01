/**
 * MusicController.tsx
 *
 * Background audio player powered by the SoundCloud Widget API.
 * Maps cases to specific tracks in the Assassin's Creed 2 Soundtrack:
 * - Case 1 / Intro: Ezio's Family (Mysterious, atmospheric)
 * - Case 2 (Connect): Venice Rooftops (Fast, rhythmic)
 * - Case 3 (Workspace): Florence Tarantella (Playful, busy)
 * - Case 4 (Psychology): Approaching Target (Tense, focused)
 * - Case 5 (Projects): Dreams of Venice (Serene, beautiful)
 * - Case 6 (Timeline): Home in Florence (Nostalgic)
 * - Case 7 (Rapid Q&A): Stealth / Action track (High stakes climax)
 * - Case 8 (Finale): Earth (Majestic, celebratory resolution)
 */
import React, { useEffect, useRef, useState } from 'react'
import { useGameState } from './useGameState'
import { Icon } from '@iconify/react'

export default function MusicController() {
  const { currentCase } = useGameState()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const widgetRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [apiLoaded, setApiLoaded] = useState(false)

  // Map case numbers to playlist track indexes
  const getTrackIndexForCase = (caseId: number): number => {
    switch (caseId) {
      case 0:
      case 1:
        return 0 // Ezio's Family
      case 2:
        return 2 // Venice Rooftops
      case 3:
        return 5 // Florence Tarantella / busy track
      case 4:
        return 4 // Home in Florence / psychological
      case 5:
        return 3 // Dreams of Venice / portfolio
      case 6:
        return 9 // Nostalgic journey track
      case 7:
        return 12 // Tense action track
      case 8:
        return 1 // Earth / resolution
      default:
        return 0
    }
  }

  // Load SoundCloud Widget API script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://w.soundcloud.com/player/api.js'
    script.async = true
    script.onload = () => setApiLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Initialize widget when API is loaded
  useEffect(() => {
    if (!apiLoaded || !iframeRef.current) return

    const windowSC = (window as any).SC
    if (windowSC && windowSC.Widget) {
      const widget = windowSC.Widget(iframeRef.current)
      widgetRef.current = widget

      // Sync state with player events
      widget.bind(windowSC.Widget.Events.PLAY, () => {
        setIsPlaying(true)
      })
      widget.bind(windowSC.Widget.Events.PAUSE, () => {
        setIsPlaying(false)
      })

      // Auto play once ready
      widget.bind(windowSC.Widget.Events.READY, () => {
        widget.setVolume(30)
        
        // Select a random track to start
        const randomTrackIndex = Math.floor(Math.random() * 16)
        widget.skip(randomTrackIndex)
        
        // Brief timeout to let the track change complete before calling play
        setTimeout(() => {
          widget.play()
        }, 300)
      })
    }
  }, [apiLoaded])

  // Trigger play on first user interaction to bypass browser restrictions
  useEffect(() => {
    const handleFirstGesture = () => {
      const widget = widgetRef.current
      if (widget && isPlaying) {
        widget.play()
        // Clean up listeners
        window.removeEventListener('click', handleFirstGesture)
        window.removeEventListener('keydown', handleFirstGesture)
      }
    }

    window.addEventListener('click', handleFirstGesture)
    window.addEventListener('keydown', handleFirstGesture)

    return () => {
      window.removeEventListener('click', handleFirstGesture)
      window.removeEventListener('keydown', handleFirstGesture)
    }
  }, [isPlaying, apiLoaded])

  // Handle case changes with Fade Out -> Skip -> Fade In
  useEffect(() => {
    const widget = widgetRef.current
    if (!widget || !isPlaying) return

    const targetTrack = getTrackIndexForCase(currentCase)

    // Fade Out slowly (30 to 0)
    let vol = 30
    const fadeOutInterval = setInterval(() => {
      vol -= 2
      if (vol <= 0) {
        clearInterval(fadeOutInterval)
        widget.setVolume(0)
        
        // Skip to track
        widget.skip(targetTrack)
        
        // Fade In very slowly (0 to 30)
        let newVol = 0
        const fadeInInterval = setInterval(() => {
          newVol += 1
          if (newVol >= 30) {
            clearInterval(fadeInInterval)
            widget.setVolume(30)
          } else {
            widget.setVolume(newVol)
          }
        }, 120) // Very slow fade in
      } else {
        widget.setVolume(vol)
      }
    }, 100) // Slow fade out

    return () => {
      clearInterval(fadeOutInterval)
    }
  }, [currentCase, isPlaying])

  const togglePlayback = () => {
    const widget = widgetRef.current
    if (!widget) return

    if (isPlaying) {
      widget.pause()
      setIsPlaying(false)
    } else {
      widget.play()
      setIsPlaying(true)
      // Make sure we are on the right track index
      widget.skip(getTrackIndexForCase(currentCase))
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      left: 24,
      zIndex: 65,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: 'rgba(15, 15, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '10px 16px',
      borderRadius: 24,
      color: '#fff',
      fontFamily: '"SF Mono", "Fira Code", monospace',
      fontSize: 10,
      letterSpacing: '0.1em',
      cursor: 'default',
      userSelect: 'none',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    }}>
      {/* SoundCloud Player Iframe (Hidden offscreen) */}
      <iframe
        ref={iframeRef}
        id="sc-player"
        src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/kenzie-henderson-1/sets/assassins-creed-2-soundtrack&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false"
        style={{
          position: 'absolute',
          top: -9999,
          left: -9999,
          width: 300,
          height: 100,
          pointerEvents: 'none',
        }}
      />

      <button
        onClick={togglePlayback}
        style={{
          background: isPlaying ? 'rgba(220, 38, 38, 0.2)' : 'rgba(255, 255, 255, 0.06)',
          border: `1px solid ${isPlaying ? 'rgba(220, 38, 38, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
          color: isPlaying ? '#ef4444' : '#fff',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <Icon icon={isPlaying ? 'solar:pause-bold' : 'solar:play-bold'} width={16} />
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 9, color: isPlaying ? '#22c55e' : 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase' }}>
          {isPlaying ? '• PLAYING SOUNDTRACK' : 'SOUNDTRACK MUTED'}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
          Assassin's Creed II OST
        </span>
      </div>
    </div>
  )
}
