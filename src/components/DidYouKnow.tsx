import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FONTS } from '../theme'

export const DID_YOU_KNOW_FACTS = [
  "Abu started his career in Design Operations before growing into a Product Designer.",
  'Abu likes Lebanese singer "Marwan Khoury".',
  "Abu shipped 50+ features across events, communities, AI, payments, and organizer tools.",
  "Abu independently owned the Events Listing module from concept to production.",
  "Abu enjoys wearing both the Product Designer and Product Manager hat.",
  "Abu believes every feature should solve a real business problem.",
  "Abu has worked on products that supported ₹5 Cr+ in event revenue.",
  "Abu helped power 5,000+ paid bookings through product improvements.",
  "Abu built a notification-based inventory sync solution without third-party APIs.",
  "Abu loves simplifying complex workflows into intuitive user experiences.",
  "Abu prefers building products over designing screens.",
  "Abu has taken features from brainstorming to production release.",
  "Abu collaborates closely with engineering to make ideas production-ready.",
  "Abu enjoys writing product logic as much as designing interfaces.",
  "Abu has designed experiences for both end users and event organizers.",
  "Abu naturally gravitates toward solving operational challenges.",
  "Abu reached Kynhood with a LinkedIn message after discovering it during competitor research.",
  "Abu only takes a sick leave when he's actually sick.",
  "Abu believes the best UX is the one users never have to think about.",
  "Abu is curious by nature and always asks \"Why?\" before \"How?\"",
  "Abu loves turning ambiguous ideas into shipped products.",
  "Abu has been working since his sophomore year.",
  "Abu shipped his first MVP using Framer — no engineering needed.",
  "Abu grew Kynhood's retention from 10% to 31% in 8 months.",
]

interface DidYouKnowProps {
  labelColor?: string
  textColor?: string
}

export default function DidYouKnow({ labelColor, textColor }: DidYouKnowProps) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * DID_YOU_KNOW_FACTS.length))

  useEffect(() => {
    const cycle = setInterval(() => setIndex(i => (i + 1) % DID_YOU_KNOW_FACTS.length), 4500)
    return () => clearInterval(cycle)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{
        fontSize: '0.65rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: labelColor ?? 'rgba(0,0,0,0.35)',
        fontFamily: FONTS.primary,
      }}>
        Did you know
      </span>
      <div style={{ overflow: 'hidden', minHeight: '1.4em' }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              margin: 0,
              fontSize: '0.88rem',
              color: textColor ?? 'rgba(0,0,0,0.7)',
              fontStyle: 'italic',
              lineHeight: 1.5,
              fontFamily: FONTS.primary,
            }}
          >
            "{DID_YOU_KNOW_FACTS[index]}"
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
