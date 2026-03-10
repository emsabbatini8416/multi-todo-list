import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TodoListPage } from './TodoListPage'
import { TodoListsPage } from './TodoListsPage'
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
} from '../hooks/useTodoList'

jest.mock('../../../app/providers/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    toggleTheme: jest.fn(),
  }),
}))

jest.mock('../hooks/useTodoList', () => ({
  useCreateTodoItem: jest.fn(),
  useCreateTodoList: jest.fn(),
  useDeleteTodoItem: jest.fn(),
  useDeleteTodoList: jest.fn(),
  useTodoItem: jest.fn(),
  useTodoItems: jest.fn(),
  useTodoList: jest.fn(),
  useTodoLists: jest.fn(),
  useToggleTodoItem: jest.fn(),
  useUpdateTodoItem: jest.fn(),
  useUpdateTodoList: jest.fn(),
}))

function makeMutation(overrides: Partial<{ isPending: boolean; mutate: jest.Mock; mutateAsync: jest.Mock }> = {}) {
  return {
    isPending: false,
    mutate: jest.fn(),
    mutateAsync: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

describe('todo-list pages', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useCreateTodoItem as jest.Mock).mockReturnValue(makeMutation())
    ;(useCreateTodoList as jest.Mock).mockReturnValue(makeMutation())
    ;(useDeleteTodoItem as jest.Mock).mockReturnValue(makeMutation())
    ;(useDeleteTodoList as jest.Mock).mockReturnValue(makeMutation())
    ;(useTodoItem as jest.Mock).mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: false,
    })
    ;(useTodoItems as jest.Mock).mockReturnValue({
      data: [],
      isError: false,
      isLoading: false,
    })
    ;(useTodoList as jest.Mock).mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: false,
    })
    ;(useToggleTodoItem as jest.Mock).mockReturnValue(makeMutation())
    ;(useUpdateTodoItem as jest.Mock).mockReturnValue(makeMutation())
    ;(useUpdateTodoList as jest.Mock).mockReturnValue(makeMutation())
  })

  it('renders TodoListsPage with create, edit, and delete flows', async () => {
    const createTodoListMutation = makeMutation()
    const updateTodoListMutation = makeMutation()
    const deleteTodoListMutation = makeMutation()

    ;(useTodoLists as jest.Mock).mockReturnValue({
      data: [{ id: 1, name: 'Work', todoItems: [{ done: false, id: 1, name: 'Task' }] }],
      isError: false,
      isLoading: false,
    })
    ;(useCreateTodoList as jest.Mock).mockReturnValue(createTodoListMutation)
    ;(useDeleteTodoList as jest.Mock).mockReturnValue(deleteTodoListMutation)
    ;(useTodoList as jest.Mock).mockImplementation((id?: number) => ({
      data: id ? { id, name: 'Work', todoItems: [] } : undefined,
      isError: false,
      isLoading: false,
    }))
    ;(useUpdateTodoList as jest.Mock).mockReturnValue(updateTodoListMutation)

    render(
      <MemoryRouter>
        <TodoListsPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/list name/i), { target: { value: 'Inbox' } })
    fireEvent.click(screen.getByRole('button', { name: /create list/i }))

    expect(createTodoListMutation.mutateAsync).toHaveBeenCalledWith({ name: 'Inbox' })

    fireEvent.click(screen.getByRole('button', { name: /edit work/i }))
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    expect(updateTodoListMutation.mutateAsync).toHaveBeenCalledWith({ name: 'Work' })

    fireEvent.click(screen.getByRole('button', { name: /edit work/i }))
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /delete work/i }))
    expect(deleteTodoListMutation.mutateAsync).toHaveBeenCalledWith(1)
  })

  it('renders TodoListsPage loading, error, and empty states', () => {
    ;(useTodoLists as jest.Mock).mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
    })

    const { rerender } = render(
      <MemoryRouter>
        <TodoListsPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('status', { name: /loading todo lists/i })).toBeInTheDocument()

    ;(useTodoLists as jest.Mock).mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
    })

    rerender(
      <MemoryRouter>
        <TodoListsPage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/could not load your lists/i)).toBeInTheDocument()

    ;(useTodoLists as jest.Mock).mockReturnValue({
      data: [],
      isError: false,
      isLoading: false,
    })

    rerender(
      <MemoryRouter>
        <TodoListsPage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/no lists yet/i)).toBeInTheDocument()
  })

  it('renders TodoListsPage modal loading state and allows closing the modal', () => {
    ;(useTodoLists as jest.Mock).mockReturnValue({
      data: [{ id: 1, name: 'Work', todoItems: [] }],
      isError: false,
      isLoading: false,
    })
    ;(useTodoList as jest.Mock).mockImplementation((id?: number) => ({
      data: undefined,
      isError: false,
      isLoading: Boolean(id),
    }))

    render(
      <MemoryRouter>
        <TodoListsPage />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: /edit work/i }))
    expect(screen.getByRole('status', { name: /loading selected list/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /close dialog/i }))
    expect(screen.queryByRole('status', { name: /loading selected list/i })).not.toBeInTheDocument()
  })

  it('renders TodoListPage invalid id state', () => {
    render(
      <MemoryRouter initialEntries={['/todo-lists/not-valid']}>
        <Routes>
          <Route path="/todo-lists/:todoListId" element={<TodoListPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText(/invalid list id/i)).toBeInTheDocument()
  })

  it('renders TodoListPage with create, toggle, edit, and delete flows', async () => {
    const createTodoItemMutation = makeMutation()
    const toggleTodoItemMutation = makeMutation()
    const updateTodoItemMutation = makeMutation()
    const deleteTodoItemMutation = makeMutation()

    ;(useTodoList as jest.Mock).mockReturnValue({
      data: { id: 1, name: 'Work', todoItems: [] },
      isError: false,
      isLoading: false,
    })
    ;(useTodoItems as jest.Mock).mockReturnValue({
      data: [{ description: 'Details', done: false, id: 2, name: 'Task' }],
      isError: false,
      isLoading: false,
    })
    ;(useTodoItem as jest.Mock).mockReturnValue({
      data: { description: 'Details', done: false, id: 2, name: 'Task' },
      isError: false,
      isLoading: false,
    })
    ;(useCreateTodoItem as jest.Mock).mockReturnValue(createTodoItemMutation)
    ;(useToggleTodoItem as jest.Mock).mockReturnValue(toggleTodoItemMutation)
    ;(useUpdateTodoItem as jest.Mock).mockReturnValue(updateTodoItemMutation)
    ;(useDeleteTodoItem as jest.Mock).mockReturnValue(deleteTodoItemMutation)

    render(
      <MemoryRouter initialEntries={['/todo-lists/1']}>
        <Routes>
          <Route path="/todo-lists/:todoListId" element={<TodoListPage />} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/task name/i), { target: { value: 'New task' } })
    fireEvent.click(screen.getByRole('button', { name: /add task/i }))
    expect(createTodoItemMutation.mutateAsync).toHaveBeenCalledWith({
      description: undefined,
      name: 'New task',
    })

    fireEvent.click(screen.getByRole('checkbox', { name: /mark task as completed/i }))
    expect(toggleTodoItemMutation.mutate).toHaveBeenCalledWith({
      description: 'Details',
      done: false,
      id: 2,
      name: 'Task',
    })

    fireEvent.click(screen.getByRole('button', { name: /edit task/i }))
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    expect(updateTodoItemMutation.mutateAsync).toHaveBeenCalledWith({
      description: 'Details',
      name: 'Task',
    })

    fireEvent.click(screen.getByRole('button', { name: /edit task/i }))
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /edit task/i }))
    fireEvent.click(screen.getByRole('button', { name: /close dialog/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /delete task/i }))
    expect(deleteTodoItemMutation.mutate).toHaveBeenCalledWith(2)
  })

  it('renders TodoListPage loading, error, empty, and modal loading states', () => {
    ;(useTodoList as jest.Mock).mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
    })
    ;(useTodoItems as jest.Mock).mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
    })
    ;(useTodoItem as jest.Mock).mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
    })

    const { rerender } = render(
      <MemoryRouter initialEntries={['/todo-lists/1']}>
        <Routes>
          <Route path="/todo-lists/:todoListId" element={<TodoListPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('status', { name: /loading todo list detail/i })).toBeInTheDocument()

    ;(useTodoList as jest.Mock).mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
    })
    ;(useTodoItems as jest.Mock).mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
    })

    rerender(
      <MemoryRouter initialEntries={['/todo-lists/1']}>
        <Routes>
          <Route path="/todo-lists/:todoListId" element={<TodoListPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText(/could not load this list/i)).toBeInTheDocument()

    ;(useTodoList as jest.Mock).mockReturnValue({
      data: { id: 1, name: 'Work', todoItems: [] },
      isError: false,
      isLoading: false,
    })
    ;(useTodoItems as jest.Mock).mockReturnValue({
      data: [],
      isError: false,
      isLoading: false,
    })

    rerender(
      <MemoryRouter initialEntries={['/todo-lists/1']}>
        <Routes>
          <Route path="/todo-lists/:todoListId" element={<TodoListPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText(/no tasks in this list/i)).toBeInTheDocument()

    ;(useTodoItems as jest.Mock).mockReturnValue({
      data: [{ done: false, id: 1, name: 'Task' }],
      isError: false,
      isLoading: false,
    })
    ;(useTodoItem as jest.Mock).mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
    })

    rerender(
      <MemoryRouter initialEntries={['/todo-lists/1']}>
        <Routes>
          <Route path="/todo-lists/:todoListId" element={<TodoListPage />} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: /edit task/i }))
    expect(screen.getByRole('status', { name: /loading selected todo item/i })).toBeInTheDocument()
  })
})
