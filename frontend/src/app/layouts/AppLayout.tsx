import { faArrowLeft, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import type { PropsWithChildren, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../shared/lib/cn'
import { Icon } from '../../shared/components/icon/Icon'
import { PanelLayout } from '../../shared/components/layout/PanelLayout'
import { Switch } from '../../shared/components/switch/Switch'
import { useTheme } from '../providers/useTheme'

type AppLayoutProps = PropsWithChildren<{
  actions?: ReactNode
  backHref?: string
  backLabel?: string
  description?: string
  title: string
}>

export function AppLayout({
  actions,
  backHref,
  backLabel = 'Back',
  children,
  description,
  title,
}: AppLayoutProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <PanelLayout>
      <header className="mb-8 border-b border-[var(--card-border)] pb-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            {backHref ? (
              <Link
                className={cn(
                  'inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-black/5 hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-slate-400',
                )}
                to={backHref}
              >
                <span aria-hidden="true">
                  <Icon icon={faArrowLeft} />
                </span>
                {backLabel}
              </Link>
            ) : null}
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)] sm:text-base">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              aria-label="Toggle color theme"
              checked={theme === 'dark'}
              label={theme === 'dark' ? 'Dark' : 'Light'}
              onCheckedChange={toggleTheme}
            >
              {theme === 'dark' ? (
                <span aria-hidden="true" className="inline-flex items-center gap-1">
                  <Icon icon={faMoon} /> Dark
                </span>
              ) : (
                <span aria-hidden="true" className="inline-flex items-center gap-1">
                  <Icon icon={faSun} /> Light
                </span>
              )}
            </Switch>
            {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
          </div>
        </div>
      </header>
      {children}
    </PanelLayout>
  )
}
