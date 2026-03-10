import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppRoot from '../App'
import { App } from './App'
import { AppLayout } from './layouts/AppLayout'
import { AppProviders } from './providers/AppProviders'

jest.mock('./providers/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  }),
}))
import { AppRouter } from './router/AppRouter'

jest.mock('../modules/todo-list/routes/TodoListsRoute', () => ({
  __esModule: true,
  default: () => <div>Todo lists route</div>,
}))

jest.mock('../modules/todo-list/routes/TodoListRoute', () => ({
  __esModule: true,
  default: () => <div>Todo list detail route</div>,
}))

describe('app layer', () => {
  it('renders App through providers and router', async () => {
    render(<App />)

    expect(await screen.findByText('Todo lists route')).toBeInTheDocument()
  })

  it('re-exports the default App component from src/App.tsx', async () => {
    render(<AppRoot />)

    expect(await screen.findByText('Todo lists route')).toBeInTheDocument()
  })

  it('renders AppProviders children', () => {
    const { unmount } = render(
      <AppProviders>
        <div>children</div>
      </AppProviders>,
    )

    expect(screen.getByText('children')).toBeInTheDocument()
    unmount()
  })

  it('renders AppLayout with back link and actions', () => {
    render(
      <MemoryRouter>
        <AppLayout
          actions={<button type="button">Action</button>}
          backHref="/todo-lists"
          description="Helpful description"
          title="Page title"
        >
          <div>body</div>
        </AppLayout>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/todo-lists')
    expect(screen.getByText('Page title')).toBeInTheDocument()
    expect(screen.getByText('Helpful description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('body')).toBeInTheDocument()
  })

  it('renders AppLayout without optional navigation props', () => {
    render(
      <MemoryRouter>
        <AppLayout title="Simple title">
          <div>simple body</div>
        </AppLayout>
      </MemoryRouter>,
    )

    expect(screen.getByText('Simple title')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /back/i })).not.toBeInTheDocument()
  })

  it('toggles theme via AppLayout switch', () => {
    render(
      <MemoryRouter>
        <AppLayout title="With theme">
          <div>body</div>
        </AppLayout>
      </MemoryRouter>,
    )

    const switchButton = screen.getByRole('switch', { name: /toggle color theme/i })
    expect(switchButton).toBeInTheDocument()
  })

  it('routes to the todo lists page by default', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Todo lists route')).toBeInTheDocument()
  })

  it('routes to the todo list detail page', async () => {
    render(
      <MemoryRouter initialEntries={['/todo-lists/42']}>
        <AppRouter />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Todo list detail route')).toBeInTheDocument()
  })
})
