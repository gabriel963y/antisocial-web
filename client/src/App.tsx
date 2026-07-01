import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthProvider.tsx'
import { ProtectedRoute } from './components/ui/ProtectedRoute.tsx'
import { MainLayout } from './components/layout/MainLayout.tsx'
import { Login } from './features/auth/Login.tsx'
import { Register } from './features/auth/Register.tsx'
import { Feed } from './features/posts/Feed.tsx'
import { PostDetail } from './features/posts/PostDetail.tsx'
import { Profile } from './features/profile/Profile.tsx'
import { UserProfile } from './features/profile/UserProfile.tsx'
import { UserList } from './features/users/UserList.tsx'
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
                            <Route path="/post/:id" element={<PostDetail />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/profile/:nickName" element={<UserProfile />} />
                            <Route path="/users" element={<UserList />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                <Toaster
                    position="bottom-right"
                    theme="dark"
                    toastOptions={{
                        style: {
                            background: '#09090b',
                            border: '1px solid rgba(163,230,53,0.25)',
                            color: '#ecfccb',
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontFamily: "'JetBrains Mono', monospace",
                            boxShadow: '0 0 20px -6px rgba(163,230,53,0.1)',
                        },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App