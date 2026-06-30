import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MailModal from './MailModal';

export default function EnvelopesStack() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const envelopes = Array.from({ length: 5 });
  const rotations = [-10, 5, -5, 8, -3];

  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'relative',
          width: '200px',
          height: '150px',
          cursor: 'pointer'
        }}
      >
        {envelopes.map((_, i) => {
          return (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: i,
              }}
              initial={{ rotate: rotations[i], y: i * -2 }}
              whileHover={{}}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <img 
                src="/gallery/envelope.png" 
                alt="Envelope" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain'
                }} 
              />
            </motion.div>
          );
        })}
      </div>

      <MailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess}
      />
    </>
  );
}
