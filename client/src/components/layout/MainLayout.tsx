import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.ts'
import { useUIStore } from '../../stores/useUIStore.ts'
import { Header } from './Header.tsx'
import { CreatePost } from '../../features/posts/CreatePost.tsx'
import { UpdateProfileModal } from '../../features/profile/UpdateProfileModal.tsx'
import { MatrixRain } from '../effects/MatrixRain.tsx'
import { TerminalStatus } from '../effects/TerminalStatus.tsx'

export function MainLayout() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const isCreatePostOpen = useUIStore((s) => s.isCreatePostOpen)
    const setIsCreatePostOpen = useUIStore((s) => s.setIsCreatePostOpen)
    const isUpdateProfileOpen = useUIStore((s) => s.isUpdateProfileOpen)
    const setIsUpdateProfileOpen = useUIStore((s) => s.setIsUpdateProfileOpen)

    const handleOpenCreatePost = () => {
        if (!user) {
            navigate('/login')
            return
        }
        setIsCreatePostOpen(true)
    }

    return (
        <div className="flicker flex min-h-dvh flex-col">
            <MatrixRain />
            <div className="scanline-overlay" />

            <Header
                onOpenUpdateProfile={() => setIsUpdateProfileOpen(true)}
            />

            <main className="relative z-10 flex-1">
                <Outlet />
            </main>

            <footer className="relative z-10 border-t border-lime-400/10 px-4 py-2">
                <TerminalStatus />
            </footer>

            <button
                type="button"
                onClick={handleOpenCreatePost}
                className="fixed bottom-16 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-lime-400/30 bg-stone-950 text-2xl text-lime-400 shadow-lg shadow-lime-400/10 transition-all hover:bg-lime-400 hover:text-stone-950 hover:shadow-lime-400/25 active:scale-95"
            >
                +
            </button>

            {isCreatePostOpen && (
                <CreatePost onClose={() => setIsCreatePostOpen(false)} />
            )}

            {isUpdateProfileOpen && (
                <UpdateProfileModal onClose={() => setIsUpdateProfileOpen(false)} />
            )}
        </div>
    )
}
