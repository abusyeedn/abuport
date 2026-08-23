// react-bits-style "ShinyText" treatment - a soft light sweep looping across
// the hero name. Pure CSS @keyframes (not Framer Motion's `animate` prop) so
// the loop is driven by the browser's own animation engine and stays in
// sync regardless of React re-renders - a JS-driven `animate` prop restarts
// its tween whenever the parent re-renders, which is what caused the sweep
// to visibly "stick" partway through instead of always looping start to end.
export default function ShinyName({ children, fontSize, dark = false }: { children: React.ReactNode; fontSize: string; dark?: boolean }) {
  const gradient = dark
    ? 'linear-gradient(120deg, #f5f5f5 40%, #555555 50%, #f5f5f5 60%)'
    : 'linear-gradient(120deg, #1a1a1a 40%, #ffffff 50%, #1a1a1a 60%)'
  return (
    <>
      <h1
        className="shiny-name"
        style={{
          margin: 0,
          fontSize,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          fontWeight: 700,
          backgroundImage: gradient,
          backgroundSize: '250% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {children}
      </h1>
      <style>{`
        @keyframes shiny-name-sweep {
          0% { background-position: 200% 0%; }
          100% { background-position: -100% 0%; }
        }
        .shiny-name {
          animation: shiny-name-sweep 3.5s linear infinite;
        }
      `}</style>
    </>
  )
}
