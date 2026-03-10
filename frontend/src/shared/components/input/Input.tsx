import { forwardRef } from 'react'
import { cn } from '../../lib/cn'
import type { InputProps } from './Input.types'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-base text-[var(--text-primary)] outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-300',
          className,
        )}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
