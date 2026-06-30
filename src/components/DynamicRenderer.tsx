import React from 'react'
import { useEditor } from '../EditorContext'
import FigmaElement from './FigmaElement'
import { ComponentRegistry } from './ComponentRegistry'

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    minWidth: '200px',
    minHeight: '200px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#888',
    fontFamily: 'monospace',
    fontSize: '12px',
    gap: '10px'
  }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
    <span>LOADING...</span>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default function DynamicRenderer() {
  const { dynamicElements } = useEditor()

  if (!dynamicElements || dynamicElements.length === 0) return null

  const currentPath = window.location.pathname
  return (
    <>
      {dynamicElements.map(el => {
        const Component = ComponentRegistry[el.componentType]
        if (!Component) {
          console.warn(`DynamicRenderer: Component "${el.componentType}" not found in registry.`);
          return null;
        }

        // If the dynamic element has a path defined and we are not on that path, don't render it
        const elPath = el.path || '/'
        if (elPath !== currentPath) return null

        return (
          <FigmaElement
            key={el.id}
            figmaId={el.id}
            componentType={el.componentType}
            componentProps={el.props}
            style={{ display: 'block', width: 'max-content', zIndex: 10000 }} // Base style, editor transform overrides it
          >
            <React.Suspense fallback={<LoadingFallback />}>
              <Component {...el.props} figmaId={el.id} />
            </React.Suspense>
          </FigmaElement>
        )
      })}
    </>
  )
}
