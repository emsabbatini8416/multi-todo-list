import type { PropsWithChildren, ReactNode } from 'react'

export type FormFieldProps = PropsWithChildren<{
  error?: string
  hint?: string
  htmlFor: string
  label: string
  labelAdornment?: ReactNode
}>
