import { useState } from 'react'
import { toast } from 'sonner'
import { userService } from '../../lib/api/userService.ts'
import { useAuth } from '../../hooks/useAuth.ts'

type UpdateProfileModalProps = {
    onClose: () => void
}

export function UpdateProfileModal({ onClose }: UpdateProfileModalProps) {
    const { user, login } = useAuth()
    const [name, setName] = useState(user?.name ?? '')
    const [surname, setSurname] = useState(user?.surname ?? '')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setIsLoading(true)
        setError(null)

        try {
            const nickName = user.nickName ?? user._id
            const updated = await userService.update(nickName, { name, surname })
            login(updated)
            toast.success('perfil actualizado')
            onClose()
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'error desconocido'
            setError(msg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/35 px-4"
        >
            <div
                className="glow-pulse w-full max-w-md overflow-hidden rounded-2xl border border-lime-400/30 bg-zinc-950 text-lime-100 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-lime-400/15 px-5 py-4">
                    <h2 className="text-lg font-semibold text-lime-300">
                        actualizar información
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-3 py-1 text-xl text-lime-400/80 hover:bg-lime-400/10 hover:text-lime-300"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-5">
                    <div className="space-y-2">
                        <label className="block text-xs text-lime-400/70">
                            nombre
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="tu nombre"
                            className="w-full rounded-xl border border-lime-400/30 bg-black/40 px-4 py-3 text-sm text-lime-100 outline-none placeholder:text-lime-400/50 focus:border-lime-400/60"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs text-lime-400/70">
                            apellido
                        </label>
                        <input
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="tu apellido"
                            className="w-full rounded-xl border border-lime-400/30 bg-black/40 px-4 py-3 text-sm text-lime-100 outline-none placeholder:text-lime-400/50 focus:border-lime-400/60"
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-xl border border-lime-400/30 px-3 py-2 text-xs font-semibold text-lime-400/70 hover:bg-lime-400/10 sm:px-4 sm:py-3 sm:text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !name.trim()}
                            className="w-full rounded-xl bg-lime-400 px-3 py-2 text-xs font-semibold text-black disabled:cursor-not-allowed sm:px-4 sm:py-3 sm:text-sm"
                        >
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
