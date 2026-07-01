import type { ApiResponse } from '../../types/post.ts'

export const normalizeList = <T,>(result: T[] | ApiResponse<T[]>): T[] => {
    if (Array.isArray(result)) {
        return result
    }

    if (Array.isArray(result.data)) {
        return result.data
    }

    return []
}

export const unwrapData = <T,>(result: T | ApiResponse<T>): T => {
    const response = result as ApiResponse<T>

    return response.data ?? (result as T)
}