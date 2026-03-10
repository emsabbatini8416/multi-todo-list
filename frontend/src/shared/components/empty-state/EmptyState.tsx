import type { EmptyStateProps } from './EmptyState.types'

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-12 text-center">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h2>
      {description ? (
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-secondary)] sm:text-base">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}
