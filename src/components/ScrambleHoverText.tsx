import { useRef, useState } from 'react'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

// react-bits-style "scramble on hover" text effect: on hover, each character
// briefly cycles through random glyphs before resolving back to the real
// text, left to right. Pure setInterval + state, no extra dependency.
export default function ScrambleHoverText({ text, style }: { text: string; style?: React.CSSProperties }) {
  const [display, setDisplay] = useState(text)
  const frame = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    frame.current = 0
    const totalFrames = text.length * 2
    intervalRef.current = setInterval(() => {
      frame.current++
      const revealCount = Math.floor((frame.current / totalFrames) * text.length)
      setDisplay(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' '
            if (i < revealCount) return ch
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
          .join('')
      )
      if (frame.current >= totalFrames) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplay(text)
      }
    }, 28)
  }

  return (
    <span
      onMouseEnter={scramble}
      style={{ ...style, cursor: 'default' }}
    >
      {display}
    </span>
  )
}
