import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FONTS } from '../theme';

export default function Footer() {
  const [time, setTime] = useState('');

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
      height: '60px',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      fontFamily: FONTS.primary,
      fontSize: '13px',
      position: 'relative',
      zIndex: 1000,
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>📍</span>
          <span>சென்னை</span>
          <span style={{ color: '#888' }}>(Chennai)</span>
        </div>

        <div style={{ color: '#aaa', fontVariantNumeric: 'tabular-nums' }}>
          IST: {time}
        </div>

        <div style={{ color: '#888' }}>
          Last updated: 20 June 2026, 20:17 IST
        </div>
      </div>
    </div>
  );
}
