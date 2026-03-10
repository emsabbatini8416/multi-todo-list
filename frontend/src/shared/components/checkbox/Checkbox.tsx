import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { Icon } from '../icon/Icon'
import { cn } from '../../lib/cn'
import type { CheckboxProps } from './Checkbox.types'

export function Checkbox({
  checked,
  className,
  disabled,
  type = 'button',
  ...props
}: CheckboxProps) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-400 bg-[var(--card-bg)] text-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-400/40 disabled:cursor-not-allowed disabled:opacity-60',
        checked && 'border-emerald-400 bg-emerald-400',
        className,
      )}
      disabled={disabled}
      type={type}
      {...props}
    >
      {checked ? <Icon icon={faCheck} className="text-slate-950" /> : null}
    </button>
  )
}
