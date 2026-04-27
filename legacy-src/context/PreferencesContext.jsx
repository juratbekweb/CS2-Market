import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const PreferencesContext = createContext(null)

const STORAGE_KEY = 'cs2-marketplace-preferences'

export const themeOptions = [
  { id: 'dark', label: 'Dark', swatch: 'linear-gradient(135deg, #10182c, #1b2342)' },
  { id: 'light', label: 'Light', swatch: 'linear-gradient(135deg, #eff4ff, #dce7ff)' },
  { id: 'green', label: 'Green', swatch: 'linear-gradient(135deg, #0b4f55, #0fa39d)' },
  { id: 'neon', label: 'Neon', swatch: 'linear-gradient(135deg, #8700ff, #ff00c8)' },
  { id: 'legacy', label: 'Legacy', swatch: 'linear-gradient(135deg, #4b524f, #7f8581)' },
  { id: 'dynamic', label: 'Dynamic', swatch: 'linear-gradient(135deg, #8fa8b8, #e7ecef)' },
]

export const currencyOptions = [
  { id: 'USD', label: 'USD', locale: 'en-US', symbol: '$', rate: 1 },
  { id: 'RUB', label: 'RUB', locale: 'ru-RU', symbol: '₽', rate: 92 },
  { id: 'UZS', label: 'UZS', locale: 'uz-UZ', symbol: "so'm", rate: 12600 },
]

export const languageOptions = [
  { id: 'EN', label: 'English' },
  { id: 'RU', label: 'Русский' },
  { id: 'UZ', label: "O'zbek" },
]

const defaultNotifications = [
  { id: 1, title: 'Price drop', description: 'AWP | Dragon Lore narxi 3.8% ga tushdi.', time: '2m ago', unread: true },
  { id: 2, title: 'Trade ready', description: 'Cart ichidagi itemlar trade tasdiqlashga tayyor.', time: '12m ago', unread: true },
  { id: 3, title: 'New drop', description: 'Yangi premium glove koleksiyasi live bo‘ldi.', time: '1h ago', unread: false },
]

function readStoredPreferences() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function PreferencesProvider({ children }) {
  const storedPreferences = readStoredPreferences()
  const [theme, setTheme] = useState(storedPreferences?.theme || 'dark')
  const [currency, setCurrency] = useState(storedPreferences?.currency || 'USD')
  const [language, setLanguage] = useState(storedPreferences?.language || 'EN')
  const [notifications, setNotifications] = useState(storedPreferences?.notifications || defaultNotifications)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const nextPreferences = { theme, currency, language, notifications }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences))
  }, [theme, currency, language, notifications])

  const unreadNotifications = notifications.filter((item) => item.unread).length

  const markNotificationsAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })))
  }

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      currency,
      setCurrency,
      language,
      setLanguage,
      notifications,
      unreadNotifications,
      markNotificationsAsRead,
    }),
    [currency, language, notifications, theme, unreadNotifications],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const context = useContext(PreferencesContext)

  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider')
  }

  return context
}
