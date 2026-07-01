import { api } from './client.ts'
import type {
    ApiResponse,
    CreatedPost,
    Post,
    PostImage,
} from '../../types/post.ts'

const normalizeList = <T,>(result: T[] | ApiResponse<T[]>) => {
    if (Array.isArray(result)) {
        return result
    }

    if (Array.isArray(result.data)) {
        return result.data
    }

    return []
}

const unwrapData = <T,>(result: T | ApiResponse<T>): T => {
    const response = result as ApiResponse<T>

    return response.data ?? (result as T)
}

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

    async getPosts(page = 1, limit = 5) {
        const result = await api.get<Post[] | ApiResponse<Post[]>>(
            `/posts?page=${page}&limit=${limit}`,
        )

        const posts = normalizeList(result)

        const total = Array.isArray(result)
            ? posts.length
            : result.total ?? posts.length

        const postsWithImages = await Promise.all(
            posts.map(async (post) => {
                const postId = getPostIdFromPost(post)

                if (!postId) {
                    return {
                        ...post,
                        images: [],
                    }
                }

                try {
                    const images = await postService.getPostImages(postId)

                    return {
                        ...post,
                        images,
                    }
                } catch (error) {
                    console.error(`ERROR IMÁGENES POST ${postId}:`, error)

                    return {
                        ...post,
                        images: [],
                    }
                }
            }),
        )

        return {
            posts: postsWithImages,
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