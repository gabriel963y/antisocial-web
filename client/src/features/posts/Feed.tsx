export function Feed() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="mb-6 flex items-center gap-2 text-sm text-lime-400/50">
                <span className="text-lime-400/70">{'>'}</span>
                <span>inicio</span>
                <span className="cursor-blink" />
            </div>

            <div className="flex items-center justify-center border border-lime-400/10 bg-stone-950/50 py-16">
                <p className="text-xs text-lime-400/15">
                    no hay posts para mostrar
                </p>
            </div>
        </div>
    )
}
