import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, id, className = '', ...props }, ref) => {
        const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor={inputId}
                    className="text-xs text-lime-400/70"
                >
                    {label}
                </label>
                <input
                    ref={ref}
                    id={inputId}
                    className={`w-full rounded-xl border border-lime-400/30 bg-black/40 px-4 py-3 text-sm text-lime-100 outline-none placeholder:text-lime-400/50 focus:border-lime-400/60 ${
                        error ? 'border-red-400/50' : ''
                    } ${className}`}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-rose-400/80">
                        {error}
                    </p>
                )}
            </div>
        )
    },
)

Input.displayName = 'Input'
