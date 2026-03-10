import type { CreateTodoItemPayload } from '../../types/todo.types'

export type TodoItemFormInitialValues = {
  description?: string
  name?: string
}

export type TodoItemFormProps = {
  idPrefix?: string
  initialValues?: TodoItemFormInitialValues
  isSubmitting?: boolean
  onCancel?: () => void
  onSubmit: (payload: CreateTodoItemPayload) => Promise<void> | void
  submitLabel: string
}
