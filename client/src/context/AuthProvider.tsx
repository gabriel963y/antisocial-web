import { useState, useCallback, type ReactNode } from 'react'
import { AuthContext } from './AuthContext.tsx'
import type { User } from '../types/user.ts'
import { userService } from '../lib/api/userService.ts'

const STORAGE_KEY = 'auth_user'

function loadUser(): User | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const user: User | null = raw ? (JSON.parse(raw) as User) : null
        if (user && !user.nickName && user._id) {
            user.nickName = user._id
        }
        return user
    } catch {
        return null
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(loadUser)

    const login = useCallback((u: User) => {
        setUser(u)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        localStorage.removeItem(STORAGE_KEY)
    }, [])

    const deleteAccount = useCallback(async () => {
        if (!user) return
        await userService.delete(user.nickName)
        logout()
    }, [user, logout])

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: user !== null, login, logout, deleteAccount }}
        >
            {children}
        </AuthContext.Provider>
    )
}
