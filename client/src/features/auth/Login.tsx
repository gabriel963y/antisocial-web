import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { api, ApiError } from '../../lib/api/client.ts'
import { ENDPOINTS } from '../../lib/api/endpoints.ts'
import { useAuth } from '../../hooks/useAuth.ts'
import { useConnectionStatus } from '../../hooks/useConnectionStatus.ts'
import { BlockTrail } from '../../components/ui/BlockTrail.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { Input } from '../../components/ui/Input.tsx'
import type { User } from '../../types/user.ts'

const loginSchema = z.object({
    nickName: z.string().min(1, 'el usuario es obligatorio'),
})

type LoginForm = z.infer<typeof loginSchema>

export function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const connected = useConnectionStatus()
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true)
        setServerError(null)

        try {
            const user = await api.get<User>(
                `${ENDPOINTS.USERS}/${encodeURIComponent(data.nickName)}`,
            )

            login(user)
            toast.success(`bienvenido de vuelta, ${user.nickName}`)
            navigate('/', { replace: true })
        } catch (err) {
            if (err instanceof ApiError && err.status === 404) {
                setServerError('usuario no encontrado')
            } else {
                setServerError('error de conexión')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-dvh items-center justify-center px-4">
            <div className="w-full max-w-sm border border-lime-400/10 bg-stone-950/90">
                <div className="flex items-center gap-1.5 border-b border-lime-400/10 px-3 py-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500/50" />
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-lime-500/50" />
                    <span className="ml-3 text-[10px] tracking-[0.2em] text-lime-400/30">
                        ANTI-SOCIAL v1.0 — login
                    </span>
                </div>

                <div className="p-6">
                    <div className="mb-7 flex items-center gap-2 text-sm text-lime-400/50">
                        <span className="text-lime-400/70">{'>'}</span>
                        <span>iniciá sesión para continuar</span>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <Input
                            label="usuario"
                            placeholder="tu usuario"
                            error={errors.nickName?.message}
                            {...register('nickName')}
                        />

                        {serverError && (
                            <p className="border border-rose-400/15 bg-rose-400/[0.04] px-3 py-2.5 text-sm text-rose-400/80">
                                ! {serverError}
                            </p>
                        )}

                        <Button type="submit" isLoading={isLoading}>
                            ingresar
                        </Button>
                    </form>

                    <div className="mt-6 border-t border-lime-400/10 pt-4 text-center text-xs text-lime-400/25">
                        {'>'} ¿nuevo?{' '}
                        <Link
                            to="/register"
                            className="text-lime-400/50 underline underline-offset-4 hover:text-lime-400 transition-colors"
                        >
                            registrate
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3 border-t border-lime-400/10 bg-lime-400/[0.01] px-3 py-2">
                    <BlockTrail connected={connected} />
                    <span className={`text-[10px] uppercase tracking-wider ${connected ? 'text-lime-400/30' : 'text-rose-400/40'}`}>
                        [{connected ? 'conectado' : 'desconectado'}]
                    </span>
                </div>
            </div>
        </div>
    )
}
