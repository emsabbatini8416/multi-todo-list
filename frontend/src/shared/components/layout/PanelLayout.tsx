import { cn } from '../../lib/cn'
import type { PanelLayoutProps } from './Layout.types'

export function PanelLayout({ children, className }: PanelLayoutProps) {
  return (
    <main className="min-h-screen bg-[var(--page-bg-accent)] px-4 py-6 sm:px-6 sm:py-10">
      <section
        className={cn(
          'mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel-bg)] shadow-[var(--panel-shadow)] backdrop-blur sm:min-h-[42rem]',
          className,
        )}
      >
        <div className="flex-1 px-4 py-5 sm:px-8 sm:py-8">{children}</div>
      </section>
    </main>
  )
}
