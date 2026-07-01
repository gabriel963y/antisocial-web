import { api } from './client.ts'
import type { ApiResponse, Tag } from '../../types/post.ts'

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

export const tagService = {
    async getTags(): Promise<Tag[]> {
        const result = await api.get<Tag[] | ApiResponse<Tag[]>>(
            '/tags?page=1&limit=100',
        )

        return normalizeList(result)
    },

    async createTag(name: string): Promise<Tag> {
        const result = await api.post<Tag | ApiResponse<Tag>>('/tags', {
            name,
            description: name,
        })

        return unwrapData<Tag>(result)
    },
}