import { api } from './client.ts'
import { ENDPOINTS } from './endpoints.ts'
import type { User } from '../../types/user.ts'
import type { Post } from '../../types/post.ts'
import type { Comment } from '../../types/comment.ts'

interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
}

export const userService = {
    getAll: async (params?: { page?: number; limit?: number }) => {
        const query = new URLSearchParams()
        if (params?.page) query.set('page', String(params.page))
        if (params?.limit) query.set('limit', String(params.limit))
        const qs = query.toString()
        const res = await api.get<PaginatedResponse<User>>(`${ENDPOINTS.USERS}${qs ? `?${qs}` : ''}`)
        return res.data
    },

    getByNickName: (nickName: string) =>
        api.get<User>(`${ENDPOINTS.USERS}/${encodeURIComponent(nickName)}`),

    create: (data: { nickName: string; email: string; name: string; surname?: string }) =>
        api.post<User>(ENDPOINTS.USERS, data),

    update: (nickName: string, data: { name?: string; surname?: string }) =>
        api.put<User>(`${ENDPOINTS.USERS}/${encodeURIComponent(nickName)}`, data),

    delete: (nickName: string) =>
        api.delete<void>(`${ENDPOINTS.USERS}/${encodeURIComponent(nickName)}`),

    getPosts: (nickName: string) =>
        api.get<Post[]>(`${ENDPOINTS.USERS}/${encodeURIComponent(nickName)}/posts`),

    getComments: (nickName: string) =>
        api.get<Comment[]>(`${ENDPOINTS.USERS}/${encodeURIComponent(nickName)}/comments`),
}
