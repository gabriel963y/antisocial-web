import { api } from './client.ts'
import { normalizeList, unwrapData } from '../helpers/apiHelpers.ts'
import type { Comment } from '../../types/comment.ts'
import type { ApiResponse } from '../../types/post.ts'

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
        if (!id) {
            throw new Error('No se recibió el id del comentario')
        }

        const response = await fetch(`http://localhost:3000/api/comments/${id}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(errorText || 'No se pudo eliminar el comentario')
        }
    },
}