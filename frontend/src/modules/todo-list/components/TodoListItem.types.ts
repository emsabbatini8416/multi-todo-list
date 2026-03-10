import type { TodoItem } from '../types/todo.types'

export type TodoListItemProps = {
  isDeleting?: boolean
  isEditing?: boolean
  isToggling?: boolean
  item: TodoItem
  onDelete: (todoItemId: number) => void
  onEdit: (todoItemId: number) => void
  onToggle: (item: TodoItem) => void
}
