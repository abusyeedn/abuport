import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { FONTS } from '../theme'
import Dock from '../components/Dock'
import Footer from '../components/Footer'
import DynamicRenderer from '../components/DynamicRenderer'
import FigmaElement from '../components/FigmaElement'
import PixelSnow from '../components/PixelSnow'

interface MoodboardItem {
  id: string
  type: 'polaroid' | 'sticky' | 'torn' | 'index-card' | 'poster' | 'sticker'
  title?: string
  content?: string | string[]
  image?: string
  rotation: number
  x: number
  y: number
  color?: string
  width?: number
  aspect?: string
}

function TransparentSticker({ src, alt, width, style }: { src: string; alt: string; width: number; style?: React.CSSProperties }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      const crop = 3 // Crop 3px off all borders to remove thin edge line artifacts
      canvas.width = img.width - crop * 2
      canvas.height = img.height - crop * 2
      ctx.drawImage(
        img,
        crop, crop, img.width - crop * 2, img.height - crop * 2,
        0, 0, canvas.width, canvas.height
      )
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imgData.data
      
      // Make dark/black pixels transparent with smooth feathering to prevent jagged black halos
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        
        const brightness = Math.max(r, g, b)
        if (brightness < 48) {
          // Feather the alpha value smoothly between 15 (fully transparent) and 48 (fully opaque)
          const factor = brightness <= 15 ? 0 : (brightness - 15) / 33
          pixels[i + 3] = Math.floor(pixels[i + 3] * factor)
        }
      }
      
      ctx.putImageData(imgData, 0, 0)
      setDataUrl(canvas.toDataURL())
    }
    img.src = src
  }, [src])

  if (!dataUrl) {
    // Show original image while processing
    return <img src={src} alt={alt} style={{ width, ...style }} />
  }

  return (
    <img 
      src={dataUrl} 
      alt={alt} 
      draggable={false} 
      style={{ 
        width, 
        filter: 'drop-shadow(2px 6px 12px rgba(0,0,0,0.18))', 
        display: 'block',
        ...style 
      }} 
    />
  )
}

