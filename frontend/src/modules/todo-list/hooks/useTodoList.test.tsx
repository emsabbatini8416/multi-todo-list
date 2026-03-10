import type { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import {
  useCreateTodoItem,
  useCreateTodoList,
  useDeleteTodoItem,
  useDeleteTodoList,
  useTodoItem,
  useTodoItems,
  useTodoList,
  useTodoLists,
  useToggleTodoItem,
  useUpdateTodoItem,
  useUpdateTodoList,
} from './useTodoList'
import { todoListService } from '../services/todoList.service'

jest.mock('../services/todoList.service', () => ({
  todoListService: {
    createTodoItem: jest.fn(),
    createTodoList: jest.fn(),
    deleteTodoItem: jest.fn(),
    deleteTodoList: jest.fn(),
    getTodoItemById: jest.fn(),
    getTodoItems: jest.fn(),
    getTodoListById: jest.fn(),
    getTodoLists: jest.fn(),
    updateTodoItem: jest.fn(),
    updateTodoList: jest.fn(),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  })

  function Wrapper({ children }: PropsWithChildren) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

  return { queryClient, Wrapper }
}

describe('useTodoList hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('loads todo lists and details queries', async () => {
    ;(todoListService.getTodoLists as jest.Mock).mockResolvedValue([{ id: 1, name: 'Work', todoItems: [] }])
    ;(todoListService.getTodoListById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Work',
      todoItems: [],
    })
    ;(todoListService.getTodoItems as jest.Mock).mockResolvedValue([
      { done: false, id: 1, name: 'Task' },
    ])
    ;(todoListService.getTodoItemById as jest.Mock).mockResolvedValue({
      done: false,
      id: 1,
      name: 'Task',
    })

    const { Wrapper } = createWrapper()

    const todoListsHook = renderHook(() => useTodoLists(), { wrapper: Wrapper })
    const todoListHook = renderHook(() => useTodoList(1), { wrapper: Wrapper })
    const todoItemsHook = renderHook(() => useTodoItems(1), { wrapper: Wrapper })
    const todoItemHook = renderHook(() => useTodoItem(1, 1), { wrapper: Wrapper })

    await waitFor(() => {
      expect(todoListsHook.result.current.data).toEqual([{ id: 1, name: 'Work', todoItems: [] }])
      expect(todoListHook.result.current.data?.name).toBe('Work')
      expect(todoItemsHook.result.current.data?.[0].name).toBe('Task')
      expect(todoItemHook.result.current.data?.id).toBe(1)
    })
  })

  it('does not fetch detail queries when ids are missing', async () => {
    const { Wrapper } = createWrapper()

    renderHook(() => useTodoList(undefined, false), { wrapper: Wrapper })
    renderHook(() => useTodoItems(undefined), { wrapper: Wrapper })
    renderHook(() => useTodoItem(undefined, undefined, false), { wrapper: Wrapper })

    await waitFor(() => {
      expect(todoListService.getTodoListById).not.toHaveBeenCalled()
      expect(todoListService.getTodoItems).not.toHaveBeenCalled()
      expect(todoListService.getTodoItemById).not.toHaveBeenCalled()
    })
  })

  it('creates, updates, and deletes todo lists while invalidating cache', async () => {
    const { queryClient, Wrapper } = createWrapper()
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries')

    ;(todoListService.createTodoList as jest.Mock).mockResolvedValue({})
    ;(todoListService.updateTodoList as jest.Mock).mockResolvedValue({})
    ;(todoListService.deleteTodoList as jest.Mock).mockResolvedValue(undefined)

    const createHook = renderHook(() => useCreateTodoList(), { wrapper: Wrapper })
    const updateHook = renderHook(() => useUpdateTodoList(4), { wrapper: Wrapper })
    const deleteHook = renderHook(() => useDeleteTodoList(), { wrapper: Wrapper })

    await createHook.result.current.mutateAsync({ name: 'New list' })
    await updateHook.result.current.mutateAsync({ name: 'Updated list' })
    await deleteHook.result.current.mutateAsync(4)

    expect(todoListService.createTodoList).toHaveBeenCalledWith({ name: 'New list' })
    expect(todoListService.updateTodoList).toHaveBeenCalledWith(4, { name: 'Updated list' })
    expect(todoListService.deleteTodoList).toHaveBeenCalledWith(4)
    expect(invalidateQueriesSpy).toHaveBeenCalled()
  })

  it('throws when trying to update a todo list without an id', async () => {
    const { Wrapper } = createWrapper()
    const updateHook = renderHook(() => useUpdateTodoList(undefined), { wrapper: Wrapper })

    await expect(updateHook.result.current.mutateAsync({ name: 'Nope' })).rejects.toThrow(
      'Todo list not available',
    )
  })

  it('creates, toggles, updates, and deletes todo items while invalidating cache', async () => {
    const { queryClient, Wrapper } = createWrapper()
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries')
    const removeQueriesSpy = jest.spyOn(queryClient, 'removeQueries')

    ;(todoListService.createTodoItem as jest.Mock).mockResolvedValue({})
    ;(todoListService.updateTodoItem as jest.Mock).mockResolvedValue({})
    ;(todoListService.deleteTodoItem as jest.Mock).mockResolvedValue(undefined)

    const createHook = renderHook(() => useCreateTodoItem(7), { wrapper: Wrapper })
    const toggleHook = renderHook(() => useToggleTodoItem(7), { wrapper: Wrapper })
    const updateHook = renderHook(() => useUpdateTodoItem(7, 2), { wrapper: Wrapper })
    const deleteHook = renderHook(() => useDeleteTodoItem(7), { wrapper: Wrapper })

    await createHook.result.current.mutateAsync({ name: 'Task', description: 'Desc' })
    await toggleHook.result.current.mutateAsync({
      description: 'Desc',
      done: false,
      id: 2,
      name: 'Task',
    })
    await updateHook.result.current.mutateAsync({ description: 'Edited', name: 'Task' })
    await deleteHook.result.current.mutateAsync(2)

    expect(todoListService.createTodoItem).toHaveBeenCalledWith(7, {
      description: 'Desc',
      name: 'Task',
    })
    expect(todoListService.updateTodoItem).toHaveBeenCalledWith(7, 2, {
      description: 'Desc',
      done: true,
      name: 'Task',
    })
    expect(todoListService.updateTodoItem).toHaveBeenCalledWith(7, 2, {
      description: 'Edited',
      name: 'Task',
    })
    expect(todoListService.deleteTodoItem).toHaveBeenCalledWith(7, 2)
    expect(invalidateQueriesSpy).toHaveBeenCalled()
    expect(removeQueriesSpy).toHaveBeenCalled()
  })

  it('throws when item ids are missing for item mutations', async () => {
    const { Wrapper } = createWrapper()
    const createHook = renderHook(() => useCreateTodoItem(undefined), { wrapper: Wrapper })
    const toggleHook = renderHook(() => useToggleTodoItem(undefined), { wrapper: Wrapper })
    const updateHook = renderHook(() => useUpdateTodoItem(undefined, undefined), {
      wrapper: Wrapper,
    })
    const deleteHook = renderHook(() => useDeleteTodoItem(undefined), { wrapper: Wrapper })

    await expect(createHook.result.current.mutateAsync({ name: 'Task' })).rejects.toThrow(
      'Todo list not available',
    )
    await expect(
      toggleHook.result.current.mutateAsync({ done: false, id: 1, name: 'Task' }),
    ).rejects.toThrow('Todo list not available')
    await expect(updateHook.result.current.mutateAsync({ name: 'Task' })).rejects.toThrow(
      'Todo item not available',
    )
    await expect(deleteHook.result.current.mutateAsync(1)).rejects.toThrow(
      'Todo list not available',
    )
  })
})
