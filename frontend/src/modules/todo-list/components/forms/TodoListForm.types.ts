import type { CreateTodoListPayload } from '../../types/todo.types'

export type TodoListFormProps = {
  idPrefix?: string
  initialValue?: string
  isSubmitting?: boolean
  onCancel?: () => void
  onSubmit: (payload: CreateTodoListPayload) => Promise<void> | void
  submitLabel: string
}
