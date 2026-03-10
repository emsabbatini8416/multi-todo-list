import type { SpinnerProps } from './Spinner.types'

export function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <div
      aria-label={label}
      className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
      role="status"
    />
  )
}
