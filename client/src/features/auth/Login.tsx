import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api, ApiError } from '../../lib/api/client.ts';
import { ENDPOINTS } from '../../lib/api/endpoints.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { useConnectionStatus } from '../../hooks/useConnectionStatus.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { MatrixRain } from '../../components/effects/MatrixRain.tsx';
import type { User } from '../../types/user.ts';

const loginSchema = z.object({
    nickName: z.string().min(1, 'el usuario es obligatorio'),
    password: z
        .string()
        .min(6, 'la contraseña debe ser: "123456" (sin comillas)'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const connected = useConnectionStatus();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setServerError(null);

        if (data.password !== '123456') {
            setServerError('contraseña incorrecta');
            setIsLoading(false);
            return;
        }

        try {
            const user = await api.get<User>(
                `${ENDPOINTS.USERS}/${encodeURIComponent(data.nickName)}`
            );

            login(user);
            toast.success(`bienvenido de vuelta, ${user.nickName}`);
        } catch (err) {
            if (err instanceof ApiError && err.status === 404) {
                setServerError('usuario no encontrado');
            } else {
                setServerError('error de conexión');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flicker flex min-h-dvh items-center justify-center px-4">
            <MatrixRain />
            <div className="scanline-overlay" />
            <div className="glow-pulse relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-lime-400/30 bg-zinc-950 shadow-2xl">
                <div className="flex items-center justify-between border-b border-lime-400/15 px-5 py-4">
                    <span className="text-xs font-semibold text-lime-300">
                        iniciar sesión
                    </span>
                </div>

                <div className="p-5">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-5"
                    >
                        <Input
                            label="usuario"
                            placeholder="tu usuario"
                            error={errors.nickName?.message}
                            {...register('nickName')}
                        />

                        <Input
                            type="password"
                            label="contraseña"
                            placeholder="tu contraseña"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        {serverError && (
                            <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                                {serverError}
                            </p>
                        )}

                        <Button type="submit" isLoading={isLoading}>
                            ingresar
                        </Button>
                    </form>

                    <div className="mt-6 border-t border-lime-400/15 pt-4 text-center text-xs text-lime-400/45">
                        {'>'} ¿nuevo?{' '}
                        <Link
                            to="/register"
                            className="text-lime-400/70 underline underline-offset-4 hover:text-lime-300 transition-colors"
                        >
                            registrate
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3 border-t border-lime-400/15 bg-lime-400/[0.01] px-5 py-3">
                    <span className={`animate-signal ${connected ? 'text-lime-400' : 'text-rose-400/40'}`}>
                        <span />
                        <span />
                        <span />
                        <span />
                    </span>
                    <span
                        className={`text-[10px] uppercase tracking-wider ${connected ? 'text-lime-400/45' : 'text-rose-400/40'}`}
                    >
                        {connected ? 'conectado' : 'desconectado'}
                    </span>
                </div>
            </div>
        </div>
    );
}
