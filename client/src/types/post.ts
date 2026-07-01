export type Tag = {
    id?: string
    _id?: string
    tag_id?: string
    name?: string
    label?: string
    description?: string
}

export type PostImage = {
    id?: string
    _id?: string
    image_id?: string
    post_id?: string
    url?: string
    url_image?: string
}

export type Post = {
    id?: string
    _id?: string
    post_id?: string
    description?: string
    user_nickName?: string
    nickName?: string
    userNickName?: string
    dateTime?: string
    commentsCount?: number
    commentCount?: number
    comments?: unknown[]
    tags?: Tag[]
    images?: PostImage[]
    postImages?: PostImage[]
    post_images?: PostImage[]
}

export type CreatedPost = {
    id?: string
    _id?: string
    post_id?: string
}

export type ApiResponse<T> = {
    data?: T
    total?: number
    page?: number
    limit?: number
    message?: string
}