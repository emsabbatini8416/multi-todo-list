import { Icon } from '../icon/Icon'
import { cn } from '../../lib/cn'
import type { ButtonProps } from './Button.types'

export function Button({
  children,
  className,
  disabled,
  icon,
  shape = 'default',
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 border font-semibold transition focus:outline-none focus:ring-2 focus:ring-slate-500/30 disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' &&
          'border-black bg-black text-white hover:bg-slate-800',
        variant === 'secondary' &&
          'border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-black/5',
        variant === 'ghost' &&
          'border-transparent bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
        variant === 'danger' &&
          'border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-sm',
        size === 'lg' && 'text-base',
        shape === 'default' && 'rounded-full px-4 py-2',
        shape === 'circle' && 'h-12 w-12 rounded-full p-0',
        className,
      )}
      disabled={disabled}
      type={type}
      {...props}
    >
      {icon ? <Icon icon={icon} /> : null}
      {children}
    </button>
  )
}
