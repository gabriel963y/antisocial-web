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
        <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="mb-6 flex items-center gap-2 text-sm text-lime-400/50">
                <span className="text-lime-400/70">{'>'}</span>
                <span>perfil de {nickName}</span>
                <span className="cursor-blink" />
            </div>

            <div className="border border-lime-400/15 bg-stone-950/90 p-5">
                <h3 className="mb-4 text-[10px] uppercase tracking-[0.15em] text-lime-400/25">
                    [ {profileUser.nickName} ]
                </h3>
                <div className="flex items-start gap-4 min-w-0">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-lime-400/20 bg-lime-400/[0.03]">
                        <span className="text-base text-lime-400/60">
                            {profileUser.nickName?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-lime-400/80">
                            {profileUser.name} {profileUser.surname}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-lime-400/30">
                            @{profileUser.nickName} · {profileUser.email}
                        </p>
                        <p className="mt-0.5 text-[10px] text-lime-400/20">
                            seguidores: {profileUser.followers ?? 0}
                        </p>

                        {!isOwn && (
                            <button
                                onClick={handleToggleFollow}
                                disabled={toggling}
                                className={`mt-3 px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] transition-all disabled:opacity-25 ${
                                    isFollowing
                                        ? 'border border-lime-400/30 text-lime-400/50 hover:border-rose-400/50 hover:text-rose-400'
                                        : 'border border-lime-400/50 bg-lime-400/[0.06] text-lime-400 hover:bg-lime-400 hover:text-stone-950'
                                }`}
                            >
                                {isFollowing ? 'dejar de seguir' : 'seguir'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
