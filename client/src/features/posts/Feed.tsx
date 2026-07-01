import { useEffect, useRef, useState } from 'react'
import { postService } from '../../lib/api/postService.ts'
import { CommentForm } from '../comments/CommentForm.tsx'
import { CommentList } from '../comments/CommentList.tsx'
import {
    getCommentCount,
    getPostId,
    getPostImages,
    getPostImageUrl,
    getPostUser,
    getTagId,
    getTagName,
} from '../../lib/helpers/postHelpers.ts'
import type { Post, PostImage } from '../../types/post.ts'

const POSTS_LIMIT = 5

export function Feed() {
    const [posts, setPosts] = useState<Post[]>([])
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [reloadCommentsKey, setReloadCommentsKey] = useState(0)

    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState('')

    const loaderRef = useRef<HTMLDivElement | null>(null)
    const hasMore = posts.length < total

    useEffect(() => {
        loadPosts(1)
    }, [])

    useEffect(() => {
        const loader = loaderRef.current

        if (!loader || loading || initialLoading || !hasMore) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadPosts(page + 1)
            }
        })

        observer.observe(loader)

        return () => observer.disconnect()
    }, [loading, initialLoading, hasMore, page])

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

    const renderImageGrid = (images: PostImage[]) => {
        const validImages = images.filter((image) => getPostImageUrl(image))

        if (validImages.length === 0) return null

        if (validImages.length === 1) {
            return (
                <div className="mt-4 overflow-hidden border border-lime-400/10">
                    <img
                        src={getPostImageUrl(validImages[0])}
                        alt="imagen del post"
                        className="max-h-[520px] w-full object-cover"
                    />
                </div>
            )
        }

        if (validImages.length === 2) {
            return (
                <div className="mt-4 grid grid-cols-2 gap-1 overflow-hidden border border-lime-400/10">
                    {validImages.slice(0, 2).map((image, index) => (
                        <img
                            key={image.image_id ?? image.id ?? image._id ?? index}
                            src={getPostImageUrl(image)}
                            alt="imagen del post"
                            className="h-80 w-full object-cover"
                        />
                    ))}
                </div>
            )
        }

        if (validImages.length === 3) {
            return (
                <div className="mt-4 grid grid-cols-2 gap-1 overflow-hidden border border-lime-400/10">
                    <img
                        src={getPostImageUrl(validImages[0])}
                        alt="imagen del post"
                        className="h-[420px] w-full object-cover"
                    />

                    <div className="grid grid-rows-2 gap-1">
                        {validImages.slice(1, 3).map((image, index) => (
                            <img
                                key={image.image_id ?? image.id ?? image._id ?? index}
                                src={getPostImageUrl(image)}
                                alt="imagen del post"
                                className="h-full w-full object-cover"
                            />
                        ))}
                    </div>
                </div>
            )
        }

        return (
            <div className="mt-4 grid grid-cols-2 gap-1 overflow-hidden border border-lime-400/10">
                {validImages.slice(0, 4).map((image, index) => {
                    const remainingImages = validImages.length - 4
                    const isLastImage = index === 3 && remainingImages > 0

                    return (
                        <div
                            key={image.image_id ?? image.id ?? image._id ?? index}
                            className="relative"
                        >
                            <img
                                src={getPostImageUrl(image)}
                                alt="imagen del post"
                                className="h-64 w-full object-cover"
                            />

                            {isLastImage && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                    <span className="text-3xl font-semibold text-white">
                                        +{remainingImages}
                                    </span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderTags = (post: Post) => {
        if (!post.tags || post.tags.length === 0) return null

        return (
            <div className="px-4 pt-3">
                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, tagIndex) => (
                        <span
                            key={getTagId(tag) || tagIndex}
                            className="rounded-full border border-lime-400/25 bg-lime-400/[0.06] px-3 py-1 text-xs text-lime-400/60"
                        >
                            #{getTagName(tag)}
                        </span>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="mb-6 flex items-center gap-2 text-sm text-lime-400/50">
                <span className="text-lime-400/70">{'>'}</span>
                <span>inicio</span>
                <span className="cursor-blink" />
            </div>

            {initialLoading && (
                <div className="flex items-center justify-center border border-lime-400/10 bg-stone-950/50 py-16">
                    <p className="text-xs text-lime-400/20">
                        cargando publicaciones...
                    </p>
                </div>
            )}

            {!initialLoading && error && (
                <div className="border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            {!initialLoading && !error && posts.length === 0 && (
                <div className="flex items-center justify-center border border-lime-400/10 bg-stone-950/50 py-16">
                    <p className="text-xs text-lime-400/15">
                        no hay posts para mostrar
                    </p>
                </div>
            )}

            {!initialLoading && !error && posts.length > 0 && (
                <div className="flex flex-col gap-5">
                    {posts.map((post, postIndex) => {
                        const postId = getPostId(post)
                        const commentCount = getCommentCount(post)
                        const images = getPostImages(post)

                        return (
                            <article
                                key={postId || postIndex}
                                className="overflow-hidden rounded-xl border border-lime-400/10 bg-stone-950/90 shadow-lg"
                            >
                                <div className="px-4 pt-4">
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lime-400/20 bg-lime-400/[0.04]">
                                            <span className="text-sm font-semibold text-lime-400/60">
                                                {getPostUser(post)
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-lime-400/80">
                                                {getPostUser(post)}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="whitespace-pre-wrap text-sm leading-6 text-lime-100/80">
                                        {post.description}
                                    </p>
                                </div>

                                {images.length > 0 && (
                                    <div className="px-4">
                                        {renderImageGrid(images)}
                                    </div>
                                )}

                                {renderTags(post)}

                                <div className="mt-4 border-t border-lime-400/10 px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        {postId ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPost(post)
                                                    setReloadCommentsKey(0)
                                                }}
                                                className="text-xs font-medium uppercase tracking-[0.15em] text-lime-400/55 hover:text-lime-300"
                                            >
                                                Comentar
                                            </button>
                                        ) : (
                                            <span className="text-xs text-lime-400/20">
                                                Comentar
                                            </span>
                                        )}

                                        <span className="text-xs text-lime-400/35">
                                            {commentCount} comentarios
                                        </span>
                                    </div>
                                </div>
                            </article>
                        )
                    })}

                    {hasMore && (
                        <div
                            ref={loaderRef}
                            className="flex items-center justify-center py-6"
                        >
                            <p className="text-xs text-lime-400/25">
                                {loading
                                    ? 'cargando más posts...'
                                    : 'bajá para cargar más'}
                            </p>
                        </div>
                    )}

                    {!hasMore && posts.length > 0 && (
                        <p className="py-6 text-center text-xs text-lime-400/20">
                            no hay más publicaciones
                        </p>
                    )}
                </div>
            )}

            {selectedPost && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
                    <div className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-lime-400/20 bg-zinc-950 text-lime-100 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-lime-400/10 px-5 py-4">
                            <h2 className="text-lg font-semibold text-lime-300">
                                Comentarios
                            </h2>

                            <button
                                type="button"
                                onClick={() => setSelectedPost(null)}
                                className="rounded-full px-3 py-1 text-xl text-lime-400/60 hover:bg-lime-400/10 hover:text-lime-300"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-4">
                            <div className="mb-5 border-b border-lime-400/10 pb-4">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lime-400/20 bg-lime-400/[0.04]">
                                        <span className="text-sm font-semibold text-lime-400/60">
                                            {getPostUser(selectedPost)
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>

                                    <p className="text-sm font-semibold text-lime-400/80">
                                        {getPostUser(selectedPost)}
                                    </p>
                                </div>

                                <p className="whitespace-pre-wrap text-sm leading-6 text-lime-100/80">
                                    {selectedPost.description}
                                </p>
                            </div>

                            <CommentList
                                key={reloadCommentsKey}
                                postId={getPostId(selectedPost)}
                                postOwnerNickName={getPostUser(selectedPost)}
                                onCommentDeleted={() => {
                                    updatePostCommentCount(
                                        getPostId(selectedPost),
                                        -1,
                                    )
                                }}
                            />
                        </div>

                        <div className="border-t border-lime-400/10 px-5 py-4">
                            <CommentForm
                                postId={getPostId(selectedPost)}
                                onCommentCreated={() => {
                                    const postId = getPostId(selectedPost)

                                    setReloadCommentsKey((key) => key + 1)
                                    updatePostCommentCount(postId, 1)
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}