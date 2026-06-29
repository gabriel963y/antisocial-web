import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth.ts'
import { commentService } from '../../lib/api/commentService.ts'
import { ConfirmModal } from '../../components/ui/ConfirmModal.tsx'
import type { Comment } from '../../types/comment.ts'

interface CommentListProps {
  postId: string
  postOwnerNickName: string
}

export function CommentList({ postId, postOwnerNickName }: CommentListProps) {
  const { user: currentUser } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editedIds, setEditedIds] = useState<Set<string>>(new Set())

  const loadComments = () => {
    setLoading(true)
    commentService.getByPost(postId).then(setComments).catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadComments()
  }, [postId])

  if (loading) {
    return (
      <div className="py-4 text-center text-[10px] text-lime-400/20">
        cargando comentarios...
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
          <div key={c._id} className="border border-lime-400/10 bg-stone-950/60 p-3">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-medium text-lime-400/60">
                @{c.user_nickName}
                {editedIds.has(c._id) && (
                  <span className="ml-1.5 text-[9px] italic text-lime-400/30">
                    editado
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                {isAuthor && !isEditing && (
                  <button
                    onClick={() => { setEditingId(c._id); setEditText(c.content) }}
                    className="text-[10px] uppercase tracking-wider text-lime-400/30 transition-colors hover:text-lime-400"
                  >
                    editar
                  </button>
                )}
                {isOwner && (
                  <button
                    onClick={() => setDeletingId(c._id)}
                    className="text-[10px] uppercase tracking-wider text-rose-400/40 transition-colors hover:text-rose-400"
                  >
                    eliminar
                  </button>
                )}
              </div>
            </div>
            {isEditing ? (
              <div className="mt-2 flex flex-col gap-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                  className="border border-lime-400/15 bg-lime-400/[0.02] px-2 py-1.5 text-xs text-lime-300 outline-none focus:border-lime-400/40 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      commentService.update(c._id, { content: editText }).then(() => {
                        setComments((prev) =>
                          prev.map((x) => x._id === c._id ? { ...x, content: editText } : x)
                        )
                        setEditedIds((prev) => new Set(prev).add(c._id))
                        setEditingId(null)
                      }).catch(() => {})
                    }}
                    className="px-3 py-1 text-[10px] uppercase tracking-wider border border-lime-400/50 bg-lime-400/[0.06] text-lime-400 hover:bg-lime-400 hover:text-stone-950 transition-all"
                  >
                    guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 text-[10px] uppercase tracking-wider border border-lime-400/10 text-lime-400/30 hover:border-lime-400/30 hover:text-lime-400/60 transition-all"
                  >
                    cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-1 text-xs text-lime-400/80">{c.content}</p>
                <p className="mt-2 text-[9px] text-lime-400/15 text-right">
                  {new Date(c.dateTime).toLocaleDateString('es-AR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
                  })}
                </p>
              </>
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
        onConfirm={() => {
          if (!deletingId) return
          commentService.remove(deletingId).then(() => {
            setComments((prev) => prev.filter((c) => c._id !== deletingId))
          }).catch(() => {})
          setDeletingId(null)
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  )
}
