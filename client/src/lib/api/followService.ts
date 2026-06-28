import { api } from './client.ts'

interface FollowDoc {
    follower_nickName: string
    following_nickName: string
}

export const followService = {
    getFollowers: (nick: string) =>
        api.get<FollowDoc[]>(`/follow/${encodeURIComponent(nick)}/followers`),

    getFollowing: (nick: string) =>
        api.get<FollowDoc[]>(`/follow/${encodeURIComponent(nick)}/following`),

    follow: (follower: string, following: string) =>
        api.post<{ message: string }>(`/follow/${encodeURIComponent(follower)}/${encodeURIComponent(following)}`, undefined),

    unfollow: (follower: string, following: string) =>
        api.delete<{ message: string }>(`/follow/${encodeURIComponent(follower)}/${encodeURIComponent(following)}`),
}
