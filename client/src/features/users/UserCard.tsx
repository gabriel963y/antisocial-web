import { Link } from 'react-router-dom'
import type { User } from '../../types/user.ts'

type UserCardProps = {
    user: User
}

export function UserCard({ user }: UserCardProps) {
    const nick = user.nickName ?? user._id

    return (
        <Link
            to={`/profile/${encodeURIComponent(nick)}`}
            className="glow-pulse block overflow-hidden rounded-2xl border border-lime-400/30 bg-zinc-950 shadow-2xl transition-all hover:border-lime-400/50 hover:shadow-[0_0_30px_-6px_rgba(132,204,22,0.08)]"
        >
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-lime-400/30 bg-lime-400/[0.06]">
                        <span className="text-sm font-semibold text-lime-400/80">
                            {nick.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-lime-300">
                            {user.name} {user.surname}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-lime-400/50">
                            @{nick}
                        </p>
                        <p className="mt-1.5 text-[10px] text-lime-400/35">
                            seguidores: {user.followers ?? 0}
                        </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-lime-400/30">▸</span>
                </div>
            </div>
        </Link>
    )
}
