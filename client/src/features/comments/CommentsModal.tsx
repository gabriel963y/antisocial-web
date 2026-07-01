import { useState } from 'react'
import { CommentForm } from './CommentForm.tsx'
import { CommentList } from './CommentList.tsx'
import { getPostId, getPostUser } from '../../lib/helpers/postHelpers.ts'
import type { Post } from '../../types/post.ts'

type CommentsModalProps = {
    post: Post
    onClose: () => void
    onCommentCreated?: () => void
    onCommentDeleted?: () => void
}

export function CommentsModal({
    post,
    onClose,
    onCommentCreated,
    onCommentDeleted,
}: CommentsModalProps) {
    const [reloadKey, setReloadKey] = useState(0)

    const postId = getPostId(post)
    const postOwnerNickName = getPostUser(post)

    if (!postId) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
            <div className="glow-pulse flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-lime-400/30 bg-zinc-950 text-lime-100 shadow-2xl">
                <div className="flex items-center justify-between border-b border-lime-400/15 px-5 py-4">
                    <h2 className="text-lg font-semibold text-lime-300">
                        Comentarios
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-3 py-1 text-xl text-lime-400/80 hover:bg-lime-400/10 hover:text-lime-300"
                    >
                        ×
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                    <div className="mb-5 border-b border-lime-400/15 pb-4">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lime-400/30 bg-lime-400/[0.08]">
                                <span className="text-sm font-semibold text-lime-400/80">
                                    {postOwnerNickName.charAt(0).toUpperCase()}
                                </span>
                            </div>

                            <p className="text-sm font-semibold text-lime-300">
                                {postOwnerNickName}
                            </p>
                        </div>

                        <p className="whitespace-pre-wrap text-sm leading-6 text-lime-100">
                            {post.description}
                        </p>
                    </div>

                    <CommentList
                        key={reloadKey}
                        postId={postId}
                        onCommentDeleted={() => {
                            onCommentDeleted?.()
                        }}
                    />
                </div>

                <div className="border-t border-lime-400/15 px-5 py-4">
                    <CommentForm
                        postId={postId}
                        onCommentCreated={() => {
                            setReloadKey((key) => key + 1)
                            onCommentCreated?.()
                        }}
                    />
                </div>
            </div>
        </div>
    )
}