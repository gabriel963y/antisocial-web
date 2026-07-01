import { Link } from 'react-router-dom'
import {
    getCommentCount,
    getPostId,
    getPostImages,
    getPostUser,
} from '../../lib/helpers/postHelpers.ts'
import type { Post } from '../../types/post.ts'
import { PostImageGrid } from './PostImageGrid.tsx'
import { PostTags } from './PostTags.tsx'

type PostCardProps = {
    post: Post
    onOpenComments: (post: Post) => void
    onRemoveTag?: (postId: string, tagId: string) => void
}

export function PostCard({ post, onOpenComments, onRemoveTag }: PostCardProps) {
    const postId = getPostId(post)
    const commentCount = getCommentCount(post)
    const images = getPostImages(post)
    const postUser = getPostUser(post)
    const tags = post.tags ?? []

    return (
        <article className="glow-pulse overflow-hidden rounded-xl border border-lime-400/15 bg-stone-950/90 shadow-lg">
            <div className="px-4 pt-4">
                <div className="mb-3 flex items-center justify-between gap-3">
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
                        </div>
                    </div>

                    <span className="shrink-0 text-[10px] text-lime-400/45">
                        {post.dateTime
                            ? new Date(post.dateTime).toLocaleDateString()
                            : ''}
                    </span>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-6 text-lime-100">
                    {post.description}
                </p>
            </div>

            {images.length > 0 && (
                <div className="px-4 pb-4 pt-4">
                    <PostImageGrid images={images} />
                </div>
            )}

            {images.length === 0 && tags.length === 0 && <div className="pb-4" />}

            {tags.length > 0 && (
                <div className="px-4 pb-4 pt-4">
                    <PostTags
                        post={post}
                        onRemoveTag={
                            onRemoveTag && postId
                                ? (tagId) => onRemoveTag(postId, tagId)
                                : undefined
                        }
                    />
                </div>
            )}

            <div className="border-t border-lime-400/15 px-4 py-3">
                <div className="flex items-center justify-between">
                    {postId ? (
                        <button
                            type="button"
                            onClick={() => onOpenComments(post)}
                            className="text-xs font-medium uppercase tracking-[0.15em] text-lime-400/75 hover:text-lime-300"
                        >
                            Comentar
                        </button>
                    ) : (
                        <span className="text-xs text-lime-400/35">
                            Comentar
                        </span>
                    )}

                    <span className="text-xs text-lime-400/55">
                        {commentCount} comentarios
                    </span>
                </div>
            </div>
        </article>
    )
}