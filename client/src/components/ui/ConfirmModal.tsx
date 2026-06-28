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
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 px-4"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-sm border border-lime-400/15 bg-stone-950/95"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-lime-400/10 px-4 py-2.5">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-lime-400/40">
                        [ {title} ]
                    </span>
                </div>

                <div className="p-4">
                    <p className="text-[11px] leading-relaxed text-lime-400/60">
                        {message}
                    </p>

                    <div className="mt-4 flex items-center justify-end gap-2">
                        <button
                            onClick={onCancel}
                            className="border border-lime-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-lime-400/30 transition-all hover:border-lime-400/30 hover:text-lime-400/60"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="border border-red-400/50 bg-red-400/[0.15] px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-red-400 transition-all hover:bg-red-400 hover:text-stone-950"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
