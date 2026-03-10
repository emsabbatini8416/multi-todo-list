import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TodoItemForm } from './forms/TodoItemForm'
import { TodoListForm } from './forms/TodoListForm'
import { TodoListCard } from './lists/TodoListCard'
import { TodoListItem } from './TodoListItem'

describe('todo-list components', () => {
  it('submits and resets TodoListForm for create flows', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)

    render(
      <TodoListForm idPrefix="create" onSubmit={onSubmit} submitLabel="Create list" />,
    )

    fireEvent.change(screen.getByLabelText(/list name/i), {
      target: { value: 'New list' },
    })
    fireEvent.click(screen.getByRole('button', { name: /create list/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: 'New list' })
      expect(screen.getByLabelText(/list name/i)).toHaveValue('')
    })
  })

  it('renders TodoListForm cancel action for edit flows', () => {
    const onCancel = jest.fn()

    render(
      <TodoListForm
        idPrefix="edit"
        initialValue="Existing list"
        onCancel={onCancel}
        onSubmit={() => undefined}
        submitLabel="Save"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('does not submit TodoListForm when the name is blank', async () => {
    const onSubmit = jest.fn()

    const { container } = render(
      <TodoListForm idPrefix="blank-list" onSubmit={onSubmit} submitLabel="Create list" />,
    )

    fireEvent.change(screen.getByLabelText(/list name/i), {
      target: { value: '   ' },
    })
    fireEvent.submit(container.querySelector('form') as HTMLFormElement)

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  it('submits and resets TodoItemForm for create flows', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)

    render(<TodoItemForm idPrefix="create-item" onSubmit={onSubmit} submitLabel="Add task" />)

    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: 'Task title' },
    })
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Some details' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add task/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        description: 'Some details',
        name: 'Task title',
      })
      expect(screen.getByLabelText(/task name/i)).toHaveValue('')
      expect(screen.getByLabelText(/description/i)).toHaveValue('')
    })
  })

  it('renders TodoListCard actions and navigation', () => {
    const onDelete = jest.fn()
    const onEdit = jest.fn()

    render(
      <MemoryRouter>
        <TodoListCard
          onDelete={onDelete}
          onEdit={onEdit}
          todoList={{
            id: 2,
            name: 'Work',
            todoItems: [
              { done: false, id: 1, name: 'Task 1' },
              { done: true, id: 2, name: 'Task 2' },
            ],
          }}
        />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: /edit work/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete work/i }))

    expect(onEdit).toHaveBeenCalledWith(2)
    expect(onDelete).toHaveBeenCalledWith(2)
    expect(screen.getByRole('link', { name: /open work/i })).toHaveAttribute(
      'href',
      '/todo-lists/2',
    )
  })

  it('preserves TodoItemForm values during edit flows', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)

    render(
      <TodoItemForm
        idPrefix="edit-item"
        initialValues={{ description: 'Keep me', name: 'Existing task' }}
        onSubmit={onSubmit}
        submitLabel="Save changes"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        description: 'Keep me',
        name: 'Existing task',
      })
      expect(screen.getByLabelText(/task name/i)).toHaveValue('Existing task')
    })
  })

  it('does not submit TodoItemForm when the task name is blank', async () => {
    const onSubmit = jest.fn()

    const { container } = render(
      <TodoItemForm idPrefix="blank-item" onSubmit={onSubmit} submitLabel="Add task" />,
    )

    fireEvent.change(screen.getByLabelText(/task name/i), {
      target: { value: '   ' },
    })
    fireEvent.submit(container.querySelector('form') as HTMLFormElement)

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  it('renders TodoListItem actions and completion styles', () => {
    const onDelete = jest.fn()
    const onEdit = jest.fn()
    const onToggle = jest.fn()

    render(
      <TodoListItem
        item={{
          description: 'Optional details',
          done: true,
          id: 1,
          name: 'Completed task',
        }}
        onDelete={onDelete}
        onEdit={onEdit}
        onToggle={onToggle}
      />,
    )

    fireEvent.click(screen.getByRole('checkbox', { name: /mark completed task as pending/i }))
    fireEvent.click(screen.getByRole('button', { name: /edit completed task/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete completed task/i }))

    expect(onToggle).toHaveBeenCalledWith({
      description: 'Optional details',
      done: true,
      id: 1,
      name: 'Completed task',
    })
    expect(onEdit).toHaveBeenCalledWith(1)
    expect(onDelete).toHaveBeenCalledWith(1)
    expect(screen.getByText('Completed task')).toHaveClass('line-through')
    expect(
      screen.getByRole('checkbox', { name: /mark completed task as pending/i }),
    ).toHaveAttribute('aria-checked', 'true')
  })
})
