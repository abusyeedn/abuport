import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FONTS, COLORS } from '../theme';
import { useZoomScale } from './ViewportScaler';

const MOBILE_BP = 768 // matches the rest of the app's mobile threshold

export default function Footer() {
  const [time, setTime] = useState('');

  // Counter the page's zoom scaling so the footer always renders at true
  // native size — same pattern as Dock.tsx / ChatWidget.tsx / MailModal.tsx —
  // instead of its text shrinking along with the rest of the page.
  const pageZoom = useZoomScale();
  const counterZoom = pageZoom > 0 ? 1 / pageZoom : 1;

  const [width, setWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1440);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isMobile = width < MOBILE_BP;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      };
      setTime(now.toLocaleString('en-IN', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-footer style={{
      height: isMobile ? 'auto' : '60px',
      backgroundColor: COLORS.navy,
      color: COLORS.onAccent,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
      justifyContent: 'space-between',
      gap: isMobile ? '8px' : 0,
      padding: isMobile ? '8px 16px' : '0 2rem',
      fontFamily: FONTS.primary,
      // design.md Type Scale — Captions/footnotes: 0.75rem–0.85rem, 400, line-height 1.5
      fontSize: isMobile ? '0.75rem' : '0.85rem',
      lineHeight: 1.5,
      position: 'relative',
      zIndex: 1000,
      width: '100%',
      boxSizing: 'border-box',
      zoom: counterZoom,
    } as React.CSSProperties}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>made by abu, copilot with antigravity</span>
        {/* Antigravity Logo Animated */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #ff00cc, #3333ff, #00ffcc, #ff00cc)'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '16px' : '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>📍</span>
          <span>சென்னை</span>
          <span style={{ color: COLORS.faint }}>(Chennai)</span>
        </div>

        <div style={{ color: COLORS.faint, fontVariantNumeric: 'tabular-nums' }}>
          IST: {time}
        </div>

        {/* Least essential line — dropped on mobile to keep the footer from
            ballooning in height once it wraps to a stacked layout. */}
        {!isMobile && (
          <div style={{ color: COLORS.faint }}>
            Last updated: 20 June 2026, 20:17 IST
          </div>
        )}
      </div>
    </div>
  );
}
