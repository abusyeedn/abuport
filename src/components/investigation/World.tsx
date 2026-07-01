/**
 * World.tsx
 *
 * The 6000 × 4000 investigation wall world.
 * Renders the corkboard background, decorative items, red strings,
 * and the specific case file zones.
 */
import React from 'react'
import { WORLD_WIDTH, WORLD_HEIGHT, decorativeItems, caseFiles } from '../../data/caseFileData'
import EvidenceCard from './EvidenceCard'
import RedStrings from './RedStrings'
import { useGameState } from './useGameState'

// Case File Zone Components
import Case01_FirstImpression from './cases/Case01_FirstImpression'
import Case02_ConnectTheDots from './cases/Case02_ConnectTheDots'
import Case03_Workspace from './cases/Case03_Workspace'
import Case04_ThinkLikeAbu from './cases/Case04_ThinkLikeAbu'
import Case05_ProjectInvestigation from './cases/Case05_ProjectInvestigation'
import Case06_Journey from './cases/Case06_Journey'
import Case07_RapidProfile from './cases/Case07_RapidProfile'

interface WorldProps {
  worldRef: React.RefObject<HTMLDivElement | null>
}

const World = React.memo(function World({ worldRef }: WorldProps) {
  const { isCaseUnlocked } = useGameState()

  return (
    <div
      ref={worldRef}
      className="investigation-world"
      style={{
        width: WORLD_WIDTH,
        height: WORLD_HEIGHT,
        position: 'absolute',
        top: 0,
        left: 0,
        willChange: 'transform',
      }}
    >
      {/* Corkboard background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(139,90,43,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 30%, rgba(139,90,43,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(100,60,20,0.05) 0%, transparent 50%),
            linear-gradient(135deg, #2a1f14 0%, #1e160e 25%, #2a1f14 50%, #221811 75%, #2a1f14 100%)
          `,
          zIndex: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(180,140,80,0.04) 0%, transparent 2%),
            radial-gradient(circle at 30% 50%, rgba(180,140,80,0.03) 0%, transparent 1%),
            radial-gradient(circle at 50% 10%, rgba(180,140,80,0.05) 0%, transparent 3%),
            radial-gradient(circle at 70% 40%, rgba(180,140,80,0.04) 0%, transparent 2%),
            radial-gradient(circle at 90% 70%, rgba(180,140,80,0.03) 0%, transparent 1.5%),
            radial-gradient(circle at 20% 80%, rgba(180,140,80,0.04) 0%, transparent 2.5%),
            radial-gradient(circle at 60% 90%, rgba(180,140,80,0.03) 0%, transparent 2%)
          `,
          backgroundSize: '400px 400px',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 38px, rgba(0,0,0,0.03) 39px, transparent 40px)',
          backgroundSize: '100% 40px',
        }} />
      </div>

      {/* Decorative scattered items */}
      {decorativeItems.map(item => (
        <EvidenceCard key={item.id} item={item} />
      ))}

      {/* Render Zones */}
      {caseFiles.map(cf => {
        const isUnlocked = isCaseUnlocked(cf.id)
        
        return (
          <div 
            key={cf.id}
            style={{
              position: 'absolute',
              left: cf.zone.x,
              top: cf.zone.y,
              width: cf.zone.width,
              height: cf.zone.height,
              zIndex: 5,
              pointerEvents: isUnlocked ? 'auto' : 'none',
              // Visual debug/placeholder outline for locked zones
              border: isUnlocked ? 'none' : '2px dashed rgba(255,255,255,0.1)',
              background: isUnlocked ? 'none' : 'rgba(0,0,0,0.2)',
              borderRadius: 20,
            }}
          >
            {/* Locked Indicator */}
            {!isUnlocked && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'rgba(255,255,255,0.2)',
                fontSize: 48,
                textAlign: 'center',
                fontFamily: 'monospace',
              }}>
                🔒<br/>
                <span style={{ fontSize: 16, marginTop: 12, display: 'block', letterSpacing: '0.2em' }}>
                  LOCKED
                </span>
              </div>
            )}

            {isUnlocked && cf.id === 1 && <Case01_FirstImpression />}
            {isUnlocked && cf.id === 2 && <Case02_ConnectTheDots />}
            {isUnlocked && cf.id === 3 && <Case03_Workspace />}
            {isUnlocked && cf.id === 4 && <Case04_ThinkLikeAbu />}
            {isUnlocked && cf.id === 5 && <Case05_ProjectInvestigation />}
            {isUnlocked && cf.id === 6 && <Case06_Journey />}
            {isUnlocked && cf.id === 7 && <Case07_RapidProfile />}
          </div>
        )
      })}

      {/* Red string connections between zones */}
      <RedStrings />
    </div>
  )
})

export default World
