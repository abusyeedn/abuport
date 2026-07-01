/**
 * InvestigationWall.tsx
 *
 * Top-level orchestrator for the Crime Investigation Wall experience.
 *
 * Composes: World + FlashlightOverlay + DustParticles + CameraController + Dock
 * Hides cursor over the canvas, restores cursor over interactive Dock component.
 */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import World from './World'
import FlashlightOverlay from './FlashlightOverlay'
import DustParticles from './DustParticles'
import useCameraController from './useCameraController'
import Dock from '../Dock'
import CaseProgressHUD from './CaseProgressHUD'
import CaseObjective from './CaseObjective'
import IntroSequence from './IntroSequence'
import FinaleSequence from './FinaleSequence'
import CaseTransitionOverlay from './CaseTransitionOverlay'
import NewCaseObjectiveModal from './NewCaseObjectiveModal'
import MusicController from './MusicController'
import { GameStateProvider, useGameState } from './useGameState'
import { caseFiles, case01Clues } from '../../data/caseFileData'
import './investigation.css'

function InvestigationContent() {
  const navigate = useNavigate()
  const worldRef = useRef<HTMLDivElement>(null)
  
  const { currentCase, introSeen } = useGameState()

  // Dock visibility state
  const [isDockActive, setIsDockActive] = useState(true)
  const isHoveringRef = useRef(false)

  // Viewport dimensions
  const [viewport, setViewport] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1440,
    h: typeof window !== 'undefined' ? window.innerHeight : 900,
  }))

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Start camera
  const { navigateToZone } = useCameraController(worldRef, viewport.w, viewport.h)

  // When currentCase changes, snap camera to that zone
  useEffect(() => {
    if (!introSeen || currentCase === 0) return
    const activeCase = caseFiles.find(c => c.id === currentCase)
    if (activeCase) {
      if (currentCase === 1) {
        // Initial landing layout
        navigateToZone(
          activeCase.zone.x + activeCase.zone.width / 2, 
          activeCase.zone.y + activeCase.zone.height / 2,
          0.7
        )

        // After 1 second, zoom in to focus on the first clue card
        const timer = setTimeout(() => {
          const firstClue = case01Clues[0]
          if (firstClue) {
            navigateToZone(
              activeCase.zone.x + firstClue.x + firstClue.width / 2,
              activeCase.zone.y + firstClue.y + firstClue.height / 2,
              1.3
            )
          }
        }, 1000)

        return () => clearTimeout(timer)
      } else if (currentCase === 2) {
        // Zoom out slightly for Case 2 to make connecting dots easy
        navigateToZone(
          activeCase.zone.x + activeCase.zone.width / 2, 
          activeCase.zone.y + activeCase.zone.height / 2,
          0.65
        )
      } else {
        // Normal zone pan for other cases
        navigateToZone(
          activeCase.zone.x + activeCase.zone.width / 2, 
          activeCase.zone.y + activeCase.zone.height / 2,
          0.8
        )
      }
    } else if (currentCase === 8) {
      // Zoom out fully to show the entire board at the end of the investigation
      navigateToZone(2500, 2000, 0.28)
    }
  }, [currentCase, introSeen, navigateToZone])

  // ESC to exit
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  // Pull down dock after 2 seconds on landing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isHoveringRef.current) {
        setIsDockActive(false)
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Body overrides on mount
  useEffect(() => {
    const prevBg = document.body.style.backgroundColor
    const prevOverflow = document.body.style.overflow
    document.body.style.backgroundColor = '#0a0a0a'
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.backgroundColor = prevBg
      document.body.style.overflow = prevOverflow
    }
  }, [])

  const cursorStyle = currentCase === 3 ? 'default' : 'none'

  return (
    <div className="investigation-container" style={{ cursor: cursorStyle }}>
      {/* Intro cinematic */}
      <IntroSequence />

      {/* Finale cinematic */}
      <FinaleSequence />

      {/* Transition panel */}
      <CaseTransitionOverlay />

      {/* New Case Dossier Objective Modal */}
      <NewCaseObjectiveModal />

      {/* Background Audio Soundtrack Controller */}
      <MusicController />

      {/* Viewport — clips the world */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          background: '#0a0a0a',
        }}
      >
        <World worldRef={worldRef} />
      </div>

      {/* Flashlight beam */}
      <FlashlightOverlay />

      {/* Dust motes */}
      <DustParticles />

      {/* UI Overlays */}
      {introSeen && currentCase !== 8 && (
        <>
          <CaseProgressHUD />
          <CaseObjective />
        </>
      )}

      {/* HUD — controls hint */}
      <div className="investigation-hud">
        <div className="investigation-hud-controls">
          <div className="investigation-key-group">
            <span className="investigation-key">W</span>
          </div>
          <div className="investigation-key-group">
            <span className="investigation-key">A</span>
            <span className="investigation-key">S</span>
            <span className="investigation-key">D</span>
          </div>
          <span className="investigation-hint">Move Camera</span>
        </div>

        <div className="investigation-hud-controls">
          <div className="investigation-key-group" style={{ height: '28px', alignItems: 'center' }}>
            <span className="investigation-key">Q</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>/</span>
            <span className="investigation-key">E</span>
          </div>
          <div className="investigation-key-group" style={{ height: '28px', alignItems: 'center', fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
            [SCROLL]
          </div>
          <span className="investigation-hint">Zoom Wall</span>
        </div>
      </div>

      {/* Film grain overlay */}
      <div className="investigation-grain" />

      {/* Invisible Hover Trigger Zone at the absolute bottom */}
      <div
        onMouseEnter={() => {
          isHoveringRef.current = true
          setIsDockActive(true)
        }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          zIndex: 64,
          pointerEvents: 'auto',
        }}
      />

      {/* Interactive Bottom Layer: Dock */}
      <motion.div 
        onMouseEnter={() => {
          isHoveringRef.current = true
          setIsDockActive(true)
        }}
        onMouseLeave={() => {
          isHoveringRef.current = false
          setIsDockActive(false)
        }}
        animate={{ y: isDockActive ? 0 : 120 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 65, 
          cursor: 'default',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.6) 60%, transparent 100%)',
          paddingBottom: '24px',
          paddingTop: '32px'
        }}
      >
        <Dock
          items={[
            { icon: <Icon icon="solar:arrow-left-outline" width={22} color="#f8fafc" />, label: 'Back', onClick: () => navigate(-1) },
            { icon: <Icon icon="solar:home-2-outline" width={22} color="#f8fafc" />, label: 'Home', onClick: () => navigate('/') },
            { icon: <Icon icon="solar:file-outline" width={22} color="#f8fafc" />, label: 'Resume', onClick: () => navigate('/resume') },
            { icon: <Icon icon="solar:user-outline" width={22} color="#f8fafc" />, label: 'About me', onClick: () => navigate('/about') },
          ]}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
          isDark={true}
        />
      </motion.div>
    </div>
  )
}

export default function InvestigationWall() {
  return (
    <GameStateProvider>
      <InvestigationContent />
    </GameStateProvider>
  )
}
