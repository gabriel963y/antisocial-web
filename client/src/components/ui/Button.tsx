import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    isLoading?: boolean
}

const variantStyles: Record<Variant, string> = {
    primary:
        'rounded-xl bg-lime-400 px-4 py-3 text-sm font-semibold text-black hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-50',
    secondary:
        'rounded-xl border border-lime-400/30 px-4 py-3 text-sm font-semibold text-lime-400/70 hover:bg-lime-400/10',
    danger:
        'rounded-xl border border-red-400/40 bg-red-400/[0.12] px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-400 hover:text-black',
}

export function Button({
    variant = 'primary',
    isLoading = false,
    disabled,
    className = '',
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || isLoading}
            className={`transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {isLoading ? 'cargando...' : children}
        </button>
    )
}
