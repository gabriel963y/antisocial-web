import { API_BASE } from './endpoints.ts'

export class ApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

async function request<T>(
    endpoint: string,
    options?: RequestInit,
): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })

    if (!res.ok) {
        const body = await res.json().catch(() => null)
        const message = body?.error ?? body?.message ?? res.statusText
        throw new ApiError(res.status, message)
    }

    return res.json() as Promise<T>
}

export const api = {
    get: <T>(endpoint: string) => request<T>(endpoint),
    post: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        }),
    put: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        }),
    delete: <T>(endpoint: string) =>
        request<T>(endpoint, { method: 'DELETE' }),
}
