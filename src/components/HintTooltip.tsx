import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor } from '../EditorContext';
import { FONTS } from '../theme';

export interface HintTooltipProps {
  text: string;
  arrowStyle?: 'straight' | 'curved' | 'scribble';
  arrowPosition?: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
  color?: string;
  animationType?: 'pop' | 'blur' | 'slide-left' | 'slide-right' | 'fade';
  showArrow?: boolean;
  fontWeight?: number;
}

export default function HintTooltip({
  text,
  arrowStyle = 'curved',
  arrowPosition = 'right',
  delay = 0,
  color = '#000',
  animationType = 'fade',
  showArrow = true,
  fontWeight = 400,
}: HintTooltipProps) {
  useEditor();

  // Render different SVG arrows based on style
  const renderArrow = () => {
    switch (arrowStyle) {
      case 'straight':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        );
      case 'scribble':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12c3-4 7-6 11-2 2 2 1 5-2 6s-4-2-2-5c1-2 4-2 7 0" />
            <path d="M15 15l2-4-4-2" />
          </svg>
        );
      case 'curved':
      default:
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12c4-4 8-4 14 0" />
            <path d="M15 8l4 4-4 4" />
          </svg>
        );
    }
  };

  // Determine flex direction and rotation based on placement
  const getFlexDirection = () => {
    switch (arrowPosition) {
      case 'left': return 'row-reverse';
      case 'top': return 'column-reverse';
      case 'bottom': return 'column';
      case 'right': 
      default: return 'row';
    }
  };

  const getArrowRotation = () => {
    switch (arrowPosition) {
      case 'left': return 'rotate(180deg)';
      case 'top': return 'rotate(-90deg)';
      case 'bottom': return 'rotate(90deg)';
      case 'right': 
      default: return 'rotate(0deg)';
    }
  };

  const getAnimationConfig = () => {
    switch (animationType) {
      case 'pop':
        return {
          initial: { opacity: 0, scale: 0 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0 },
          transition: { type: "spring", stiffness: 120, damping: 10, mass: 0.8, delay } as any
        };
      case 'blur':
        return {
          initial: { opacity: 0, filter: 'blur(12px)' },
          animate: { opacity: 1, filter: 'blur(0px)' },
          exit: { opacity: 0, filter: 'blur(12px)' },
          transition: { duration: 0.6, ease: 'easeInOut' as any, delay }
        };
      case 'slide-left':
        return {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -50 },
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any, delay }
        };
      case 'slide-right':
        return {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 50 },
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any, delay }
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, filter: 'blur(5px)', scale: 0.9 },
          transition: { duration: 0.4, ease: 'easeOut' as any, delay }
        };
    }
  };

  const anim = getAnimationConfig();

  return (
    <AnimatePresence>
      <motion.div
          initial={anim.initial}
          whileInView={anim.animate}
          viewport={{ once: true, amount: 0.1 }}
          exit={anim.exit}
          transition={anim.transition}
          style={{
            display: 'flex',
            flexDirection: getFlexDirection(),
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            color: color,
          }}
        >
          <span style={{
            fontFamily: FONTS.primary,
            fontSize: '28px',
            fontWeight,
            whiteSpace: 'normal',
            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            {text.split(/\r?\n|\\n|\/n/).map((line, idx, arr) => (
              <React.Fragment key={idx}>
                {line}
                {idx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
          {showArrow && (
            <div style={{
              transform: getArrowRotation(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {renderArrow()}
            </div>
          )}
        </motion.div>
    </AnimatePresence>
  );
}
