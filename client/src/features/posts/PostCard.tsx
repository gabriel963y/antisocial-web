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
}

export function PostCard({ post, onOpenComments }: PostCardProps) {
    const postId = getPostId(post)
    const commentCount = getCommentCount(post)
    const images = getPostImages(post)
    const postUser = getPostUser(post)

    return (
        <article className="overflow-hidden rounded-xl border border-lime-400/10 bg-stone-950/90 shadow-lg">
            <div className="px-4 pt-4">
                <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lime-400/20 bg-lime-400/[0.04]">
                        <span className="text-sm font-semibold text-lime-400/60">
                            {postUser.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-lime-400/80">
                            {postUser}
                        </p>
                    </div>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-6 text-lime-100/80">
                    {post.description}
                </p>
            </div>

            {images.length > 0 && (
                <div className="px-4">
                    <PostImageGrid images={images} />
                </div>
            )}

            <PostTags post={post} />

            <div className="mt-4 border-t border-lime-400/10 px-4 py-3">
                <div className="flex items-center justify-between">
                    {postId ? (
                        <button
                            type="button"
                            onClick={() => onOpenComments(post)}
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
}