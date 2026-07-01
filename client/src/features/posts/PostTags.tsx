import { getTagId, getTagName } from '../../lib/helpers/postHelpers.ts'
import type { Post } from '../../types/post.ts'

type PostTagsProps = {
    post: Post
}

export function PostTags({ post }: PostTagsProps) {
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