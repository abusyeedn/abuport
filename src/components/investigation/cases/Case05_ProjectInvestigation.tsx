/**
 * Case05_ProjectInvestigation.tsx
 *
 * Case File 05 — Rendered inside the fifth zone.
 * User clicks on project folders to read investigation details.
 */
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { case05Projects, caseFiles } from '../../../data/caseFileData'
import { useGameState } from '../useGameState'
import CaseFileModal from '../CaseFileModal'

export default function Case05_ProjectInvestigation() {
  const { markClueFound, caseProgress, completeCase, isClueFound } = useGameState()
  
  const caseId = 5
  const caseDef = useMemo(() => caseFiles.find(c => c.id === caseId), [])
  const progress = caseProgress.get(caseId)
  const isSolved = progress?.solved ?? false

  const [activeProject, setActiveProject] = useState<typeof case05Projects[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'problem'|'research'|'challenges'|'iterations'|'solution'|'impact'>('problem')

  const handleOpenFolder = (projectId: string) => {
    const proj = case05Projects.find(p => p.id === projectId)
    if (proj) {
      setActiveProject(proj)
      setActiveTab('problem')
      markClueFound(caseId, projectId)
      
      const currentFoundCount = (progress?.cluesFound.size ?? 0) + (isClueFound(projectId) ? 0 : 1)
      if (!isSolved && caseDef && currentFoundCount >= caseDef.requiredClues) {
        completeCase(caseId)
      }
    }
  }

  const tabs = [
    { id: 'problem', label: 'PROBLEM' },
    { id: 'research', label: 'RESEARCH' },
    { id: 'challenges', label: 'CHALLENGES' },
    { id: 'iterations', label: 'ITERATIONS' },
    { id: 'solution', label: 'SOLUTION' },
    { id: 'impact', label: 'IMPACT' },
  ] as const

  return (
    <>
      {/* Scattered Project Folders */}
      {case05Projects.map((proj, i) => {
        const found = isClueFound(proj.id)
        
        return (
          <motion.div
            key={proj.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenFolder(proj.id)}
            style={{
              position: 'absolute',
              left: 200 + i * 350 + (i%2 * 100),
              top: 300 + (i%2 === 0 ? 100 : 400),
              width: 240,
              height: 320,
              background: '#fef7e0', // Manila folder
              borderRadius: '4px 8px 4px 4px',
              boxShadow: '2px 4px 12px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              padding: 24,
              border: '1px solid rgba(0,0,0,0.1)',
              transform: `rotate(${i % 2 === 0 ? -4 : 3}deg)`,
              zIndex: 10,
            }}
          >
            {/* Folder Tab Fake Element */}
            <div style={{
              position: 'absolute',
              top: -12,
              left: 10,
              width: 100,
              height: 12,
              background: '#fef7e0',
              borderRadius: '4px 4px 0 0',
              border: '1px solid rgba(0,0,0,0.1)',
              borderBottom: 'none',
            }} />
            
            {/* Solved Stamp */}
            {found && (
              <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                color: '#22c55e',
                border: '2px solid #22c55e',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 900,
                transform: 'rotate(-15deg)',
                fontFamily: 'monospace',
                opacity: 0.8
              }}>
                REVIEWED
              </div>
            )}

            <div style={{ fontSize: 48, marginBottom: 16 }}>{proj.emoji}</div>
            
            <div style={{ fontSize: 10, color: '#666', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>
              EXHIBIT: {proj.id.split('-')[1]}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2 }}>
              {proj.name}
            </div>
            
            <div style={{ marginTop: 'auto', fontSize: 12, color: '#dc2626', fontWeight: 600, fontFamily: 'monospace' }}>
              OPEN FOLDER →
            </div>
          </motion.div>
        )
      })}

      {/* Project Folder Modal */}
      <CaseFileModal
        isOpen={!!activeProject}
        onClose={() => setActiveProject(null)}
        title={activeProject?.name}
        subtitle="PROJECT INVESTIGATION"
        isSolved={activeProject ? isClueFound(activeProject.id) : false}
      >
        {activeProject && (
          <div style={{ display: 'flex', gap: 32, minHeight: 400 }}>
            {/* Tabs Sidebar */}
            <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 8, borderRight: '1px solid rgba(0,0,0,0.1)', paddingRight: 24 }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    background: activeTab === tab.id ? '#1a1a1a' : 'transparent',
                    color: activeTab === tab.id ? '#fff' : '#666',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <h3 style={{ fontSize: 16, color: '#666', margin: '0 0 24px 0', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {activeTab}
                  </h3>
                  <p style={{ fontSize: 20, color: '#1a1a1a', lineHeight: 1.6, margin: 0 }}>
                    {activeProject[activeTab]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </CaseFileModal>
    </>
  )
}
