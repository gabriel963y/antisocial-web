export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export const ENDPOINTS = {
    USERS: '/users',
    POSTS: '/posts',
    TAGS: '/tags',
    COMMENTS: '/comments',
    POSTIMAGES: '/postimages',
} as const
