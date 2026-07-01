import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api, ApiError } from '../../lib/api/client.ts';
import { ENDPOINTS } from '../../lib/api/endpoints.ts';
import { useConnectionStatus } from '../../hooks/useConnectionStatus.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { MatrixRain } from '../../components/effects/MatrixRain.tsx';

const registerSchema = z.object({
    nickName: z.string().min(1, 'el usuario es obligatorio'),
    email: z.string().email('email inválido'),
    name: z.string().min(1, 'el nombre es obligatorio'),
    surname: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
    const navigate = useNavigate();
    const connected = useConnectionStatus();
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true);
        setServerError(null);

        try {
            await api.post(ENDPOINTS.USERS, {
                nickName: data.nickName,
                email: data.email,
                name: data.name,
                surname: data.surname || undefined,
            });

            toast.success(
                'Cuenta creada. Iniciá sesión con la contraseña: 123456'
            );
            navigate('/login', { replace: true });
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) {
                setServerError('el usuario o email ya existe');
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
                        crear cuenta
                    </span>
                </div>

                <div className="p-5">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-5"
                    >
                        <Input
                            label="usuario"
                            placeholder="elegí un usuario"
                            error={errors.nickName?.message}
                            {...register('nickName')}
                        />

                        <Input
                            label="email"
                            type="email"
                            placeholder="tu email"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label="nombre"
                            placeholder="tu nombre"
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <Input
                            label="apellido"
                            placeholder="tu apellido (opcional)"
                            error={errors.surname?.message}
                            {...register('surname')}
                        />

                        {serverError && (
                            <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                                {serverError}
                            </p>
                        )}

                        <Button type="submit" isLoading={isLoading}>
                            registrarse
                        </Button>
                    </form>

                    <div className="mt-6 border-t border-lime-400/15 pt-4 text-center text-xs text-lime-400/45">
                        {'>'} ¿ya tenés cuenta?{' '}
                        <Link
                            to="/login"
                            className="text-lime-400/70 underline underline-offset-4 hover:text-lime-300 transition-colors"
                        >
                            iniciá sesión
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
