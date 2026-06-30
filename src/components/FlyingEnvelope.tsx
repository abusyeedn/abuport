import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlyingEnvelopeProps {
  startRect: DOMRect;
  onComplete: () => void;
}

export default function FlyingEnvelope({ startRect, onComplete }: FlyingEnvelopeProps) {
  // Lazy initializer reads the DOM once on first render — safe in a browser SPA.
  const [endRect] = useState<DOMRect | null>(() => {
    const el = document.querySelector('[data-figma-id="post-image"]');
    return el ? el.getBoundingClientRect() : null;
  });

  // If post box isn't on screen, bail out.
  useEffect(() => {
    if (!endRect) onComplete();
  }, [endRect, onComplete]);

  if (!endRect) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          position: 'fixed',
          top: startRect.top,
          left: startRect.left,
          width: startRect.width,
          height: startRect.height,
          opacity: 1,
          scale: 1,
          zIndex: 9999,
        }}
        animate={{
          top: endRect.top + endRect.height * 0.25 - startRect.height / 2, // Approximate mouth of post box
          left: endRect.left + endRect.width / 2 - startRect.width / 2,
          scale: 0.4, // shrink slightly as it goes into the postbox
          opacity: 1, // do not fade
        }}
        transition={{
          duration: 1.2,
          ease: 'easeOut', // smooth easing to the target
        }}
        onAnimationComplete={() => {
          // Dispatch custom event to show success message over the post box
          window.dispatchEvent(new CustomEvent('post-receive'));
          onComplete();
        }}
        style={{ pointerEvents: 'none' }}
      >
        <img 
          src="/gallery/envelope.png" 
          alt="Flying Envelope" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
