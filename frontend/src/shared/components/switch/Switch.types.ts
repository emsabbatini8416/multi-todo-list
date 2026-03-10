import type { ButtonHTMLAttributes } from 'react'

export type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked: boolean
  label?: string
  onCheckedChange: (value: boolean) => void
}

