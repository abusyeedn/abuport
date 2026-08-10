import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlyingEnvelopeProps {
  startRect: DOMRect;
  onComplete: () => void;
}

// Mail slot on /gallery/home/post.png, measured directly from the pixel data:
// bounding box (440,340)-(494,404) in the 1200x1200 source image.
const SLOT_X_FRAC = (440 + 494) / 2 / 1200 // ~0.389 - left of center, not centered
const SLOT_Y_FRAC = (340 + 404) / 2 / 1200 // ~0.31

export default function FlyingEnvelope({ startRect, onComplete }: FlyingEnvelopeProps) {
  // Lazy initializer reads the DOM once on first render - safe in a browser SPA.
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
          top: endRect.top + endRect.height * SLOT_Y_FRAC - startRect.height / 2, // actual mail slot, measured from the image
          left: endRect.left + endRect.width * SLOT_X_FRAC - startRect.width / 2,
          scale: 0.3, // shrink down to slot size as it goes in
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
          src="/gallery/home/envelope.png" 
          alt="Flying Envelope" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
