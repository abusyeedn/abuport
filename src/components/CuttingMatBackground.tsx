import React from 'react';

interface CuttingMatProps {
    minorSpacing?: number;
    majorSpacing?: number;
    showRulerNumbers?: boolean;
    baseColor?: string;
    majorLineColor?: string;
    minorLineColor?: string;
}

export default function CuttingMatBackground({
    minorSpacing = 40,
    majorSpacing = 200,
    showRulerNumbers = true,
    baseColor = "#137A55",
    majorLineColor = "rgba(255, 255, 255, 0.2)",
    minorLineColor = "rgba(255, 255, 255, 0.08)"
}: CuttingMatProps) {
    const style: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -100,
        pointerEvents: 'none',
        backgroundColor: baseColor,
        backgroundImage: `
            repeating-linear-gradient(0deg, ${minorLineColor} 0 1px, transparent 1px ${minorSpacing}px),
            repeating-linear-gradient(90deg, ${minorLineColor} 0 1px, transparent 1px ${minorSpacing}px),
            repeating-linear-gradient(0deg, ${majorLineColor} 0 2px, transparent 2px ${majorSpacing}px),
            repeating-linear-gradient(90deg, ${majorLineColor} 0 2px, transparent 2px ${majorSpacing}px)
        `,
        backgroundPosition: '0 0'
    };

    // Ruler numbers
    const renderNumbers = () => {
        if (!showRulerNumbers) return null;
        
        // Generate enough numbers for large screens
        const numbers = Array.from({ length: 150 });
        
        return (
            <>
                {/* Top row */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: minorSpacing, overflow: 'hidden' }}>
                    {numbers.map((_, i) => (
                        <div key={`top-${i}`} style={{
                            position: 'absolute',
                            left: i * minorSpacing + 4,
                            top: 4,
                            color: majorLineColor,
                            fontSize: '10px',
                            fontFamily: 'monospace'
                        }}>{i}</div>
                    ))}
                </div>
                {/* Left col */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: minorSpacing, height: '100%', overflow: 'hidden' }}>
                    {numbers.map((_, i) => {
                        if (i === 0) return null; // Avoid overlapping 0
                        return (
                            <div key={`left-${i}`} style={{
                                position: 'absolute',
                                top: i * minorSpacing + 4,
                                left: 4,
                                color: majorLineColor,
                                fontSize: '10px',
                                fontFamily: 'monospace'
                            }}>{i}</div>
                        )
                    })}
                </div>
            </>
        )
    };

    return (
        <div style={style}>
            {renderNumbers()}
        </div>
    );
}
