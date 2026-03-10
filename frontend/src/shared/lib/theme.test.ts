import { applyThemeToDocument, getInitialTheme, persistTheme } from './theme'

describe('theme helpers', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('returns system theme when no stored theme exists', () => {
    const theme = getInitialTheme()
    expect(theme).toBe('dark')
  })

  it('reads persisted theme from localStorage', () => {
    window.localStorage.setItem('todo-app-theme', 'light')
    const theme = getInitialTheme()
    expect(theme).toBe('light')
  })

  it('applies theme to document and persists it', () => {
    applyThemeToDocument('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    persistTheme('light')
    expect(window.localStorage.getItem('todo-app-theme')).toBe('light')
  })
})

