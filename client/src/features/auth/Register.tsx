import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api, ApiError } from '../../lib/api/client.ts';
import { ENDPOINTS } from '../../lib/api/endpoints.ts';
import { useConnectionStatus } from '../../hooks/useConnectionStatus.ts';
import { BlockTrail } from '../../components/ui/BlockTrail.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';

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
        <div className="flex min-h-dvh items-center justify-center px-4">
            <div className="w-full max-w-sm border border-lime-400/10 bg-stone-950/90">
                <div className="flex items-center gap-1.5 border-b border-lime-400/10 px-3 py-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500/50" />
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-lime-500/50" />
                    <span className="ml-3 text-[10px] tracking-[0.2em] text-lime-400/30">
                        ANTI-SOCIAL v1.0 — register
                    </span>
                </div>

                <div className="p-6">
                    <div className="mb-7 flex items-center gap-2 text-sm text-lime-400/50">
                        <span className="text-lime-400/70">{'>'}</span>
                        <span>creá tu cuenta</span>
                    </div>

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
                            <p className="border border-rose-400/15 bg-rose-400/[0.04] px-3 py-2.5 text-sm text-rose-400/80">
                                ! {serverError}
                            </p>
                        )}

                        <Button type="submit" isLoading={isLoading}>
                            registrarse
                        </Button>
                    </form>

                    <div className="mt-6 border-t border-lime-400/10 pt-4 text-center text-xs text-lime-400/25">
                        {'>'} ¿ya tenés cuenta?{' '}
                        <Link
                            to="/login"
                            className="text-lime-400/50 underline underline-offset-4 hover:text-lime-400 transition-colors"
                        >
                            iniciá sesión
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3 border-t border-lime-400/10 bg-lime-400/[0.01] px-3 py-2">
                    <BlockTrail connected={connected} />
                    <span
                        className={`text-[10px] uppercase tracking-wider ${connected ? 'text-lime-400/30' : 'text-rose-400/40'}`}
                    >
                        [{connected ? 'conectado' : 'desconectado'}]
                    </span>
                </div>
            </div>
        </div>
    );
}
