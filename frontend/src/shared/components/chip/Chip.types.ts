import type { HTMLAttributes, ReactNode } from 'react'

export type ChipVariant = 'default' | 'outline'

export type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  label: ReactNode
  variant?: ChipVariant
}

