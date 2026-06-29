import { api } from './client.ts'
import { ENDPOINTS } from './endpoints.ts'
import type { Comment } from '../../types/comment.ts'

export const commentService = {
  getByPost: (postId: string) =>
    api.get<Comment[]>(`/posts/${postId}/comments`),

  create: (data: { content: string; user_nickName: string; post_id: string }) =>
    api.post<Comment>(ENDPOINTS.COMMENTS, data),

  update: (id: string, data: { content: string }) =>
    api.put<Comment>(`${ENDPOINTS.COMMENTS}/${id}`, data),

  remove: (id: string) =>
    api.delete<void>(`${ENDPOINTS.COMMENTS}/${id}`),
}
