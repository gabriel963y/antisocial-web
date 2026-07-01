import { useEffect, useRef, useState } from 'react'
import { userService } from '../../lib/api/userService.ts'
import type { User } from '../../types/user.ts'
import { UserCard } from './UserCard.tsx'

const USERS_LIMIT = 20

export function UserList() {
    const [users, setUsers] = useState<User[]>([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [search, setSearch] = useState('')
    const loaderRef = useRef<HTMLDivElement | null>(null)

    const hasMore = users.length < total

    useEffect(() => {
        setInitialLoading(true)
        userService.getAll({ page: 1, limit: USERS_LIMIT })
            .then((res) => {
                setUsers(res)
                setTotal(res.length)
            })
            .catch(() => {})
            .finally(() => setInitialLoading(false))
    }, [])

    const loadMore = async () => {
        if (loading || !hasMore) return
        setLoading(true)
        try {
            const nextPage = page + 1
            const res = await userService.getAll({ page: nextPage, limit: USERS_LIMIT })
            setUsers((prev) => [...prev, ...res])
            setTotal((prev) => prev + res.length)
            setPage(nextPage)
        } catch {
            // ignore
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const loader = loaderRef.current
        if (!loader || loading || initialLoading || !hasMore || search.trim()) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) loadMore()
        })

        observer.observe(loader)
        return () => observer.disconnect()
    }, [loading, initialLoading, hasMore, search])

    const filtered = search.trim()
        ? users.filter((u) => {
            const q = search.toLowerCase()
            const nick = (u.nickName ?? u._id).toLowerCase()
            return nick.includes(q) || u.name.toLowerCase().includes(q)
        })
        : users

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="mb-6 flex items-center gap-2 text-sm text-lime-400/70">
                <span className="text-lime-400/70">{'>'}</span>
                <span>usuarios</span>
            </div>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="filtrar usuarios..."
                className="mb-6 w-full rounded-xl border border-lime-400/30 bg-black/40 px-4 py-2.5 text-sm text-lime-100 outline-none placeholder:text-lime-400/50 focus:border-lime-400/60"
            />

            {initialLoading ? (
                <p className="text-xs text-lime-400/40">cargando usuarios...</p>
            ) : filtered.length === 0 ? (
                <p className="text-xs text-lime-400/30">
                    {search.trim() ? 'no se encontraron usuarios' : 'sin usuarios'}
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map((u) => (
                        <UserCard key={u._id} user={u} />
                    ))}
                </div>
            )}

            {!search.trim() && hasMore && (
                <div ref={loaderRef} className="flex items-center justify-center py-6">
                    <p className="text-xs text-lime-400/45">
                        {loading ? 'cargando más usuarios...' : 'bajá para cargar más'}
                    </p>
                </div>
            )}

            {!search.trim() && !hasMore && users.length > 0 && (
                <p className="mt-4 text-center text-[10px] text-lime-400/30">
                    {users.length} usuarios
                </p>
            )}
        </div>
    )
}
