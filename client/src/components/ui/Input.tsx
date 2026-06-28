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
                    className="text-xs uppercase tracking-[0.15em] text-lime-400/40"
                >
                    {label}
                </label>
                <div className="flex items-center border border-lime-400/15 bg-lime-400/[0.02] focus-within:border-lime-400/40">
                    <span className="flex select-none items-center self-stretch border-r border-lime-400/10 px-3 text-xs text-lime-400/30">
                        $
                    </span>
                    <input
                        ref={ref}
                        id={inputId}
                        className={`flex-1 bg-transparent px-3 py-2 text-sm text-lime-300 outline-none placeholder:text-lime-400/15 ${
                            error ? 'text-rose-400' : ''
                        } ${className}`}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-400/80">
                        <span className="inline-block h-3 w-[1px] bg-rose-400/40" />
                        {error}
                    </p>
                )}
            </div>
        )
    },
)

Input.displayName = 'Input'
