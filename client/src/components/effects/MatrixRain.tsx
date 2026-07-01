import { useEffect, useRef } from 'react'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ010101'

export function MatrixRain() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const cols = Math.floor(window.innerWidth / 28)
        const items: HTMLSpanElement[] = []

        for (let i = 0; i < cols; i++) {
            if (Math.random() > 0.3) continue
            const span = document.createElement('span')
            span.className = 'matrix-char'
            span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)]
            span.style.left = `${i * 28}px`
            span.style.animationDuration = `${4 + Math.random() * 6}s`
            span.style.animationDelay = `${Math.random() * 8}s`
            span.style.fontSize = `${10 + Math.random() * 6}px`
            container.appendChild(span)
            items.push(span)
        }

        return () => {
            items.forEach((el) => el.remove())
        }
    }, [])

    return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-0 overflow-hidden" />
}
