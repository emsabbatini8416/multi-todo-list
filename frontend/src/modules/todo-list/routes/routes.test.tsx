import { render, screen } from '@testing-library/react'
import TodoListRoute from './TodoListRoute'
import TodoListsRoute from './TodoListsRoute'

jest.mock('../pages/TodoListPage', () => ({
  TodoListPage: () => <div>Todo list page</div>,
}))

jest.mock('../pages/TodoListsPage', () => ({
  TodoListsPage: () => <div>Todo lists page</div>,
}))

describe('todo-list routes', () => {
  it('renders the todo list detail route wrapper', () => {
    render(<TodoListRoute />)

    expect(screen.getByText('Todo list page')).toBeInTheDocument()
  })

  it('renders the todo lists route wrapper', () => {
    render(<TodoListsRoute />)

    expect(screen.getByText('Todo lists page')).toBeInTheDocument()
  })
})
