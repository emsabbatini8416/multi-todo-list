import { apiFetch } from '../../../shared/lib/api'
import type {
  CreateTodoItemPayload,
  CreateTodoListPayload,
  TodoItem,
  TodoList,
  UpdateTodoListPayload,
  UpdateTodoItemPayload,
} from '../types/todo.types'

async function getTodoLists() {
  return apiFetch<TodoList[]>('/todo-lists')
}

async function createTodoList(payload: CreateTodoListPayload) {
  return apiFetch<TodoList>('/todo-lists', {
    method: 'POST',
    body: payload,
  })
}

async function getTodoListById(todoListId: number) {
  return apiFetch<TodoList>(`/todo-lists/${todoListId}`)
}

async function updateTodoList(todoListId: number, payload: UpdateTodoListPayload) {
  return apiFetch<TodoList>(`/todo-lists/${todoListId}`, {
    method: 'PUT',
    body: payload,
  })
}

async function deleteTodoList(todoListId: number) {
  return apiFetch<void>(`/todo-lists/${todoListId}`, {
    method: 'DELETE',
  })
}

async function getTodoItems(todoListId: number) {
  return apiFetch<TodoItem[]>(`/todo-lists/${todoListId}/todo-items`)
}

async function createTodoItem(todoListId: number, payload: CreateTodoItemPayload) {
  return apiFetch<TodoItem>(`/todo-lists/${todoListId}/todo-items`, {
    method: 'POST',
    body: payload,
  })
}

async function getTodoItemById(todoListId: number, todoItemId: number) {
  return apiFetch<TodoItem>(`/todo-lists/${todoListId}/todo-items/${todoItemId}`)
}

async function updateTodoItem(
  todoListId: number,
  todoItemId: number,
  payload: UpdateTodoItemPayload,
) {
  return apiFetch<TodoItem>(`/todo-lists/${todoListId}/todo-items/${todoItemId}`, {
    method: 'PUT',
    body: payload,
  })
}

async function deleteTodoItem(todoListId: number, todoItemId: number) {
  return apiFetch<void>(`/todo-lists/${todoListId}/todo-items/${todoItemId}`, {
    method: 'DELETE',
  })
}

export const todoListService = {
  getTodoLists,
  createTodoList,
  getTodoListById,
  updateTodoList,
  deleteTodoList,
  getTodoItems,
  createTodoItem,
  getTodoItemById,
  updateTodoItem,
  deleteTodoItem,
}
