import type { Post, PostImage, Tag } from '../../types/post.ts'

export const getPostId = (post: Post) => {
    return post.post_id ?? post.id ?? post._id ?? ''
}

export const getPostUser = (post: Post) => {
    return post.user_nickName ?? post.userNickName ?? post.nickName ?? 'usuario'
}

export const getCommentCount = (post: Post) => {
    return post.commentsCount ?? post.commentCount ?? post.comments?.length ?? 0
}

export const getTagId = (tag: Tag) => {
    return tag.tag_id ?? tag.id ?? tag._id ?? ''
}

export const getTagName = (tag: Tag) => {
    return tag.name ?? tag.label ?? tag.description ?? 'tag'
}

export const getPostImages = (post: Post) => {
    return post.images ?? post.postImages ?? post.post_images ?? []
}

export const getPostImageUrl = (image: PostImage) => {
    return image.url_image ?? image.url ?? ''
}