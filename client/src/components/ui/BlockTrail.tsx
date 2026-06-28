interface BlockTrailProps {
    connected: boolean
}

const BLOCKS = 14

export function BlockTrail({ connected }: BlockTrailProps) {
    const color = connected ? '#a3e635' : '#fb7185'

    return (
        <div className="flex items-center gap-[3px]">
            {Array.from({ length: BLOCKS }, (_, i) => (
                <span
                    key={i}
                    className="inline-block h-3 w-[6px]"
                    style={{
                        backgroundColor: color,
                        animation: `block-pulse 2.8s ease-in-out ${i * 0.12}s infinite`,
                        opacity: 0.06,
                    }}
                />
            ))}
        </div>
    )
}
