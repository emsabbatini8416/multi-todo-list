import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Button } from '../button/Button'
import type { ModalProps } from './Modal.types'

export function Modal({
  children,
  description,
  footer,
  isOpen,
  onClose,
  title,
}: ModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-[28px] bg-[var(--card-bg)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h2>
            {description ? (
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>
            ) : null}
          </div>
          <Button
            aria-label="Close dialog"
            className="h-10 w-10"
            icon={faXmark}
            onClick={onClose}
            shape="circle"
            variant="ghost"
          />
        </div>
        <div>{children}</div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  )
}
