import { api } from './client.ts'
import type { Comment } from '../../types/comment.ts'

type ApiResponse<T> = {
    data?: T
    total?: number
    page?: number
    limit?: number
    message?: string
}

const API_URL = 'http://localhost:3000/api'

const normalizeList = <T,>(result: T[] | ApiResponse<T[]>): T[] => {
    if (Array.isArray(result)) return result
    if (Array.isArray(result.data)) return result.data
    return []
}

const unwrapData = <T,>(result: T | ApiResponse<T>): T => {
    const response = result as ApiResponse<T>
    return response.data ?? (result as T)
}

type CreateCommentData = {
    content: string
    user_nickName: string
    post_id: string
}

export const commentService = {
    async getByPost(postId: string) {
        const result = await api.get<Comment[] | ApiResponse<Comment[]>>(
            `/posts/${postId}/comments`,
        )

        return normalizeList(result)
    },

    async getPostComments(postId: string) {
        const result = await api.get<Comment[] | ApiResponse<Comment[]>>(
            `/posts/${postId}/comments`,
        )

        return normalizeList(result)
    },

    async create(data: CreateCommentData) {
        const result = await api.post<Comment | ApiResponse<Comment>>(
            '/comments',
            {
                post_id: data.post_id,
                postId: data.post_id,
                user_nickName: data.user_nickName,
                nickName: data.user_nickName,
                content: data.content,
                description: data.content,
            },
        )

        return unwrapData(result)
    },

    async createComment(postId: string, userNickName: string, content: string) {
        const result = await api.post<Comment | ApiResponse<Comment>>(
            '/comments',
            {
                post_id: postId,
                postId,
                user_nickName: userNickName,
                nickName: userNickName,
                content,
                description: content,
            },
        )

        return unwrapData(result)
    },

    async update(id: string, data: { content: string }) {
        const result = await api.put<Comment | ApiResponse<Comment>>(
            `/comments/${id}`,
            {
                content: data.content,
                description: data.content,
            },
        )

        return unwrapData(result)
    },

    async remove(id: string) {
        const response = await fetch(`${API_URL}/comments/${id}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('No se pudo eliminar el comentario')
        }
    },
}