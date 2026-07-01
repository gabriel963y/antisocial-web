import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { postService } from '../../lib/api/postService.ts'
import { getCommentCount, getPostId } from '../../lib/helpers/postHelpers.ts'
import type { Post } from '../../types/post.ts'
import { useAuth } from '../../hooks/useAuth.ts'
import { CommentsModal } from '../comments/CommentsModal.tsx'
import { PostCard } from './PostCard.tsx'

const POSTS_LIMIT = 5//Esto es para lo del scroll infinito <---

export function Feed() {
    const { user } = useAuth()
    const [posts, setPosts] = useState<Post[]>([])
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)

    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState('')

    const loaderRef = useRef<HTMLDivElement | null>(null)

    const hasMorePosts = posts.length < total

    const showInitialLoading = initialLoading
    const showError = !initialLoading && Boolean(error)
    const showEmptyPosts = !initialLoading && !error && posts.length === 0
    const showPosts = !initialLoading && !error && posts.length > 0
    const showNoMorePosts = !hasMorePosts && posts.length > 0

    const loadPosts = async (pageToLoad: number) => {
        if (loading) return

        try {
            setLoading(true)
            setError('')

            const result = await postService.getPosts(pageToLoad, POSTS_LIMIT)

            if (pageToLoad === 1) {
                setPosts(result.posts)
            } else {
                setPosts((previousPosts) => [
                    ...previousPosts,
                    ...result.posts,
                ])
            }

            setTotal(result.total)
            setPage(pageToLoad)
        } catch (error) {
            console.error('ERROR POSTS:', error)
            setError('No se pudieron cargar las publicaciones')
        } finally {
            setLoading(false)
            setInitialLoading(false)
        }
    }

    useEffect(() => {
        loadPosts(1)

        const handlePostCreated = () => {
            loadPosts(1)
        }

        window.addEventListener('post-created', handlePostCreated)

        return () => {
            window.removeEventListener('post-created', handlePostCreated)
        }
    }, [])

    useEffect(() => {
        const loader = loaderRef.current

        if (!loader || loading || initialLoading || !hasMorePosts) return

        const observer = new IntersectionObserver((entries) => {
            const isLoaderVisible = entries[0].isIntersecting

            if (isLoaderVisible) {
                loadPosts(page + 1)
            }
        })

        observer.observe(loader)

        return () => {
            observer.disconnect()
        }
    }, [loading, initialLoading, hasMorePosts, page])

    const openComments = (post: Post) => {
        setSelectedPost(post)
    }

    const closeComments = () => {
        setSelectedPost(null)
    }

    const updatePostCommentCount = (postId: string, amount: number) => {
        setPosts((previousPosts) =>
            previousPosts.map((post) => {
                if (getPostId(post) !== postId) return post

                const currentCount = getCommentCount(post)
                const nextCount = Math.max(currentCount + amount, 0)

                return {
                    ...post,
                    commentsCount: nextCount,
                    commentCount: nextCount,
                }
            }),
        )

        setSelectedPost((previousPost) => {
            if (!previousPost) return previousPost
            if (getPostId(previousPost) !== postId) return previousPost

            const currentCount = getCommentCount(previousPost)
            const nextCount = Math.max(currentCount + amount, 0)

            return {
                ...previousPost,
                commentsCount: nextCount,
                commentCount: nextCount,
            }
        })
    }

    const handleCommentCreated = () => {
        if (!selectedPost) return

        updatePostCommentCount(getPostId(selectedPost), 1)
    }

    const handleCommentDeleted = () => {
        if (!selectedPost) return

        updatePostCommentCount(getPostId(selectedPost), -1)
    }

    const currentUserNickName =
        (user as { nickName?: string } | null)?.nickName ?? ''

    const handleRemoveTag = useCallback(
        async (postId: string, tagId: string) => {
            try {
                await postService.removeTag(postId, tagId)

                setPosts((prev) =>
                    prev.map((p) => {
                        if (getPostId(p) !== postId) return p
                        return {
                            ...p,
                            tags: (p.tags ?? []).filter(
                                (t) => (t.tag_id ?? t.id ?? t._id) !== tagId,
                            ),
                        }
                    }),
                )

                toast.success('Etiqueta eliminada')
            } catch {
                toast.error('Error al eliminar la etiqueta')
            }
        },
        [],
    )

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="mb-6 flex items-center gap-2 text-sm text-lime-400/70">
                <span className="text-lime-400/70">{'>'}</span>
                <span>inicio</span>
            </div>

            {showInitialLoading && (
                <div className="flex items-center justify-center border border-lime-400/15 bg-stone-950/70 py-16">
                    <p className="text-xs text-lime-400/35">
                        cargando publicaciones...
                    </p>
                </div>
            )}

            {showError && (
                <div className="border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            {showEmptyPosts && (
                <div className="flex items-center justify-center border border-lime-400/15 bg-stone-950/70 py-16">
                    <p className="text-xs text-lime-400/30">
                        no hay posts para mostrar
                    </p>
                </div>
            )}

            {showPosts && (
                <div className="flex flex-col gap-5">
                    {posts.map((post, postIndex) => {
                        const postId = getPostId(post)
                        const postOwner = post.user_nickName ?? ''
                        const canRemoveTag = currentUserNickName === postOwner

                        return (
                            <PostCard
                                key={postId || postIndex}
                                post={post}
                                onOpenComments={openComments}
                                onRemoveTag={canRemoveTag ? handleRemoveTag : undefined}
                            />
                        )
                    })}

                    {hasMorePosts && (
                        <div
                            ref={loaderRef}
                            className="flex items-center justify-center py-6"
                        >
                            <p className="text-xs text-lime-400/45">
                                {loading
                                    ? 'cargando más posts...'
                                    : 'bajá para cargar más'}
                            </p>
                        </div>
                    )}

                    {showNoMorePosts && (
                        <p className="py-6 text-center text-xs text-lime-400/35">
                            no hay más publicaciones
                        </p>
                    )}
                </div>
            )}

            {selectedPost && (
                <CommentsModal
                    post={selectedPost}
                    onClose={closeComments}
                    onCommentCreated={handleCommentCreated}
                    onCommentDeleted={handleCommentDeleted}
                />
            )}
        </div>
    )
}