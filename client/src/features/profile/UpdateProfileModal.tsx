import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Modal } from '../../components/ui/Modal.tsx'
import { Input } from '../../components/ui/Input.tsx'
import { Button } from '../../components/ui/Button.tsx'
import { userService } from '../../lib/api/userService.ts'
import { useAuth } from '../../hooks/useAuth.ts'

export function UpdateProfileModal() {
    const { user, login } = useAuth()
    const navigate = useNavigate()
    const [name, setName] = useState(user?.name ?? '')
    const [surname, setSurname] = useState(user?.surname ?? '')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setIsLoading(true)
        setError(null)

        try {
            const nickName = user.nickName ?? user._id
            const updated = await userService.update(nickName, { name, surname })
            login(updated)
            toast.success('perfil actualizado')
            navigate('/profile', { replace: true })
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'error desconocido'
            setError(msg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal title="actualizar información">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="tu nombre"
                />

                <Input
                    label="apellido"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="tu apellido"
                />

                {error && (
                    <p className="border border-rose-400/15 bg-rose-400/[0.04] px-3 py-2 text-sm text-rose-400/80">
                        ! {error}
                    </p>
                )}

                <Button type="submit" isLoading={isLoading}>
                    guardar
                </Button>
            </form>
        </Modal>
    )
}
