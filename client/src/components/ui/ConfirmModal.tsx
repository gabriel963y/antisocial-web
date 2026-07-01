import { useEffect } from 'react'

interface ConfirmModalProps {
    open: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel: () => void
}

export function ConfirmModal({
    open,
    title,
    message,
    confirmText = 'sí',
    cancelText = 'no',
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    useEffect(() => {
        if (!open) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel()
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [open, onCancel])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/35 px-4"
        >
            <div
                className="glow-pulse w-full max-w-sm overflow-hidden rounded-2xl border border-lime-400/30 bg-zinc-950 text-lime-100 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-lime-400/15 px-5 py-4">
                    <span className="text-xs font-semibold text-lime-300">
                        {title}
                    </span>
                </div>

                <div className="p-5">
                    <p className="text-sm leading-relaxed text-lime-100/80">
                        {message}
                    </p>

                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            onClick={onCancel}
                            className="rounded-xl border border-lime-400/30 px-4 py-2 text-xs font-semibold text-lime-400/70 transition-colors hover:bg-lime-400/10"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="rounded-xl border border-red-400/40 bg-red-400/[0.12] px-4 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-400 hover:text-black"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
