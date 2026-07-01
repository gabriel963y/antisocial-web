import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header.tsx'
import { CreatePost } from '../../features/posts/CreatePost.tsx'

export function MainLayout() {
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)

    return (
        <div className="flex min-h-dvh flex-col">
            <Header onOpenCreatePost={() => setIsCreatePostOpen(true)} />

            <main className="flex-1">
                <Outlet />
            </main>

            {isCreatePostOpen && (
                <CreatePost onClose={() => setIsCreatePostOpen(false)} />
            )}
        </div>
    )
}