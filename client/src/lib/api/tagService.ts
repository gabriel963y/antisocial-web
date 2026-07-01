import { api } from './client.ts'
import { normalizeList, unwrapData } from '../helpers/apiHelpers.ts'
import type { ApiResponse, Tag } from '../../types/post.ts'

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

        return unwrapData(result)
    },
}