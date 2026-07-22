import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { kynhoodHighlights } from '../data/kynhoodHighlights'
import { FONTS } from '../theme'

interface KynhoodFoldersProps {
  activeCardDetails: number | null
  setActiveCardDetails: (id: number | null | ((prev: number | null) => number | null)) => void
}

export default function KynhoodFolders({ activeCardDetails, setActiveCardDetails }: KynhoodFoldersProps) {
  const [expandedFolder, setExpandedFolder] = useState<number | null>(0) // Open first by default
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleFolder = (index: number) => {
    setExpandedFolder(prev => prev === index ? null : index)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '38px', width: '100%', margin: '40px 0' }}>
      {kynhoodHighlights.map((folder, index) => {
        const isExpanded = expandedFolder === index
        // Compute tab horizontal alignment
        const tabLeft = isMobile ? '-2px' : `${index * 110}px`

        return (
          <div
            key={folder.id}
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Folder Tab Header */}
            <div
              onClick={() => toggleFolder(index)}
              style={{
                position: 'absolute',
                top: '-34px',
                left: tabLeft,
                height: '34px',
                padding: '0 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: folder.tabColor,
                border: `1.5px solid ${folder.borderColor}`,
                borderBottom: 'none',
                borderRadius: '12px 12px 0 0',
                cursor: 'pointer',
                zIndex: isExpanded ? 5 : 2,
                boxShadow: isExpanded ? '0 -4px 10px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: folder.accentColor,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                {folder.num}. {folder.title.split(' ')[0]}
              </span>
            </div>

            {/* Folder Body Card */}
            <motion.div
              animate={{
                height: isExpanded ? 'auto' : '0px',
                opacity: isExpanded ? 1 : 0.4,
                scale: isExpanded ? 1 : 0.98,
              }}
              initial={index === 0 ? { height: 'auto', opacity: 1, scale: 1 } : { height: '0px', opacity: 0.4, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(20px)',
                border: `1.5px solid ${isExpanded ? folder.borderColor : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '0 24px 24px 24px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
                zIndex: isExpanded ? 4 : 1,
              }}
            >
              {isExpanded && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    width: '100%',
                    minHeight: '260px',
                    alignItems: 'stretch',
                  }}
                >
                  {/* Text Content */}
                  <div
                    style={{
                      flex: 1.2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: isMobile ? '1.75rem' : '2.5rem 3rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            fontWeight: 700,
                            color: folder.accentColor,
                            fontFamily: FONTS.primary,
                          }}
                        >
                          {folder.meta}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontSize: '1.75rem',
                          fontWeight: 700,
                          fontFamily: FONTS.primary,
                          lineHeight: 1.2,
                          color: '#ffffff',
                          margin: '0 0 1rem 0',
                        }}
                      >
                        {folder.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '1rem',
                          color: 'rgba(255, 255, 255, 0.7)',
                          lineHeight: 1.7,
                          fontFamily: FONTS.primary,
                          margin: 0,
                        }}
                      >
                        {folder.body}
                      </p>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                      <button
                        onClick={() => setActiveCardDetails(prev => prev === folder.id ? null : folder.id)}
                        style={{
                          background: activeCardDetails === folder.id ? 'rgba(255,255,255,0.1)' : folder.borderColor,
                          color: '#ffffff',
                          border: activeCardDetails === folder.id ? `1px solid ${folder.borderColor}` : 'none',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontFamily: FONTS.primary,
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {activeCardDetails === folder.id ? 'Hide Case Study ↑' : 'Explore Case Study ↓'}
                      </button>
                    </div>
                  </div>

                  {/* Photo / Graphic Content */}
                  <div
                    style={{
                      flex: 0.8,
                      position: 'relative',
                      overflow: 'hidden',
                      borderLeft: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderTop: isMobile ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: isMobile ? '180px' : 'auto',
                    }}
                  >
                    {folder.hasFigmaLogo ? (
                      <div style={{ background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', minHeight: '200px' }}>
                        <svg width="64" height="64" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 31.0196 19 28.5Z" fill="#1ABCFE"/>
                          <path d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z" fill="#0ACF83"/>
                          <path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z" fill="#FF7262"/>
                          <path d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5Z" fill="#FF9A62"/>
                          <path d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.56408 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5Z" fill="#A259FF"/>
                        </svg>
                      </div>
                    ) : folder.images && folder.images.length > 1 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px', background: 'rgba(0,0,0,0.2)', height: '100%', justifyContent: 'center' }}>
                        {folder.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${folder.title} screen ${idx + 1}`}
                            style={{
                              flex: 1,
                              width: '100%',
                              objectFit: 'cover',
                              borderRadius: '12px',
                              minHeight: '60px',
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      folder.images && folder.images[0] && (
                        <img
                          src={folder.images[0]}
                          alt={folder.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
