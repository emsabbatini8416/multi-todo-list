import { cn } from '../../lib/cn'
import type { SwitchProps } from './Switch.types'

export function Switch({
  checked,
  className,
  disabled,
  label,
  onCheckedChange,
  type = 'button',
  ...props
}: SwitchProps) {
  function handleClick() {
    if (disabled) {
      return
    }

    onCheckedChange(!checked)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      aria-checked={checked}
      className={cn(
        'inline-flex items-center gap-3 rounded-full px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="switch"
      type={type}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
            'relative inline-flex h-5 w-9 items-center rounded-full border border-slate-400 bg-slate-200 transition-colors',
            checked && 'border-slate-900 bg-slate-900',
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-[1.1rem]',
          )}
        />
      </span>
      {label ? <span>{label}</span> : null}
    </button>
  )
}

