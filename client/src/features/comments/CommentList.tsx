import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../../hooks/useAuth.ts'
import { commentService } from '../../lib/api/commentService.ts'
import { ConfirmModal } from '../../components/ui/ConfirmModal.tsx'
import type { Comment } from '../../types/comment.ts'

interface CommentListProps {
    postId: string
    postOwnerNickName: string
    onCommentDeleted?: () => void
}

export function CommentList({
    postId,
    postOwnerNickName,
    onCommentDeleted,
}: CommentListProps) {
    const { user: currentUser } = useAuth()

    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)

    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editText, setEditText] = useState('')
    const [editedIds, setEditedIds] = useState<Set<string>>(new Set())

    const loadComments = async () => {
        try {
            setLoading(true)

            const commentsFromApi = await commentService.getByPost(postId)
            setComments(commentsFromApi)
        } catch (error) {
            console.error('ERROR CARGANDO COMENTARIOS:', error)
            setComments([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadComments()
    }, [postId])

    const getCommentDate = (comment: Comment) => {
        if (!comment.dateTime) return ''

        const date = new Date(comment.dateTime)

        if (Number.isNaN(date.getTime())) {
            return comment.dateTime
        }

        return new Intl.DateTimeFormat('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        }).format(date)
    }

    const handleSaveEdit = async (comment: Comment) => {
        if (!editText.trim()) {
            toast.error('el comentario no puede estar vacío')
            return
        }

        try {
            await commentService.update(comment._id, {
                content: editText.trim(),
            })

            setComments((prev) =>
                prev.map((c) =>
                    c._id === comment._id
                        ? { ...c, content: editText.trim() }
                        : c,
                ),
            )

            setEditedIds((prev) => {
                const newSet = new Set(prev)
                newSet.add(comment._id)
                return newSet
            })

            setEditingId(null)
            setEditText('')
            toast.success('comentario editado')
        } catch (error) {
            console.error('ERROR EDITANDO COMENTARIO:', error)
            toast.error('no se pudo editar el comentario')
        }
    }

    const handleDelete = async () => {
        if (!deletingId) return

        try {
            await commentService.remove(deletingId)

            setComments((prev) =>
                prev.filter((comment) => comment._id !== deletingId),
            )

            onCommentDeleted?.()

            toast.success('comentario eliminado')
        } catch (error) {
            console.error('ERROR ELIMINANDO COMENTARIO:', error)
            toast.error('no se pudo eliminar el comentario')
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="py-4 text-center text-[10px] text-lime-400/20">
                cargando comentarios.
            </div>
        )
    }

    if (comments.length === 0) {
        return (
            <div className="py-4 text-center text-[10px] text-lime-400/20">
                sin comentarios
            </div>
        )
    }

    const isOwner = currentUser?.nickName === postOwnerNickName

    return (
        <div className="space-y-3">
            {comments.map((c) => {
                const isAuthor = currentUser?.nickName === c.user_nickName
                const isEditing = editingId === c._id

                return (
                    <div
                        key={c._id}
                        className="border border-lime-400/10 bg-stone-950/60 p-3"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium text-lime-400/60">
                                    @{c.user_nickName}

                                    {editedIds.has(c._id) && (
                                        <span className="ml-1.5 text-[9px] italic text-lime-400/30">
                                            editado
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-1">
                                {getCommentDate(c) && (
                                    <p className="text-[9px] text-lime-400/20">
                                        {getCommentDate(c)}
                                    </p>
                                )}

                                <div className="flex gap-2">
                                    {isAuthor && !isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingId(c._id)
                                                setEditText(c.content)
                                            }}
                                            className="text-[10px] uppercase tracking-wider text-lime-400/30 transition-colors hover:text-lime-400"
                                        >
                                            editar
                                        </button>
                                    )}

                                    {isOwner && !isEditing && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeletingId(c._id)
                                            }
                                            className="text-[10px] uppercase tracking-wider text-rose-400/40 transition-colors hover:text-rose-400"
                                        >
                                            eliminar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="mt-2 flex flex-col gap-2">
                                <textarea
                                    value={editText}
                                    onChange={(event) =>
                                        setEditText(event.target.value)
                                    }
                                    rows={2}
                                    className="resize-none border border-lime-400/15 bg-lime-400/[0.02] px-2 py-1.5 text-xs text-lime-300 outline-none focus:border-lime-400/40"
                                />

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleSaveEdit(c)}
                                        className="border border-lime-400/50 bg-lime-400/[0.06] px-3 py-1 text-[10px] uppercase tracking-wider text-lime-400 transition-all hover:bg-lime-400 hover:text-stone-950"
                                    >
                                        guardar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null)
                                            setEditText('')
                                        }}
                                        className="border border-lime-400/10 px-3 py-1 text-[10px] uppercase tracking-wider text-lime-400/30 transition-all hover:border-lime-400/30 hover:text-lime-400/60"
                                    >
                                        cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-2 text-xs text-lime-400/80">
                                {c.content}
                            </p>
                        )}
                    </div>
                )
            })}

            <ConfirmModal
                open={deletingId !== null}
                title="eliminar comentario"
                message="este comentario se borrará permanentemente"
                confirmText="eliminar"
                cancelText="cancelar"
                onConfirm={handleDelete}
                onCancel={() => setDeletingId(null)}
            />
        </div>
    )
}