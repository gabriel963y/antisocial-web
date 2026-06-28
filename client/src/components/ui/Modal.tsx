import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface ModalProps {
    title: string
    children: ReactNode
}

export function Modal({ title, children }: ModalProps) {
    const navigate = useNavigate()

    const close = () => navigate('/profile', { replace: true })

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close()
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 px-4"
            onClick={close}
        >
            <div
                className="w-full max-w-sm border border-lime-400/15 bg-stone-950/95"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-lime-400/10 px-4 py-2.5">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-lime-400/40">
                        [ {title} ]
                    </span>
                    <button
                        onClick={close}
                        className="text-xs text-lime-400/30 hover:text-lime-400/60"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4">{children}</div>
            </div>
        </div>
    )
}
