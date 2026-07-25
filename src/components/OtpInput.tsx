import { useRef, useEffect } from 'react'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete: () => void
  hasError?: boolean
  autoFocus?: boolean
  theme?: 'dark' | 'light'
}

// Segmented numeric-code input — one box per digit, auto-advancing focus,
// paste support, and backspace-to-previous. Used everywhere on the site that
// gates content behind a numeric access code.
export default function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  hasError = false,
  autoFocus = false,
  theme = 'dark',
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  useEffect(() => {
    if (autoFocus) inputRefs.current[0]?.focus()
  }, [autoFocus])

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice()
    next[index] = digit
    const joined = next.join('')
    onChange(joined)
    if (digit && index < length - 1) inputRefs.current[index + 1]?.focus()
    if (joined.length === length && next.every(d => d !== '')) onComplete()
  }

  const handleChange = (index: number, raw: string) => {
    const digitsOnly = raw.replace(/\D/g, '')
    if (!digitsOnly) {
      setDigit(index, '')
      return
    }
    if (digitsOnly.length > 1) {
      // Pasted or fast-typed multiple digits — spread across boxes from here on.
      const next = digits.slice()
      for (let i = 0; i < digitsOnly.length && index + i < length; i++) {
        next[index + i] = digitsOnly[i]
      }
      const joined = next.join('')
      onChange(joined)
      const lastFilled = Math.min(index + digitsOnly.length, length) - 1
      inputRefs.current[lastFilled]?.focus()
      if (joined.length === length && next.every(d => d !== '')) onComplete()
      return
    }
    setDigit(index, digitsOnly)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < length - 1) inputRefs.current[index + 1]?.focus()
    if (e.key === 'Enter' && digits.every(d => d !== '')) onComplete()
  }

  const isDark = theme === 'dark'

  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          aria-label={`Digit ${i + 1} of ${length}`}
          style={{
            width: '38px',
            height: '46px',
            textAlign: 'center',
            fontSize: '1.15rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            transition: 'border var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out)',
            border: hasError
              ? '1px solid rgba(239,68,68,0.6)'
              : isDark ? '1px solid rgba(255,255,255,0.14)' : '1px solid var(--color-border)',
            background: hasError
              ? 'rgba(239,68,68,0.08)'
              : isDark ? 'rgba(255,255,255,0.06)' : '#fff',
            color: isDark ? '#ffffff' : 'var(--color-text-primary)',
          }}
        />
      ))}
    </div>
  )
}
