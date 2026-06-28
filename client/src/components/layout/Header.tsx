import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.ts'
import { ConfirmModal } from '../ui/ConfirmModal.tsx'
import { userService } from '../../lib/api/userService.ts'
import type { User } from '../../types/user.ts'

export function Header() {
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
            placeholder="buscar usuarios…"
            className="w-36 border border-lime-400/10 bg-transparent px-2 py-1 text-[11px] text-lime-400/60 outline-none placeholder:text-lime-400/15 focus:border-lime-400/30"
        />
    )

    const searchDropdown = searchQuery.trim() && searchResults.length > 0 && (
        <div className="absolute left-0 top-full mt-1 w-72 border border-lime-400/15 bg-stone-950/95 backdrop-blur-sm z-50 max-h-80 overflow-y-auto">
            {searchResults.map((u) => {
                try {
                    const nick = u?.nickName ?? u?._id ?? '?'
                    return (
                        <Link
                            key={nick}
                            to={`/profile/${encodeURIComponent(nick)}`}
                            onClick={() => { setSearchQuery(''); setSearchResults([]); closeMobile() }}
                            className="block border-b border-lime-400/10 px-3 py-3 last:border-b-0 hover:bg-lime-400/[0.02]"
                        >
                            <h3 className="mb-2 text-[10px] uppercase tracking-[0.15em] text-lime-400/25">
                                [ {nick} ]
                            </h3>
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-lime-400/20 bg-lime-400/[0.03]">
                                    <span className="text-xs text-lime-400/60">
                                        {nick.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-medium text-lime-400/80">
                                        {u?.name ?? ''} {u?.surname ?? ''}
                                    </p>
                                    <p className="truncate text-[10px] text-lime-400/30">
                                        @{nick} · {u?.email ?? ''}
                                    </p>
                                    <p className="text-[10px] text-lime-400/20">
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
    )

    return (
        <header className="border-b border-lime-400/10">
            <div className="mx-auto flex h-11 max-w-5xl items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="text-xs tracking-[0.2em] text-lime-400/50 hover:text-lime-400 transition-colors"
                    >
                        ANTI-SOCIAL
                    </Link>
                    <span className="hidden md:inline-block h-3 w-px bg-lime-400/10" />

                    <nav className="hidden md:flex items-center gap-3">
                        <Link
                            to="/"
                            className="text-[11px] text-lime-400/30 hover:text-lime-400/60 transition-colors"
                        >
                            inicio
                        </Link>
                        <Link
                            to="/create"
                            className="text-[11px] text-lime-400/30 hover:text-lime-400/60 transition-colors"
                        >
                            nuevo post
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
                        className="flex items-center gap-1.5 text-[11px] text-lime-400/30 hover:text-lime-400/60 transition-colors"
                    >
                        <span>{user?.nickName}@anti-social</span>
                        <span className={`inline-block transition-transform ${open ? 'rotate-90' : ''}`}>
                            ▸
                        </span>
                    </button>

                    {open && (
                        <div className="absolute right-0 top-full mt-1 w-48 border border-lime-400/15 bg-stone-950/95 backdrop-blur-sm z-50">
                            <div className="border-b border-lime-400/10 px-3 py-2 text-[10px] text-lime-400/25">
                                {user?.name} {user?.surname}
                            </div>

                            <Link
                                to="/profile"
                                onClick={() => setOpen(false)}
                                className="flex items-center px-3 py-2 text-[11px] text-lime-400/40 hover:bg-lime-400/[0.04] hover:text-lime-400/70 transition-colors"
                            >
                                mi perfil
                            </Link>

                            <Link
                                to="/profile/edit"
                                onClick={() => setOpen(false)}
                                className="flex items-center px-3 py-2 text-[11px] text-lime-400/40 hover:bg-lime-400/[0.04] hover:text-lime-400/70 transition-colors"
                            >
                                actualizar información
                            </Link>

                            <div className="border-t border-lime-400/10">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center px-3 py-2 text-[11px] text-rose-400/50 hover:bg-rose-400/[0.04] hover:text-rose-400 transition-colors"
                                >
                                    cerrar sesión
                                </button>
                            </div>

                            <div className="border-t border-red-400/10">
                                <button
                                    onClick={() => { setOpen(false); setShowDeleteConfirm(true) }}
                                    className="flex w-full items-center px-3 py-2 text-[11px] text-red-400 bg-red-400/20 hover:bg-red-400 hover:text-stone-950 transition-colors"
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
                        className="text-[11px] text-lime-400/30 hover:text-lime-400/60 transition-colors"
                    >
                        {mobileOpen ? '✕' : '☰'}
                    </button>

                    {mobileOpen && (
                        <div className="fixed inset-x-0 top-11 bottom-0 border-t border-lime-400/10 bg-stone-950/95 overflow-y-auto z-50">
                            <div className="mx-auto max-w-5xl px-4 py-3 flex flex-col gap-3">
                        <Link
                            to="/"
                            onClick={closeMobile}
                            className="text-[11px] text-lime-400/40 hover:text-lime-400/70 transition-colors"
                        >
                            inicio
                        </Link>
                        <Link
                            to="/create"
                            onClick={closeMobile}
                            className="text-[11px] text-lime-400/40 hover:text-lime-400/70 transition-colors"
                        >
                            nuevo post
                        </Link>

                        <div className="relative" ref={searchRef}>
                            {searchInput}
                            {searchDropdown}
                        </div>

                        <div className="border-t border-lime-400/10 pt-3">
                            <p className="mb-2 text-[10px] text-lime-400/25">
                                {user?.name} {user?.surname}
                            </p>
                            <div className="flex flex-col gap-1">
                                <Link
                                    to="/profile"
                                    onClick={closeMobile}
                                    className="text-[11px] text-lime-400/40 hover:text-lime-400/70 transition-colors"
                                >
                                    mi perfil
                                </Link>
                                <Link
                                    to="/profile/edit"
                                    onClick={closeMobile}
                                    className="text-[11px] text-lime-400/40 hover:text-lime-400/70 transition-colors"
                                >
                                    actualizar información
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-left text-[11px] text-rose-400/50 hover:text-rose-400 transition-colors"
                                >
                                    cerrar sesión
                                </button>
                                <button
                                    onClick={() => { closeMobile(); setShowDeleteConfirm(true) }}
                                    className="flex items-center text-left text-[11px] text-red-400/70 hover:text-red-400 transition-colors"
                                >
                                    eliminar mi cuenta
                                </button>
                            </div>
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
