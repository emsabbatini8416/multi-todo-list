import type { TodoList } from '../../types/todo.types'

export type TodoListCardProps = {
  isDeleting?: boolean
  onDelete: (todoListId: number) => void
  onEdit: (todoListId: number) => void
  todoList: TodoList
}
