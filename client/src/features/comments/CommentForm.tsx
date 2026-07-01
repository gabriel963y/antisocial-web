import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { commentService } from '../../lib/api/commentService.ts'
import { useAuth } from '../../hooks/useAuth.ts'

type CommentFormProps = {
    postId: string
    onCommentCreated: () => void
}

export function CommentForm({ postId, onCommentCreated }: CommentFormProps) {
    const { user } = useAuth()

    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError('')

        if (!content.trim()) {
            setError('El comentario es obligatorio')
            return
        }

        if (!user) {
            setError('Tenés que iniciar sesión para comentar')
            return
        }

        try {
            setIsLoading(true)
            await commentService.createComment(
                postId,
                user.nickName,
                content.trim(),
            )

            setContent('')
            toast.success('Comentario publicado')
            onCommentCreated()
        } catch (error) {
            console.error('ERROR CREANDO COMENTARIO:', error)
            setError('No se pudo crear el comentario')
        } finally {
            setIsLoading(false)
        }
    }

    const canSubmit = content.trim().length > 0 && !isLoading

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-lime-400/30 bg-lime-400/[0.08]">
                    <span className="text-xs font-semibold text-lime-400/80">
                        {user?.nickName?.charAt(0).toUpperCase() ?? '?'}
                    </span>
                </div>

                <div className="flex flex-1 items-center rounded-xl border border-lime-400/30 bg-black/40 px-3 transition-colors focus-within:border-lime-400/50">
                    <textarea
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        rows={1}
                        placeholder="Escribe un comentario..."
                        className="max-h-24 min-h-9 w-full resize-none bg-transparent py-2 text-sm text-lime-100 outline-none placeholder:text-lime-400/50"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                if (canSubmit) handleSubmit(e as unknown as FormEvent<HTMLFormElement>)
                            }
                        }}
                    />

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm text-lime-400/70 transition-colors hover:bg-lime-400/10 hover:text-lime-300 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        ↑
                    </button>
                </div>
            </div>

            {error && (
                <p className="ml-12 text-xs text-rose-400">
                    {error}
                </p>
            )}
        </form>
    )
}
