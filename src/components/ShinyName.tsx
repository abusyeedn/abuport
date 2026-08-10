import { motion } from 'framer-motion'

// react-bits-style "ShinyText" treatment - a soft diagonal light sweep
// looping across the hero name, built with framer-motion + CSS
// background-clip so no extra dependency is needed.
export default function ShinyName({ children, fontSize, dark = false }: { children: React.ReactNode; fontSize: string; dark?: boolean }) {
  const gradient = dark
    ? 'linear-gradient(120deg, #f5f5f5 40%, #555555 50%, #f5f5f5 60%)'
    : 'linear-gradient(120deg, #1a1a1a 40%, #ffffff 50%, #1a1a1a 60%)'
  return (
    <motion.h1
      style={{
        margin: 0,
        fontSize,
        lineHeight: 0.92,
        letterSpacing: '-0.03em',
        fontWeight: 700,
        backgroundImage: gradient,
        backgroundSize: '250% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
      animate={{ backgroundPosition: ['200% 0%', '-100% 0%'] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
    >
      {children}
    </motion.h1>
  )
}
