import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.ts'
import { userService } from '../../lib/api/userService.ts'
import { followService } from '../../lib/api/followService.ts'
import type { User } from '../../types/user.ts'

export function UserProfile() {
    const { nickName } = useParams<{ nickName: string }>()
    const { user: currentUser } = useAuth()
    const navigate = useNavigate()
    const [profileUser, setProfileUser] = useState<User | null>(null)
    const [isFollowing, setIsFollowing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [toggling, setToggling] = useState(false)

    useEffect(() => {
        if (!nickName) return
        setLoading(true)
        userService.getByNickName(nickName).then((u) => {
            setProfileUser(u)
            setLoading(false)
        }).catch(() => {
            navigate('/')
        })
    }, [nickName, navigate])

    useEffect(() => {
        if (!currentUser || !nickName || nickName === currentUser.nickName) return
        followService.getFollowing(currentUser.nickName).then((list) => {
            setIsFollowing(list.some((f) => f.following_nickName === nickName))
        }).catch(() => {})
    }, [currentUser, nickName])

    const handleToggleFollow = async () => {
        if (!currentUser || !nickName) return
        setToggling(true)
        try {
            if (isFollowing) {
                await followService.unfollow(currentUser.nickName, nickName)
                setIsFollowing(false)
            } else {
                await followService.follow(currentUser.nickName, nickName)
                setIsFollowing(true)
            }
        } catch {
            // ignore
        }
        setToggling(false)
    }

    if (loading || !profileUser) return null

    const isOwn = currentUser?.nickName === nickName

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="mb-6 text-sm text-lime-400/70">
                <span className="text-lime-400/70">{'>'}</span>
                <span className="ml-2">perfil de {nickName}</span>
            </div>

            <div className="glow-pulse overflow-hidden rounded-2xl border border-lime-400/40 bg-zinc-950 shadow-2xl transition-shadow hover:shadow-[0_0_30px_-6px_rgba(132,204,22,0.08)]">
                <div className="px-6 pb-6 pt-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-lime-400/30 bg-lime-400/[0.08]">
                            <span className="text-base font-semibold text-lime-400/80">
                                {profileUser.nickName?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-base font-medium text-lime-300">
                                {profileUser.name} {profileUser.surname}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-lime-400/50">
                                @{profileUser.nickName}
                            </p>
                            <p className="mt-2 text-xs text-lime-400/35">
                                {profileUser.email}
                            </p>
                            <p className="mt-0.5 text-[10px] text-lime-400/45">
                                seguidores: {profileUser.followers ?? 0}
                            </p>

                            {!isOwn && (
                                <button
                                    onClick={handleToggleFollow}
                                    disabled={toggling}
                                    className={`mt-4 rounded-xl px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-all disabled:opacity-25 ${
                                        isFollowing
                                            ? 'border border-lime-400/40 text-lime-400/70 hover:border-rose-400/50 hover:text-rose-400 hover:bg-rose-400/5'
                                            : 'bg-lime-400 text-black hover:bg-lime-300'
                                    }`}
                                >
                                    {isFollowing ? 'dejar de seguir' : 'seguir'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mt-6 text-xs text-lime-400/60 transition-colors hover:text-lime-400/70"
            >
                {'<-'} volver
            </button>
        </div>
    )
}
