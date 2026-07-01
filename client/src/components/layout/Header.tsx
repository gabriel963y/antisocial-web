import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.ts'
import { ConfirmModal } from '../ui/ConfirmModal.tsx'
import { userService } from '../../lib/api/userService.ts'
import type { User } from '../../types/user.ts'

type HeaderProps = {
    onOpenUpdateProfile?: () => void
}

export function Header({ onOpenUpdateProfile }: HeaderProps)  {
    const { user, logout, deleteAccount } = useAuth()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<User[]>([])
    const searchRef = useRef<HTMLDivElement>(null)
    const ref = useRef<HTMLDivElement>(null)
    const mobileRef = useRef<HTMLDivElement>(null)

    const closeMobile = () => setMobileOpen(false)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([])
            return
        }
        const timer = setTimeout(async () => {
            try {
                const users = await userService.getAll({ limit: 50 })
                const q = searchQuery.toLowerCase()
                setSearchResults(
                    users.filter(
                        (u) =>
                            (u.nickName ?? u._id).toLowerCase().includes(q) ||
                            u.name.toLowerCase().includes(q),
                    ),
                )
            } catch {
                setSearchResults([])
            }
        }, 200)
        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        if (!mobileOpen) return
        const handler = (e: MouseEvent) => {
            if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
                setMobileOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [mobileOpen])

    const handleLogout = () => {
        setOpen(false)
        closeMobile()
        logout()
        navigate('/login', { replace: true })
    }

    const handleDeleteAccount = async () => {
        setOpen(false)
        closeMobile()
        try {
            await deleteAccount()
        } catch {
            logout()
        }
        navigate('/login', { replace: true })
    }

    const searchInput = (
        <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="buscar usuarios..."
            className="w-36 rounded-xl border border-lime-400/30 bg-black/40 px-3 py-1.5 text-[11px] text-lime-100 outline-none placeholder:text-lime-400/50 focus:border-lime-400/60"
        />
    )

    const searchDropdown = searchQuery.trim() && searchResults.length > 0 && (
        <div className="glow-pulse absolute left-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-lime-400/40 bg-zinc-950 shadow-2xl z-50">
            <div className="border-b border-lime-400/15 px-3 py-2">
                <span className="text-[9px] tracking-[0.2em] text-lime-400/50">usuarios</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {searchResults.map((u) => {
                    try {
                        const nick = u?.nickName ?? u?._id ?? '?'
                        return (
                            <Link
                                key={nick}
                                to={`/profile/${encodeURIComponent(nick)}`}
                                onClick={() => { setSearchQuery(''); setSearchResults([]); closeMobile() }}
                                className="block border-b border-lime-400/15 px-3 py-3 last:border-b-0 hover:bg-lime-400/[0.04]"
                            >
                                <h3 className="mb-2 text-[10px] uppercase tracking-[0.15em] text-lime-400/45">
                                    [ {nick} ]
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-lime-400/30 bg-lime-400/[0.06]">
                                        <span className="text-xs text-lime-400/80">
                                            {nick.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-medium text-lime-300">
                                            {u?.name ?? ''} {u?.surname ?? ''}
                                        </p>
                                        <p className="truncate text-[10px] text-lime-400/50">
                                            @{nick} · {u?.email ?? ''}
                                        </p>
                                        <p className="text-[10px] text-lime-400/35">
                                            seguidores: {u?.followers ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )
                    } catch {
                        return null
                    }
                })}
            </div>
        </div>
    )

    return (
        <header className="border-b border-lime-400/15">
            <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="text-xs tracking-[0.2em] text-lime-400/70 hover:text-lime-400 transition-colors"
                    >
                        ANTI-SOCIAL
                    </Link>
                    <span className="hidden md:inline-block h-3 w-px bg-lime-400/10" />

                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            to="/"
                            className="rounded-xl border border-lime-400/30 bg-black/40 px-3 py-1.5 text-[11px] text-lime-400/80 hover:border-lime-400/40 hover:text-lime-300 transition-colors"
                        >
                            inicio
                        </Link>
                        <Link
                            to="/users"
                            className="rounded-xl border border-lime-400/30 bg-black/40 px-3 py-1.5 text-[11px] text-lime-400/80 hover:border-lime-400/40 hover:text-lime-300 transition-colors"
                        >
                            usuarios
                        </Link>
                    </nav>

                    <div className="hidden md:relative md:block" ref={searchRef}>
                        {searchInput}
                        {searchDropdown}
                    </div>
                </div>

                <div className="hidden md:relative md:block" ref={ref}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-1.5 rounded-xl border border-lime-400/30 bg-black/40 px-3 py-1.5 text-[11px] text-lime-400/80 hover:border-lime-400/40 hover:text-lime-300 transition-colors"
                    >
                        <span>{user?.nickName}@anti-social</span>
                        <span className={`inline-block transition-transform ${open ? 'rotate-90' : ''}`}>
                            ▸
                        </span>
                    </button>

                    {open && (
                        <div className="glow-pulse absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-lime-400/40 bg-zinc-950 shadow-2xl z-50">
                            <div className="border-b border-lime-400/15 px-4 py-3">
                                <span className="text-[10px] tracking-[0.2em] text-lime-400/50">
                                    {user?.name} {user?.surname}
                                </span>
                            </div>

                            <div className="p-1">
                                <Link
                                    to="/profile"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center rounded-lg px-3 py-2 text-[11px] text-lime-400/70 hover:bg-lime-400/[0.06] hover:text-lime-300 transition-colors"
                                >
                                    mi perfil
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => { setOpen(false); onOpenUpdateProfile?.() }}
                                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-[11px] text-lime-400/70 hover:bg-lime-400/[0.06] hover:text-lime-300 transition-colors"
                                >
                                    actualizar información
                                </button>

                                <div className="my-1 border-t border-lime-400/15" />

                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-[11px] text-rose-400/50 hover:bg-rose-400/[0.06] hover:text-rose-300 transition-colors"
                                >
                                    cerrar sesión
                                </button>

                                <button
                                    onClick={() => { setOpen(false); setShowDeleteConfirm(true) }}
                                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-[11px] text-lime-400/60 hover:bg-rose-400/[0.08] hover:text-rose-400 transition-colors"
                                >
                                    eliminar mi cuenta
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div ref={mobileRef} className="md:hidden">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="rounded-xl border border-lime-400/30 bg-black/40 px-3 py-1.5 text-[11px] text-lime-400/80 hover:border-lime-400/40 hover:text-lime-300 transition-colors"
                    >
                        {mobileOpen ? '✕' : '☰'}
                    </button>

                    {mobileOpen && (
                        <div className="fixed inset-x-0 top-12 bottom-0 z-50 overflow-y-auto border-t border-lime-400/15 bg-zinc-950">
                            <div className="mx-auto max-w-5xl px-4 py-4 flex flex-col gap-3">
                                <div className="overflow-hidden rounded-2xl border border-lime-400/40 bg-zinc-950">
                                    <div className="border-b border-lime-400/15 px-4 py-3">
                                        <span className="text-[10px] tracking-[0.2em] text-lime-400/50">
                                            navegación
                                        </span>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <Link
                                            to="/"
                                            onClick={closeMobile}
                                            className="flex items-center rounded-lg px-3 py-2 text-[11px] text-lime-400/70 hover:bg-lime-400/[0.06] hover:text-lime-300 transition-colors"
                                        >
                                            inicio
                                        </Link>
                                        <Link
                                            to="/users"
                                            onClick={closeMobile}
                                            className="flex items-center rounded-lg px-3 py-2 text-[11px] text-lime-400/70 hover:bg-lime-400/[0.06] hover:text-lime-300 transition-colors"
                                        >
                                            usuarios
                                        </Link>
                                        <Link
                                            to="/profile"
                                            onClick={closeMobile}
                                            className="flex items-center rounded-lg px-3 py-2 text-[11px] text-lime-400/70 hover:bg-lime-400/[0.06] hover:text-lime-300 transition-colors"
                                        >
                                            mi perfil
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => { closeMobile(); onOpenUpdateProfile?.() }}
                                            className="flex w-full items-center rounded-lg px-3 py-2 text-left text-[11px] text-lime-400/70 hover:bg-lime-400/[0.06] hover:text-lime-300 transition-colors"
                                        >
                                            actualizar información
                                        </button>
                                        <div className="my-1 border-t border-lime-400/15" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center rounded-lg px-3 py-2 text-left text-[11px] text-rose-400/50 hover:bg-rose-400/[0.06] hover:text-rose-300 transition-colors"
                                        >
                                            cerrar sesión
                                        </button>
                                        <button
                                            onClick={() => { closeMobile(); setShowDeleteConfirm(true) }}
                                            className="flex w-full items-center rounded-lg px-3 py-2 text-left text-[11px] text-lime-400/60 hover:bg-rose-400/[0.08] hover:text-rose-400 transition-colors"
                                        >
                                            eliminar mi cuenta
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    {searchInput}
                                    {searchDropdown}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                open={showDeleteConfirm}
                title="eliminar cuenta"
                message="¿Estás seguro de que querés eliminar tu cuenta? Esta acción no se puede deshacer."
                confirmText="sí, eliminar"
                cancelText="no"
                onConfirm={handleDeleteAccount}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </header>
    )
}
