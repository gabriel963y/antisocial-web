import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.ts'
import { userService } from '../../lib/api/userService.ts'
import { followService } from '../../lib/api/followService.ts'

export function Profile() {
    const { user } = useAuth()
    const [posts, setPosts] = useState<unknown[]>([])
    const [comments, setComments] = useState<unknown[]>([])
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
        <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="mb-6 flex items-center gap-2 text-sm text-lime-400/50">
                <span className="text-lime-400/70">{'>'}</span>
                <span>mi perfil</span>
                <span className="cursor-blink" />
            </div>

            <div className="grid grid-cols-1 gap-px bg-lime-400/10 md:grid-cols-2">
                <div className="bg-stone-950/90 p-5">
                    <h3 className="mb-4 text-[10px] uppercase tracking-[0.15em] text-lime-400/25">
                        [ mi perfil ]
                    </h3>
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-lime-400/20 bg-lime-400/[0.03]">
                            <span className="text-sm text-lime-400/60">
                                {user?.nickName?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-lime-400/80">
                                {user?.name} {user?.surname}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-lime-400/30">
                                @{user?.nickName} · {user?.email}
                            </p>
                            <p className="mt-0.5 text-[10px] text-lime-400/20">
                                seguidores: {user?.followers ?? 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-stone-950/90 p-5">
                    <h3 className="mb-4 text-[10px] uppercase tracking-[0.15em] text-lime-400/25">
                        [ posts ]
                    </h3>
                    {posts.length === 0 ? (
                        <p className="text-xs text-lime-400/15">sin posts</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {posts.slice(0, 5).map((p: any, i) => (
                                <li key={i} className="border-l border-lime-400/10 pl-3">
                                    <p className="line-clamp-1 text-xs text-lime-400/40">
                                        {p.description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-stone-950/90 p-5">
                    <h3 className="mb-4 text-[10px] uppercase tracking-[0.15em] text-lime-400/25">
                        [ comentarios ]
                    </h3>
                    {comments.length === 0 ? (
                        <p className="text-xs text-lime-400/15">sin comentarios</p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {comments.slice(0, 5).map((c: any, i) => (
                                <li key={i} className="border-l border-lime-400/10 pl-3">
                                    <p className="line-clamp-1 text-xs text-lime-400/40">
                                        {c.content ?? c.description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-stone-950/90 p-5">
                    <h3 className="mb-4 text-[10px] uppercase tracking-[0.15em] text-lime-400/25">
                        [ seguidos ]
                    </h3>
                    <div className="flex gap-6 text-xs">
                        <div>
                            <span className="text-lime-400/60">{following.length}</span>
                            <span className="ml-1 text-lime-400/25">siguiendo</span>
                        </div>
                        <div>
                            <span className="text-lime-400/60">{followers.length}</span>
                            <span className="ml-1 text-lime-400/25">seguidores</span>
                        </div>
                    </div>
                    {following.length > 0 && (
                        <ul className="mt-3 flex flex-col gap-1">
                            {following.map((f, i) => (
                                <li key={i} className="text-xs text-lime-400/40">
                                    @{f.following_nickName}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <Outlet />
        </div>
    )
}
