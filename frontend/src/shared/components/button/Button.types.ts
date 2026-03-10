import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonShape = 'default' | 'circle'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: IconProp
  children?: ReactNode
  variant?: ButtonVariant
  shape?: ButtonShape
  size?: ButtonSize
}
