import { create } from 'zustand'

interface UIState {
    isCreatePostOpen: boolean
    isUpdateProfileOpen: boolean
    setIsCreatePostOpen: (open: boolean) => void
    setIsUpdateProfileOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
    isCreatePostOpen: false,
    isUpdateProfileOpen: false,
    setIsCreatePostOpen: (open) => set({ isCreatePostOpen: open }),
    setIsUpdateProfileOpen: (open) => set({ isUpdateProfileOpen: open }),
}))
