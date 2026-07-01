import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { postService } from '../../lib/api/postService.ts'
import { getPostImages, getPostUser, getTagId } from '../../lib/helpers/postHelpers.ts'
import type { Post } from '../../types/post.ts'
import { PostImageGrid } from './PostImageGrid.tsx'
import { PostTags } from './PostTags.tsx'
import { useAuth } from '../../hooks/useAuth.ts'

export function PostDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editing, setEditing] = useState(false)
    const [editDescription, setEditDescription] = useState('')
    const [saving, setSaving] = useState(false)

    const currentUserNickName =
        (user as { nickName?: string } | null)?.nickName ?? ''
    const isOwner = post?.user_nickName === currentUserNickName

    useEffect(() => {
        if (!id) return
        loadPost(id)
    }, [id])

    const loadPost = async (postId: string) => {
        try {
            setLoading(true)
            setError('')
            const [postData, images, tags] = await Promise.all([
                postService.getPostById(postId),
                postService.getPostImages(postId),
                postService.getPostTags(postId),
            ])
            setPost({ ...postData, images, tags })
            setEditDescription(postData.description ?? '')
        } catch {
            setError('No se pudo cargar la publicación')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!id || !editDescription.trim()) return
        try {
            setSaving(true)
            await postService.updatePost(id, { description: editDescription.trim() })
            toast.success('Publicación actualizada')
            setEditing(false)
            setPost((prev) => prev ? { ...prev, description: editDescription.trim() } : prev)
        } catch {
            toast.error('Error al actualizar la publicación')
        } finally {
            setSaving(false)
        }
    }

    const handleCancelEdit = () => {
        setEditing(false)
        setEditDescription(post?.description ?? '')
    }

    const handleRemoveTag = async (tagId: string) => {
        if (!id) return
        try {
            await postService.removeTag(id, tagId)
            setPost((prev) => prev ? {
                ...prev,
                tags: (prev.tags ?? []).filter((t) => getTagId(t) !== tagId),
            } : prev)
            toast.success('Etiqueta eliminada')
        } catch {
            toast.error('Error al eliminar la etiqueta')
        }
    }

    const handleDeletePost = async () => {
        if (!id) return
        if (!confirm('¿Estás seguro de que querés eliminar esta publicación? Esta acción no se puede deshacer.')) return
        try {
            await postService.deletePost(id)
            toast.success('Publicación eliminada')
            navigate(-1)
        } catch {
            toast.error('Error al eliminar la publicación')
        }
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="flex items-center justify-center border border-lime-400/15 bg-stone-950/50 py-16">
                    <p className="text-xs text-lime-400/35">cargando publicación...</p>
                </div>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error || 'Publicación no encontrada'}
                </div>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mt-4 rounded-xl border border-lime-400/30 px-4 py-2 text-xs text-lime-400/70 hover:bg-lime-400/10"
                >
                    volver
                </button>
            </div>
        )
    }

    const images = getPostImages(post)
    const postUser = getPostUser(post)

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="mb-6 text-sm text-lime-400/70">
                <span className="text-lime-400/70">{'>'}</span>
                <span className="ml-2">publicación</span>
            </div>

            <article className="glow-pulse overflow-hidden rounded-2xl border border-lime-400/40 bg-zinc-950 shadow-2xl transition-shadow hover:shadow-[0_0_30px_-6px_rgba(132,204,22,0.08)]">
                <div className="flex items-start justify-between gap-3 border-b border-lime-400/15 px-6 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            to={`/profile/${postUser}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lime-400/30 bg-lime-400/[0.08] transition-colors hover:bg-lime-400/10"
                        >
                            <span className="text-sm font-semibold text-lime-400/80">
                                {postUser.charAt(0).toUpperCase()}
                            </span>
                        </Link>
                        <div className="min-w-0">
                            <Link
                                to={`/profile/${postUser}`}
                                className="truncate text-sm font-semibold text-lime-300 transition-colors hover:text-lime-300"
                            >
                                {postUser}
                            </Link>
                            <p className="text-[10px] text-lime-400/45">
                                {post.dateTime
                                    ? new Date(post.dateTime).toLocaleDateString()
                                    : ''}
                            </p>
                        </div>
                    </div>

                    {isOwner && !editing && (
                        <div className="flex gap-1.5 shrink-0">
                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                className="rounded-xl border border-lime-400/30 px-3 py-1.5 text-[10px] text-lime-400/70 transition-colors hover:bg-lime-400/10 hover:text-lime-300"
                            >
                                editar
                            </button>
                            <button
                                type="button"
                                onClick={handleDeletePost}
                                className="rounded-xl border border-red-400/40 px-3 py-1.5 text-[10px] text-red-400/70 transition-colors hover:bg-red-400/10 hover:text-red-300"
                            >
                                eliminar
                            </button>
                        </div>
                    )}
                </div>

                <div className="px-6 pb-5 pt-6">
                    {editing ? (
                        <div className="space-y-4">
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="min-h-32 w-full resize-none rounded-xl border border-lime-400/40 bg-black/40 p-4 text-sm text-lime-100 outline-none placeholder:text-lime-400/50 focus:border-lime-400/70"
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="w-full rounded-xl border border-lime-400/30 px-3 py-2 text-xs font-semibold text-lime-400/70 transition-colors hover:bg-lime-400/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving || !editDescription.trim()}
                                    className="w-full rounded-xl bg-lime-400 px-3 py-2 text-xs font-semibold text-black transition-colors hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap text-sm leading-7 text-lime-100">
                            {post.description}
                        </p>
                    )}
                </div>

                {images.length > 0 && (
                    <div className="px-6 pb-5">
                        <PostImageGrid images={images} />
                    </div>
                )}

                <div className="border-t border-lime-400/15 px-6 py-4">
                    <PostTags
                        post={post}
                        onRemoveTag={isOwner ? (tagId) => handleRemoveTag(tagId) : undefined}
                    />
                </div>
            </article>

            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mt-6 text-xs text-lime-400/60 transition-colors hover:text-lime-400/70"
            >
                {'<-'} volver
            </button>
        </div>
    )
}
