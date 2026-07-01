import { api } from './client.ts'
import { normalizeList, unwrapData } from '../helpers/apiHelpers.ts'
import type {
    ApiResponse,
    CreatedPost,
    Post,
    PostImage,
    Tag,
} from '../../types/post.ts'

const getCreatedPostId = (result: CreatedPost | ApiResponse<CreatedPost>) => {
    const post = unwrapData(result)

    return post.post_id ?? post.id ?? post._id
}

const getPostIdFromPost = (post: Post) => {
    return post.post_id ?? post.id ?? post._id ?? ''
}

export const postService = {
    async getPostImages(postId: string) {
        const result = await api.get<PostImage[] | ApiResponse<PostImage[]>>(
            `/posts/${postId}/images`,
        )

        return normalizeList(result)
    },

    async getPostTags(postId: string) {
        const result = await api.get<Tag[] | ApiResponse<Tag[]>>(
            `/posts/${postId}/tags`,
        )

        return normalizeList(result)
    },

    async getPosts(page = 1, limit = 5) {
        const result = await api.get<Post[] | ApiResponse<Post[]>>(
            `/posts?page=${page}&limit=${limit}`,
        )

        const posts = normalizeList(result)

        const total = Array.isArray(result)
            ? posts.length
            : result.total ?? posts.length

        const postsWithExtras = await Promise.all(
            posts.map(async (post) => {
                const postId = getPostIdFromPost(post)

                if (!postId) {
                    return {
                        ...post,
                        images: [],
                        tags: [],
                    }
                }

                try {
                    const [images, tags] = await Promise.all([
                        postService.getPostImages(postId),
                        postService.getPostTags(postId),
                    ])

                    return {
                        ...post,
                        images,
                        tags,
                    }
                } catch (error) {
                    console.error(`ERROR EXTRAS POST ${postId}:`, error)

                    return {
                        ...post,
                        images: [],
                        tags: [],
                    }
                }
            }),
        )

        return {
            posts: postsWithExtras,
            total,
        }
    },

    async createPost(description: string, userNickName: string) {
        const result = await api.post<CreatedPost | ApiResponse<CreatedPost>>(
            '/posts',
            {
                description,
                user_nickName: userNickName,
            },
        )

        const postId = getCreatedPostId(result)

        if (!postId) {
            throw new Error('No se pudo obtener el id del post creado')
        }

        return postId
    },

    async addImage(postId: string, url: string) {
        return api.post(`/posts/${postId}/images`, {
            url,
            url_image: url,
        })
    },

    async addTag(postId: string, tagId: string) {
        return api.post(`/posts/${postId}/tags`, {
            tag_id: tagId,
        })
    },
}