export default function AboutPage() {
  const navigate = useNavigate()
  
  // Bring card to front when clicked
  const [zIndices, setZIndices] = useState<Record<string, number>>({})
  const [maxZ, setMaxZ] = useState(10)

  const bringToFront = (id: string) => {
    const newMax = maxZ + 1
    setMaxZ(newMax)
    setZIndices(prev => ({ ...prev, [id]: newMax }))
  }

  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#ffffff' // Match homepage background color
    return () => { document.body.style.backgroundColor = prev }
  }, [])

  const items: MoodboardItem[] = [
    {
      id: 'about-gta-sa-poster',
      type: 'poster',
      image: '/gallery/media__1782909692534.jpg',
      title: 'GTA San Andreas',
      rotation: -1.5,
      x: 6,
      y: 12,
      width: 240,
      aspect: '3/4',
    },
    {
      id: 'about-gta-sa-ps2',
      type: 'poster',
      image: '/gallery/media__1782909660341.jpg',
      title: 'GTA San Andreas PS2 Cover',
      rotation: 3.5,
      x: 75,
      y: 42,
      width: 190,
      aspect: '2/3',
    },
    {
      id: 'about-marwan-khoury',
      type: 'polaroid',
      image: '/gallery/media__1782909648164.png',
      title: 'Marwan Khoury 🎶',
      rotation: -3,
      x: 28,
      y: 10,
      width: 210,
      aspect: '2/3',
    },
    {
      id: 'about-znmd-poster',
      type: 'poster',
      image: '/gallery/media__1782909713759.jpg',
      title: 'Zindagi Na Milegi Dobara',
      rotation: -4,
      x: 52,
      y: 10,
      width: 220,
      aspect: '2/3',
    },
    {
      id: 'about-saad-lamjarred',
      type: 'polaroid',
      image: '/gallery/media__1782909734743.png',
      title: 'Saad Lamjarred ✨',
      rotation: 2.5,
      x: 48,
      y: 52,
      width: 200,
      aspect: '2/3',
    },
    {
      id: 'about-sticker-phone',
      type: 'sticker',
      image: '/gallery/media__1782909881916.png',
      rotation: -8,
      x: 6,
      y: 50,
      width: 170,
    },
    {
      id: 'about-sticker-tostco',
      type: 'sticker',
      image: '/gallery/media__1782909890907.png',
      rotation: 6,
      x: 70,
      y: 14,
      width: 130,
    },
    {
      id: 'about-sticker-bomb',
      type: 'sticker',
      image: '/gallery/media__1782909896212.png',
      rotation: -12,
      x: 43,
      y: 14,
      width: 110,
    },
    {
      id: 'about-sticker-can',
      type: 'sticker',
      image: '/gallery/media__1782909905895.png',
      rotation: 14,
      x: 63,
      y: 50,
      width: 120,
    },
    {
      id: 'about-sticker-gun',
      type: 'sticker',
      image: '/gallery/media__1782909934508.png',
      rotation: -5,
      x: 35,
      y: 42,
      width: 160,
    },
    {
      id: 'about-sticky-1',
      type: 'sticky',
      color: '#fbcfe8', // Pastel pink
      title: 'Aesthetic Notes',
      content: [
        '• Responsive interface craft',
        '• Blinking fairy lights dynamic style',
        '• Drag elements disabled per preference',
        '• Interactive music & art curation'
      ],
      rotation: 5,
      x: 8,
      y: 72,
      width: 230,
    },
    {
      id: 'about-torn-1',
      type: 'torn',
      title: 'STUDIO NOTE',
      content: '"Design is not just what it looks like and feels like. Design is how it works. Making walls interactive gives them a life of their own."',
      rotation: -3,
      x: 28,
      y: 70,
      width: 260,
    },
    {
      id: 'about-index-card-1',
      type: 'index-card',
      title: 'PLAYLIST IDEAS',
      content: [
        '1. Marwan Khoury - Kol El Qasayed',
        '2. Marwan Khoury - Kasr El Shawq',
        '3. GTA V Soundtracks - Non-Stop-Pop FM',
        '4. Lo-Fi Beats for UI coding sessions'
      ],
      rotation: 2,
      x: 75,
      y: 10,
      width: 250,
    }
  ]

  // Generating fairy light bulbs
  const lightColors = ['#f43f5e', '#eab308', '#22c55e', '#3b82f6', '#a855f7']
  const lights = Array.from({ length: 24 }).map((_, i) => ({
    color: lightColors[i % lightColors.length],
    delay: `${i * 0.25}s`,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', backgroundColor: '#ffffff', fontFamily: FONTS.primary, overflowX: 'hidden' }}>
      
      {/* Import fonts and animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Playfair+Display:ital,wght@1,400..600&display=swap');
        
        .paper-polaroid {
          background: #ffffff;
          padding: 12px 12px 24px;
          border-radius: 2px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.03);
        }
        
        .paper-sticky {
          box-shadow: 3px 10px 20px rgba(0,0,0,0.06), -2px 0 6px rgba(0,0,0,0.02);
          border-bottom-right-radius: 35px 5px;
        }

        .paper-torn {
          background: #fafaf5;
          padding: 20px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.06);
          position: relative;
        }

        .paper-torn::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          height: 6px;
          background-image: linear-gradient(135deg, transparent 25%, #ffffff 25%), linear-gradient(225deg, transparent 25%, #ffffff 25%);
          background-position: 0 0;
          background-size: 8px 12px;
          background-repeat: repeat-x;
        }
        
        .paper-torn::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          right: 0;
          height: 6px;
          background-image: linear-gradient(45deg, transparent 25%, #ffffff 25%), linear-gradient(315deg, transparent 25%, #ffffff 25%);
          background-position: 0 0;
          background-size: 8px 12px;
          background-repeat: repeat-x;
        }

        .paper-poster {
          background: #000;
          padding: 6px;
          border-radius: 3px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.15), 0 3px 8px rgba(0,0,0,0.08);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .washi-tape {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%) rotate(-1deg);
          width: 90px;
          height: 24px;
          background: rgba(220, 215, 190, 0.45);
          backdrop-filter: blur(1.5px);
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          border-left: 3px dashed rgba(0,0,0,0.08);
          border-right: 3px dashed rgba(0,0,0,0.08);
        }

        .push-pin {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          background: #e11d48;
          border-radius: 50%;
          box-shadow: 0 4px 6px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.4);
          z-index: 10;
        }
        .push-pin::after {
          content: "";
          position: absolute;
          top: 4px;
          left: 4px;
          width: 6px;
          height: 6px;
          background: #be123c;
          border-radius: 50%;
        }

        /* Blinking / Pulsing fairy lights */
        @keyframes pulseLight {
          0%, 100% {
            opacity: 0.35;
            box-shadow: 0 0 2px rgba(255,255,255,0.1);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 12px currentColor, 0 0 20px currentColor;
          }
        }
        .fairy-bulb {
          width: 10px;
          height: 14px;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: pulseLight 1.5s infinite ease-in-out;
          position: relative;
        }
        .fairy-bulb::after {
          content: "";
          position: absolute;
          top: -2px;
          left: 3px;
          width: 4px;
          height: 3px;
          background: #475569;
          border-radius: 1px;
        }
      `}</style>

      {/* Cold sky bluish vignette background + PixelSnow + Grid + Graffiti */}
      <div 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 0, 
          pointerEvents: 'none',
          background: 'radial-gradient(circle at center, rgba(235, 245, 255, 0.5) 0%, rgba(215, 230, 248, 0.8) 60%, rgba(185, 205, 232, 0.95) 100%)'
        }}
      >
        {/* PixelSnow Background Overlay */}
        <PixelSnow 
          color="#ffffff"
          flakeSize={0.008}
          minFlakeSize={1.15}
          pixelResolution={180}
          speed={1.0}
          density={0.28}
          direction={125}
          brightness={0.8}
          variant="snowflake"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />

        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid-about" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d1d5db" strokeWidth="0.4" />
            </pattern>
            <pattern id="grid-about" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid-about)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d1d5db" strokeWidth="0.8" />
            </pattern>
            
            {/* Spray paint fuzzy filter */}
            <filter id="spray-paint" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
              <feDisplacementMap in="blur" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" result="displaced" />
              <feMerge>
                <feMergeNode in="displaced" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Base graph paper grid */}
          <rect width="100%" height="100%" fill="url(#grid-about)" />
          
          {/* Red spray painted graffiti heart (top middle-right) */}
          <g filter="url(#spray-paint)" opacity="0.6">
            <path d="M 520,180 C 490,130 440,150 440,200 C 440,250 520,300 520,320 C 520,300 600,250 600,200 C 600,150 550,130 520,180 Z" fill="#ec4899" />
            <circle cx="520" cy="180" r="15" fill="#f472b6" opacity="0.4" />
          </g>

          {/* Neon green sprayed crown tag (top-left) */}
          <g filter="url(#spray-paint)" opacity="0.5">
            <path d="M 80,180 L 110,210 L 140,170 L 170,210 L 200,180 L 190,240 L 90,240 Z" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="80" y1="180" x2="80" y2="182" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" />
            <line x1="140" y1="170" x2="140" y2="172" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" />
            <line x1="200" y1="180" x2="200" y2="182" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" />
          </g>

          {/* Yellow spray painted "CREATIVE" tag (bottom center) */}
          <g filter="url(#spray-paint)" opacity="0.45" transform="rotate(-3, 600, 580)">
            <text x="360" y="600" fontFamily="Impact, sans-serif" fontSize="64" fill="#eab308" letterSpacing="6">CREATIVE</text>
            {/* Drips */}
            <path d="M 370,610 L 370,640" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
            <path d="M 450,610 L 450,655" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
            <path d="M 580,610 L 580,645" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Serial Blinking Fairy Lights string */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '40px', zIndex: 5, pointerEvents: 'none', display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
        {/* String wire */}
        <div style={{ position: 'absolute', top: '0', left: 0, right: 0, height: '8px', borderBottom: '1px solid #334155', borderRadius: '50% / 0 0 8px 8px', opacity: 0.6 }} />
        
        {lights.map((bulb, bi) => (
          <div key={bi} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px' }}>
            <div 
              className="fairy-bulb" 
              style={{ 
                backgroundColor: bulb.color, 
                color: bulb.color,
                animationDelay: bulb.delay 
              }} 
            />
          </div>
        ))}
      </div>

      {/* Header Info */}
      <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem 2.5rem 0', maxWidth: '600px' }}>
        <FigmaElement figmaId="about-header-section" style={{ display: 'block', width: 'max-content', position: 'relative' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>About Me</h1>
          <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
            A visual collection of inspiration, musical influences, and design work.
          </p>
        </FigmaElement>
      </div>

      {/* Interactive Canvas Workspace (Drag enabled when entering Edit Mode via FigmaElement wrapper) */}
      <div 
        style={{ 
          flex: 1, 
          position: 'relative', 
          zIndex: 1, 
          width: '100%', 
          height: '100%', 
          minHeight: '800px',
          padding: '2rem',
          boxSizing: 'border-box'
        }}
      >
        {items.map((item) => {
          const zIndex = zIndices[item.id] || 2;
          const isPolaroid = item.type === 'polaroid';
          const isSticky = item.type === 'sticky';
          const isTorn = item.type === 'torn';
          const isIndex = item.type === 'index-card';
          const isPoster = item.type === 'poster';
          const isSticker = item.type === 'sticker';

          return (
            <FigmaElement
              key={item.id}
              figmaId={item.id}
              onClick={() => bringToFront(item.id)}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${item.width || 240}px`,
                zIndex,
                transform: `rotate(${item.rotation}deg)`,
                userSelect: 'none',
                overflow: 'visible'
              }}
            >
              {/* Washi tape on top of Polaroids and Posters */}
              {(isPolaroid || isPoster) && <div className="washi-tape" />}
              
              {/* Push Pin on Torn / Index cards */}
              {(isTorn || isIndex) && <div className="push-pin" />}

              {isPolaroid && (
                <div className="paper-polaroid">
                  <div style={{ 
                    position: 'relative', 
                    overflow: 'hidden', 
                    background: '#f8f8f8', 
                    aspectRatio: item.aspect || '1/1', 
                    marginBottom: '14px', 
                    borderRadius: '1px' 
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <p style={{ 
                    fontFamily: 'Caveat, cursive', 
                    fontSize: '1.25rem', 
                    color: '#334155', 
                    margin: 0, 
                    textAlign: 'center',
                    transform: 'rotate(-0.5deg)'
                  }}>
                    {item.title}
                  </p>
                </div>
              )}

              {isPoster && (
                <div className="paper-poster" style={{ width: '100%' }}>
                  <div style={{ 
                    position: 'relative', 
                    overflow: 'hidden', 
                    width: '100%', 
                    aspectRatio: item.aspect || '2/3' 
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      draggable={false}
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                </div>
              )}

              {isSticker && item.image && (
                <TransparentSticker 
                  src={item.image} 
                  alt="Creative Sticker" 
                  width={item.width || 120} 
                />
              )}

              {isSticky && (
                <div 
                  className="paper-sticky" 
                  style={{ 
                    background: item.color || '#fef08a', 
                    padding: '20px', 
                    border: '1px solid rgba(0,0,0,0.03)' 
                  }}
                >
                  {item.title && (
                    <h3 style={{ 
                      fontFamily: 'Caveat, cursive', 
                      fontSize: '1.4rem', 
                      color: '#1e293b', 
                      margin: '0 0 10px', 
                      fontWeight: 700,
                      borderBottom: '1px dashed rgba(0,0,0,0.1)',
                      paddingBottom: '4px'
                    }}>
                      {item.title}
                    </h3>
                  )}
                  {Array.isArray(item.content) ? (
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {item.content.map((bullet, bi) => (
                        <li key={bi} style={{ fontFamily: 'Caveat, cursive', fontSize: '1.1rem', color: '#334155', lineHeight: 1.25 }}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontFamily: 'Caveat, cursive', fontSize: '1.1rem', color: '#334155', margin: 0, lineHeight: 1.3 }}>
                      {item.content}
                    </p>
                  )}
                </div>
              )}

              {isTorn && (
                <div className="paper-torn">
                  {item.title && (
                    <span style={{ 
                      fontSize: '0.62rem', 
                      fontWeight: 700, 
                      color: '#94a3b8', 
                      letterSpacing: '0.12em', 
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      {item.title}
                    </span>
                  )}
                  <p style={{ 
                    fontFamily: '"Playfair Display", serif', 
                    fontStyle: 'italic',
                    fontSize: '0.92rem', 
                    color: '#1e293b', 
                    lineHeight: 1.6, 
                    margin: 0 
                  }}>
                    {item.content}
                  </p>
                </div>
              )}

              {isIndex && (
                <div 
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderTop: '3px double #3b82f6', // Blue line on top of index card
                    borderRadius: '4px',
                    padding: '16px 20px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
                    backgroundImage: 'repeating-linear-gradient(rgba(0,0,0,0) 0px, rgba(0,0,0,0) 23px, #e2e8f0 24px)',
                    lineHeight: '24px'
                  }}
                >
                  <h4 style={{ margin: '0 0 10px', fontSize: '0.72rem', fontWeight: 800, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {item.title}
                  </h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                    {Array.isArray(item.content) && item.content.map((line, li) => (
                      <li key={li} style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </FigmaElement>
          )
        })}
      </div>

      <DynamicRenderer />
      
      <Dock
        items={[
          { icon: <Icon icon="solar:arrow-left-outline" width={22} color="#1e293b" />, label: 'Back', onClick: () => navigate(-1) },
          { icon: <Icon icon="solar:home-2-outline" width={22} color="#1e293b" />, label: 'Home', onClick: () => navigate('/') },
          { icon: <Icon icon="solar:file-outline" width={22} color="#1e293b" />, label: 'Resume', onClick: () => navigate('/resume') },
          { icon: <Icon icon="solar:user-outline" width={22} color="#1e293b" />, label: 'About me', onClick: () => navigate('/about') },
        ]}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />
      <Footer />
    </div>
  )
}
