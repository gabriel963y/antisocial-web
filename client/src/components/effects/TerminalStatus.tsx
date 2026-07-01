import { useEffect, useState } from 'react'

const LINES = [
    '> system online · 0xDEADBEEF · uptime: 42s',
    '> kernel loaded · 6 modules · heap: 128MB',
    '> connection secure · TLS 1.3 · handshake OK',
    '> monitoring active · 0 anomalies detected',
    '> all systems nominal · standby',
]

export function TerminalStatus() {
    const [lineIndex, setLineIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [displayed, setDisplayed] = useState('')

    useEffect(() => {
        const line = LINES[lineIndex]
        if (charIndex < line.length) {
            const timeout = setTimeout(() => {
                setDisplayed(line.slice(0, charIndex + 1))
                setCharIndex((i) => i + 1)
            }, 25 + Math.random() * 40)
            return () => clearTimeout(timeout)
        }

        const pause = setTimeout(() => {
            const next = (lineIndex + 1) % LINES.length
            setLineIndex(next)
            setCharIndex(0)
            setDisplayed('')
        }, 3000)
        return () => clearTimeout(pause)
    }, [charIndex, lineIndex])

    return (
        <span className="typing-cursor text-[10px] text-lime-400/30">
            {displayed}
        </span>
    )
}
