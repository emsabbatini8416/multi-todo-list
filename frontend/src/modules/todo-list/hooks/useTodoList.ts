import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { todoListService } from '../services/todoList.service'
import type {
  CreateTodoItemPayload,
  CreateTodoListPayload,
  TodoItem,
  UpdateTodoListPayload,
  UpdateTodoItemPayload,
} from '../types/todo.types'

export const todoListQueryKeys = {
  all: ['todo-lists'] as const,
  detail: (todoListId: number) => ['todo-lists', todoListId] as const,
  items: (todoListId: number) => ['todo-lists', todoListId, 'items'] as const,
  item: (todoListId: number, todoItemId: number) =>
    ['todo-lists', todoListId, 'items', todoItemId] as const,
}

export function useTodoLists() {
  return useQuery({
    queryKey: todoListQueryKeys.all,
    queryFn: todoListService.getTodoLists,
  })
}

export function useTodoList(todoListId?: number, enabled = true) {
  return useQuery({
    enabled: enabled && Boolean(todoListId),
    queryKey: todoListId ? todoListQueryKeys.detail(todoListId) : ['todo-lists', 'unknown'],
    queryFn: () => todoListService.getTodoListById(todoListId as number),
  })
}

export function useTodoItems(todoListId?: number) {
  return useQuery({
    enabled: Boolean(todoListId),
    queryKey: todoListId ? todoListQueryKeys.items(todoListId) : ['todo-lists', 'items'],
    queryFn: () => todoListService.getTodoItems(todoListId as number),
  })
}

export function useTodoItem(
  todoListId?: number,
  todoItemId?: number,
  enabled = true,
) {
  return useQuery({
    enabled: enabled && Boolean(todoListId) && Boolean(todoItemId),
    queryKey:
      todoListId && todoItemId
        ? todoListQueryKeys.item(todoListId, todoItemId)
        : ['todo-lists', 'item'],
    queryFn: () => todoListService.getTodoItemById(todoListId as number, todoItemId as number),
  })
}

export function useCreateTodoList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTodoListPayload) => todoListService.createTodoList(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todoListQueryKeys.all })
    },
  })
}

export function useUpdateTodoList(todoListId?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateTodoListPayload) => {
      if (!todoListId) {
        throw new Error('Todo list not available')
      }

      return todoListService.updateTodoList(todoListId, payload)
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: todoListQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: todoListQueryKeys.detail(todoListId as number) }),
      ])
    },
  })
}

export function useDeleteTodoList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (todoListId: number) => todoListService.deleteTodoList(todoListId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todoListQueryKeys.all })
    },
  })
}

export function useCreateTodoItem(todoListId?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateTodoItemPayload) => {
      if (!todoListId) {
        throw new Error('Todo list not available')
      }

      return todoListService.createTodoItem(todoListId, payload)
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: todoListQueryKeys.detail(todoListId as number) }),
        queryClient.invalidateQueries({ queryKey: todoListQueryKeys.items(todoListId as number) }),
      ])
    },
  })
}

export function useToggleTodoItem(todoListId?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (todoItem: TodoItem) => {
      if (!todoListId) {
        throw new Error('Todo list not available')
      }

      const payload: UpdateTodoItemPayload = {
        done: !todoItem.done,
        name: todoItem.name,
        description: todoItem.description,
      }

      return todoListService.updateTodoItem(todoListId, todoItem.id, payload)
    },
    async onMutate(todoItem) {
      if (!todoListId) {
        return {}
      }

      await Promise.all([
        queryClient.cancelQueries({ queryKey: todoListQueryKeys.items(todoListId) }),
        queryClient.cancelQueries({ queryKey: todoListQueryKeys.detail(todoListId) }),
        queryClient.cancelQueries({ queryKey: todoListQueryKeys.item(todoListId, todoItem.id) }),
      ])

      const previousItems = queryClient.getQueryData<TodoItem[]>(
        todoListQueryKeys.items(todoListId),
      )
      const previousList = queryClient.getQueryData<{
        id: number
        name: string
        todoItems: TodoItem[]
      }>(todoListQueryKeys.detail(todoListId))
      const previousItem = queryClient.getQueryData<TodoItem>(
        todoListQueryKeys.item(todoListId, todoItem.id),
      )

      const toggle = (item: TodoItem) => ({
        ...item,
        done: !item.done,
      })

      if (previousItems) {
        queryClient.setQueryData<TodoItem[]>(todoListQueryKeys.items(todoListId), (items) =>
          (items ?? []).map((item) => (item.id === todoItem.id ? toggle(item) : item)),
        )
      }

      if (previousList) {
        queryClient.setQueryData<typeof previousList>(todoListQueryKeys.detail(todoListId), {
          ...previousList,
          todoItems: previousList.todoItems.map((item) =>
            item.id === todoItem.id ? toggle(item) : item,
          ),
        })
      }

      if (previousItem) {
        queryClient.setQueryData<TodoItem>(
          todoListQueryKeys.item(todoListId, todoItem.id),
          toggle(previousItem),
        )
      }

      return { previousItems, previousList, previousItem }
    },
    onError: (error, todoItem, context) => {
      if (!todoListId || !context) {
        return
      }

      const { previousItems, previousList, previousItem } = context as {
        previousItems?: TodoItem[]
        previousList?: { id: number; name: string; todoItems: TodoItem[] }
        previousItem?: TodoItem
      }

      if (previousItems) {
        queryClient.setQueryData<TodoItem[]>(todoListQueryKeys.items(todoListId), previousItems)
      }

      if (previousList) {
        queryClient.setQueryData(todoListQueryKeys.detail(todoListId), previousList)
      }

      if (previousItem) {
        queryClient.setQueryData(
          todoListQueryKeys.item(todoListId, todoItem.id),
          previousItem,
        )
      }
    },
    onSettled: async (_, __, todoItem) => {
      if (!todoListId || !todoItem) {
        return
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: todoListQueryKeys.detail(todoListId) }),
        queryClient.invalidateQueries({ queryKey: todoListQueryKeys.items(todoListId) }),
        queryClient.invalidateQueries({
          queryKey: todoListQueryKeys.item(todoListId, todoItem.id),
        }),
      ])
    },
  })
}

export function useUpdateTodoItem(todoListId?: number, todoItemId?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateTodoItemPayload) => {
      if (!todoListId || !todoItemId) {
        throw new Error('Todo item not available')
      }

      return todoListService.updateTodoItem(todoListId, todoItemId, payload)
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: todoListQueryKeys.detail(todoListId as number) }),
        queryClient.invalidateQueries({ queryKey: todoListQueryKeys.items(todoListId as number) }),
        queryClient.invalidateQueries({
          queryKey: todoListQueryKeys.item(todoListId as number, todoItemId as number),
        }),
      ])
    },
  })
}

export function useDeleteTodoItem(todoListId?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (todoItemId: number) => {
      if (!todoListId) {
        throw new Error('Todo list not available')
      }

      return todoListService.deleteTodoItem(todoListId, todoItemId)
    },
    onSuccess: async (_, todoItemId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: todoListQueryKeys.detail(todoListId as number) }),
        queryClient.invalidateQueries({ queryKey: todoListQueryKeys.items(todoListId as number) }),
        queryClient.removeQueries({
          queryKey: todoListQueryKeys.item(todoListId as number, todoItemId),
        }),
      ])
    },
  })
}
