import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'vantage-theme'

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'system'
    return window.localStorage.getItem(STORAGE_KEY) || 'system'
  })
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)
  const firstPaintRef = useRef(true)
  const transitionTimerRef = useRef(null)

  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (event) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = resolvedTheme
    root.style.colorScheme = resolvedTheme

    if (firstPaintRef.current) {
      firstPaintRef.current = false
      return undefined
    }

    root.dataset.themeTransitioning = 'true'
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current)
    }
    transitionTimerRef.current = window.setTimeout(() => {
      delete root.dataset.themeTransitioning
    }, 260)

    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current)
      }
    }
  }, [resolvedTheme, theme])

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current)
      }
    }
  }, [])

  const value = useMemo(() => ({
    theme,
    setTheme,
  }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
