import React, { createContext, useEffect, useState, type PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../../shared/lib/queryClient'
import {
  applyThemeToDocument,
  getInitialTheme,
  persistTheme,
  type Theme,
} from '../../shared/lib/theme'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function AppProviders({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme())

  useEffect(() => {
    applyThemeToDocument(theme)
    persistTheme(theme)
  }, [theme])

  function setTheme(next: Theme) {
    setThemeState(next)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeContext.Provider>
    </QueryClientProvider>
  )
}
