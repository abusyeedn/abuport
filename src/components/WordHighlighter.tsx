import { useMemo, type CSSProperties } from "react"

interface WordHighlighterProps {
    text: string
    highlightWords: string
    highlightColor: string
    highlightTextColor: string
    highlightFont?: CSSProperties
    baseFont?: CSSProperties
    baseTextColor: string
    highlightPadding: number
    highlightBorderRadius: number
    caseSensitive: boolean
    style?: CSSProperties
}

export default function WordHighlighter(props: WordHighlighterProps) {
    const {
        text = "This is a sample text with some words to highlight",
        highlightWords = "sample, highlight",
        highlightColor = "#FFBB00",
        highlightTextColor = "#000000",
        highlightFont,
        baseFont,
        baseTextColor = "#000000",
        highlightPadding = 4,
        highlightBorderRadius = 4,
        caseSensitive = false,
        style,
    } = props

    const processedText = useMemo(() => {
        if (!text || !highlightWords.trim()) {
            return [{ text, isHighlighted: false }]
        }

        const words = highlightWords
            .split(",")
            .map((w) => w.trim())
            .filter((w) => w.length > 0)

        if (words.length === 0) {
            return [{ text, isHighlighted: false }]
        }

        const pattern = words
            .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("|")
        const regex = new RegExp(`(${pattern})`, caseSensitive ? "g" : "gi")

        const parts = text.split(regex)

        return parts.map((part) => {
            const isHighlighted = words.some((word) =>
                caseSensitive
                    ? part === word
                    : part.toLowerCase() === word.toLowerCase()
            )
            return { text: part, isHighlighted }
        })
    }, [text, highlightWords, caseSensitive])

    return (
        <div
            style={{
                position: "relative",
                display: "inline-block",
                width: "max-content",
                ...style,
            }}
        >
            <p
                style={{
                    margin: 0,
                    color: baseTextColor,
                    ...baseFont,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                }}
            >
                {processedText.map((part, index) =>
                    part.isHighlighted ? (
                        <span
                            key={index}
                            style={{
                                backgroundColor: highlightColor,
                                color: highlightTextColor,
                                padding: `${highlightPadding}px`,
                                borderRadius: `${highlightBorderRadius}px`,
                                ...highlightFont,
                            }}
                        >
                            {part.text}
                        </span>
                    ) : (
                        <span key={index}>{part.text}</span>
                    )
                )}
            </p>
        </div>
    )
}

WordHighlighter.displayName = "Word Highlighter"
