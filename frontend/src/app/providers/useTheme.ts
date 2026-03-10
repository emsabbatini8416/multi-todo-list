import { useContext } from 'react'
import { ThemeContext } from './AppProviders'
import type { Theme } from '../../shared/lib/theme'

export function useTheme() {
  const value = useContext(ThemeContext)

  if (!value) {
    throw new Error('useTheme must be used within AppProviders')
  }

  function toggleTheme() {
    const next: Theme = value.theme === 'light' ? 'dark' : 'light'
    value.setTheme(next)
  }

  return {
    theme: value.theme,
    setTheme: value.setTheme,
    toggleTheme,
  }
}

