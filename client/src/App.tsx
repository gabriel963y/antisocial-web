import { BrowserRouter, Routes, Route, Navigate, Router } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthProvider.tsx'
import { ProtectedRoute } from './components/ui/ProtectedRoute.tsx'
import { MainLayout } from './components/layout/MainLayout.tsx'
import { Login } from './features/auth/Login.tsx'
import { Register } from './features/auth/Register.tsx'
import { Feed } from './features/posts/Feed.tsx'
import { Profile } from './features/profile/Profile.tsx'
import { UserProfile } from './features/profile/UserProfile.tsx'
import { UpdateProfileModal } from './features/profile/UpdateProfileModal.tsx'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Feed />} />
                            <Route path="/profile" element={<Profile />}>
                                <Route path="edit" element={<UpdateProfileModal />} />
                            </Route>
                            <Route path="/profile/:nickName" element={<UserProfile />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <Toaster
                    position="bottom-right"
                    theme="dark"
                    toastOptions={{
                        style: {
                            background: '#1a1a1a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#f5f5f5',
                        },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App