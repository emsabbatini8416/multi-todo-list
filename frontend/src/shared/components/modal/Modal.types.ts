import type { PropsWithChildren, ReactNode } from 'react'

export type ModalProps = PropsWithChildren<{
  description?: string
  isOpen: boolean
  onClose: () => void
  title: string
  footer?: ReactNode
}>
