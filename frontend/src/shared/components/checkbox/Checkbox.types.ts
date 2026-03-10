import type { ButtonHTMLAttributes } from 'react'

export type CheckboxProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  checked: boolean
}
