import { getTagId, getTagName } from '../../lib/helpers/postHelpers.ts'
import type { Post } from '../../types/post.ts'

type PostTagsProps = {
    post: Post
    onRemoveTag?: (tagId: string) => void
}

export function PostTags({ post, onRemoveTag }: PostTagsProps) {
    if (!post.tags || post.tags.length === 0) return null

    return (
        <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, tagIndex) => {
                const tagId = getTagId(tag)
                return (
                    <span
                        key={tagId || tagIndex}
                        className="group inline-flex items-center gap-1 rounded-full border border-lime-400/35 bg-lime-400/[0.10] px-3 py-1 text-xs text-lime-400/80"
                    >
                        <span>#{getTagName(tag)}</span>
                        {onRemoveTag && tagId && (
                            <button
                                type="button"
                                onClick={() => onRemoveTag(tagId)}
                                className="ml-0.5 inline-flex leading-none text-lime-400/60 hover:text-red-400"
                            >
                                ×
                            </button>
                        )}
                    </span>
                )
            })}
        </div>
    )
}
