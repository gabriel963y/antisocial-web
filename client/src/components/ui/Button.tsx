import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    isLoading?: boolean
}

const variantStyles: Record<Variant, string> = {
    primary:
        'border border-lime-400/50 bg-lime-400/[0.06] text-lime-400 hover:bg-lime-400 hover:text-stone-950 active:scale-[0.98]',
    secondary:
        'border border-lime-400/10 text-lime-400/30 hover:border-lime-400/30 hover:text-lime-400/60',
    danger:
        'border border-rose-400/50 bg-rose-400/[0.06] text-rose-400 hover:bg-rose-400 hover:text-stone-950 active:scale-[0.98]',
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
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium tracking-[0.15em] uppercase transition-all focus:outline-none focus:ring-1 focus:ring-lime-400/50 disabled:cursor-not-allowed disabled:opacity-25 ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {isLoading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border border-current border-t-transparent" />
            )}
            {children}
        </button>
    )
}
