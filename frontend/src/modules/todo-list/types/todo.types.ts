export type TodoItem = {
  id: number
  name: string
  description?: string
  done: boolean
}

export type TodoList = {
  id: number
  name: string
  todoItems: TodoItem[]
}

export type CreateTodoListPayload = {
  name: string
}

export type UpdateTodoListPayload = Partial<CreateTodoListPayload>

export type CreateTodoItemPayload = {
  name: string
  description?: string
}

export type UpdateTodoItemPayload = Partial<CreateTodoItemPayload> & {
  done?: boolean
}
