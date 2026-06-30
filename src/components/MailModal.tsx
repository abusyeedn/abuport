import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FlyingEnvelope from './FlyingEnvelope';
import FigmaElement from './FigmaElement';

interface MailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MailModal({ isOpen, onClose, onSuccess }: MailModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [startRect, setStartRect] = useState<DOMRect | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    // Get the bounding rect of the modal to start the animation from
    if (modalRef.current) {
      setStartRect(modalRef.current.getBoundingClientRect());
    }
    setIsSending(true);
  };

  const handleAnimationComplete = () => {
    setIsSending(false);
    if (onSuccess) {
      onSuccess();
    } else {
      onClose();
    }
  };

  // We use createPortal to render the modal directly in the document body.
  // This prevents it from being trapped inside a parent element with CSS transforms (like FigmaElement).
  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && !isSending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9000,
            }}
            onClick={onClose}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '90vw',
                maxWidth: '900px',
                aspectRatio: '6/5', // keeps the envelope ratio mostly intact
              }}
            >
              {/* The Envelope Background */}
              <img 
                src="/gallery/envelope-opened.png" 
                alt="Opened Envelope" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1,
                  transform: 'scale(1.65)',
                  transformOrigin: 'center'
                }} 
              />
              
              {/* The Form Fields wrapped in FigmaElements for dragging */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                style={{
                  position: 'absolute',
                  top: '-65px',
                  left: '10px',
                  width: '100%',
                  height: '100%',
                  zIndex: 2,
                }}
              >
                <FigmaElement 
                  figmaId="mail-subject"
                  style={{ display: 'block', width: '480px', height: '40px', top: '250px', left: '210px' }}
                >
                  <input 
                    type="text" 
                    placeholder="Subject" 
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: '8px',
                      border: '1px solid rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </FigmaElement>

                <FigmaElement 
                  figmaId="mail-body"
                  style={{ display: 'block', width: '480px', height: '200px', top: '310px', left: '210px' }}
                >
                  <textarea 
                    placeholder="Write your message here..." 
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: '8px',
                      border: '1px solid rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                      resize: 'none',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </FigmaElement>
                
                <FigmaElement 
                  figmaId="mail-buttons"
                  style={{ display: 'flex', width: '480px', height: '40px', top: '530px', left: '210px', justifyContent: 'flex-end', gap: '10px' }}
                >
                  <button 
                    type="button"
                    onClick={onClose}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      color: '#666'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      background: '#007bff',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Send
                  </button>
                </FigmaElement>
              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Flying Envelope Animation Layer */}
      {isSending && startRect && (
        <FlyingEnvelope startRect={startRect} onComplete={handleAnimationComplete} />
      )}
    </>,
    document.body
  );
}
