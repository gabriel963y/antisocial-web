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

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-lime-400/20 bg-lime-400/[0.04]">
                    <span className="text-xs font-semibold text-lime-400/60">
                        {user?.nickName?.charAt(0).toUpperCase() ?? '?'}
                    </span>
                </div>

                <div className="flex flex-1 items-center rounded-2xl bg-lime-400/[0.08] px-4 py-2">
                    <textarea
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        rows={1}
                        placeholder="Escribe un comentario..."
                        className="max-h-24 min-h-8 w-full resize-none bg-transparent text-sm text-lime-100 outline-none placeholder:text-lime-400/30"
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !content.trim()}
                        className="ml-3 text-lg text-lime-400/50 hover:text-lime-300 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        ➤
                    </button>
                </div>
            </div>

            {error && (
                <p className="ml-12 text-xs text-rose-400/80">
                    {error}
                </p>
            )}
        </form>
    )
}