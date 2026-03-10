import type { FormFieldProps } from './FormField.types'

export function FormField({
  children,
  error,
  hint,
  htmlFor,
  label,
  labelAdornment,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-[var(--text-primary)]" htmlFor={htmlFor}>
          {label}
        </label>
        {labelAdornment}
      </div>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!error && hint ? <p className="text-sm text-[var(--text-muted)]">{hint}</p> : null}
    </div>
  )
}
