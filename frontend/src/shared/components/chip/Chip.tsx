import { cn } from '../../lib/cn'
import type { ChipProps } from './Chip.types'

export function Chip({ className, label, variant = 'default', ...rest }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-[var(--text-secondary)]',
        variant === 'outline' && 'bg-transparent border border-[var(--card-border)]',
        className,
      )}
      {...rest}
    >
      {label}
    </span>
  )
}

