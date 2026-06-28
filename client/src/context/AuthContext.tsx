import { createContext } from 'react'
import type { User } from '../types/user.ts'

export interface AuthContextValue {
    user: User | null
    isAuthenticated: boolean
    login: (user: User) => void
    logout: () => void
    deleteAccount: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
