import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.ts'
import { userService } from '../../lib/api/userService.ts'
import { followService } from '../../lib/api/followService.ts'
import type { Post } from '../../types/post.ts'
import type { Comment } from '../../types/comment.ts'

export function Profile() {
    const { user } = useAuth()
    const [posts, setPosts] = useState<Post[]>([])
    const [comments, setComments] = useState<Comment[]>([])
    const [following, setFollowing] = useState<{ following_nickName: string }[]>([])
    const [followers, setFollowers] = useState<{ follower_nickName: string }[]>([])

    useEffect(() => {
        if (!user) return

        userService.getPosts(user.nickName).then(setPosts).catch(() => {})
        userService.getComments(user.nickName).then(setComments).catch(() => {})
        followService.getFollowing(user.nickName).then(setFollowing).catch(() => {})
        followService.getFollowers(user.nickName).then(setFollowers).catch(() => {})
    }, [user])

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="mb-6 flex items-center gap-2 text-sm text-lime-400/70">
                <span className="text-lime-400/70">{'>'}</span>
                <span>mi perfil</span>
            </div>

            <div className="flex items-center gap-4 border-b border-lime-400/15 pb-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-lime-400/30 bg-lime-400/[0.06]">
                    <span className="text-lg text-lime-400/80">
                        {user?.nickName?.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="min-w-0">
                    <p className="truncate text-base font-medium text-lime-300">
                        {user?.name} {user?.surname}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-lime-400/50">
                        @{user?.nickName} · {user?.email}
                    </p>
                    <p className="mt-0.5 text-xs text-lime-400/35">
                        seguidores: {user?.followers ?? 0}
                    </p>
                </div>
            </div>

            <div className="divide-y divide-lime-400/10">
                <div className="py-6">
                    <h3 className="mb-3 text-[10px] uppercase tracking-[0.15em] text-lime-400/45">
                        [ posts ]
                    </h3>
                    {posts.length === 0 ? (
                        <p className="text-xs text-lime-400/30">sin posts</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {posts.slice(0, 5).map((p, i) => (
                                <li key={p._id ?? i}>
                                    <Link
                                        to={`/post/${p._id}`}
                                        className="block rounded-xl border border-lime-400/30 bg-black/40 px-4 py-3 hover:border-lime-400/40 hover:bg-lime-400/[0.02] transition-colors"
                                    >
                                        <p className="line-clamp-1 text-xs text-lime-400/80">
                                            {p.description}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="py-6">
                    <h3 className="mb-3 text-[10px] uppercase tracking-[0.15em] text-lime-400/45">
                        [ comentarios ]
                    </h3>
                    {comments.length === 0 ? (
                        <p className="text-xs text-lime-400/30">sin comentarios</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {comments.slice(0, 5).map((c, i) => (
                                <li key={c._id ?? i} className="rounded-xl border border-lime-400/30 bg-black/40 px-4 py-3">
                                    <p className="line-clamp-1 text-xs text-lime-400/80">
                                        {c.content}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="py-6 space-y-5">
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-lime-400/45">
                            <span>[ siguiendo ]</span>
                            <span className="text-lime-400/70">{following.length}</span>
                        </div>
                        {following.length === 0 ? (
                            <p className="text-xs text-lime-400/30">no sigue a nadie</p>
                        ) : (
                            <ul className="flex flex-wrap gap-2">
                                {following.map((f, i) => (
                                    <li key={i}>
                                        <Link
                                            to={`/profile/${encodeURIComponent(f.following_nickName)}`}
                                            className="inline-block rounded-full border border-lime-400/30 bg-lime-400/[0.10] px-3 py-1 text-xs text-lime-400/80 hover:border-lime-400/50 hover:text-lime-300 transition-colors"
                                        >
                                            @{f.following_nickName}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-lime-400/45">
                            <span>[ seguidores ]</span>
                            <span className="text-lime-400/70">{followers.length}</span>
                        </div>
                        {followers.length === 0 ? (
                            <p className="text-xs text-lime-400/30">sin seguidores</p>
                        ) : (
                            <ul className="flex flex-wrap gap-2">
                                {followers.map((f, i) => (
                                    <li key={i}>
                                        <Link
                                            to={`/profile/${encodeURIComponent(f.follower_nickName)}`}
                                            className="inline-block rounded-full border border-lime-400/30 bg-lime-400/[0.10] px-3 py-1 text-xs text-lime-400/80 hover:border-lime-400/50 hover:text-lime-300 transition-colors"
                                        >
                                            @{f.follower_nickName}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <Outlet />
        </div>
    )
}
