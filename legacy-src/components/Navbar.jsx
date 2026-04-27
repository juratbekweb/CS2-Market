import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import {
  currencyOptions,
  languageOptions,
  themeOptions,
  usePreferences,
} from '../context/PreferencesContext'
import { useWishlist } from '../context/WishlistContext'

const navTranslations = {
  EN: {
    home: 'Home',
    browse: 'Browse',
    account: 'Account',
    orders: 'Orders',
    admin: 'Admin',
    wishlist: 'Wishlist',
    cart: 'Cart',
    notifications: 'Notifications',
    chooseTheme: 'Choose Theme',
    balance: 'Balance',
  },
  RU: {
    home: 'Главная',
    browse: 'Каталог',
    account: 'Аккаунт',
    orders: 'Заказы',
    admin: 'Админ',
    wishlist: 'Избранное',
    cart: 'Корзина',
    notifications: 'Уведомления',
    chooseTheme: 'Выбор темы',
    balance: 'Баланс',
  },
  UZ: {
    home: 'Bosh sahifa',
    browse: 'Katalog',
    account: 'Akkaunt',
    orders: 'Buyurtmalar',
    admin: 'Admin',
    wishlist: 'Saralangan',
    cart: 'Savat',
    notifications: 'Bildirishnomalar',
    chooseTheme: 'Tema tanlash',
    balance: 'Balans',
  },
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openPanel, setOpenPanel] = useState(null)
  const panelRef = useRef(null)
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const {
    currency,
    setCurrency,
    language,
    setLanguage,
    theme,
    setTheme,
    notifications,
    unreadNotifications,
    markNotificationsAsRead,
  } = usePreferences()
  const location = useLocation()

  const copy = navTranslations[language] || navTranslations.EN
  const isActive = (path) => location.pathname === path
  const navItems = [
    { to: '/', label: copy.home },
    { to: '/products', label: copy.browse },
    { to: '/account', label: copy.account },
    { to: '/orders', label: copy.orders },
    { to: '/admin', label: copy.admin },
  ]

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!panelRef.current?.contains(event.target)) {
        setOpenPanel(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const selectedCurrency = currencyOptions.find((option) => option.id === currency) || currencyOptions[0]
  const balanceLabel = useMemo(() => {
    const balanceBaseUsd = 0
    const amount = balanceBaseUsd * selectedCurrency.rate

    return new Intl.NumberFormat(selectedCurrency.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }, [selectedCurrency])

  const formattedBalance = selectedCurrency.symbol === "so'm"
    ? `${balanceLabel} ${selectedCurrency.symbol}`
    : `${selectedCurrency.symbol}${balanceLabel}`

  const togglePanel = (panelName) => {
    setOpenPanel((current) => (current === panelName ? null : panelName))

    if (panelName === 'notifications') {
      markNotificationsAsRead()
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-orange-300/15 bg-[#120d07]/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.28)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,170,0,0.10),transparent_30%,transparent_70%,rgba(255,120,0,0.10))]"></div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link to="/" className="relative z-10 flex items-center gap-3 text-2xl font-bold text-orange-100">
            <div className="h-11 w-11 overflow-hidden rounded-xl border border-orange-300/50 shadow-[0_0_24px_rgba(255,170,0,0.22)]">
              <img
                src="https://cdn.cloudflare.steamstatic.com/steam/apps/730/capsule_231x87.jpg"
                alt="CS2 Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="block bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-100 bg-clip-text text-transparent">
                CS2 Marketplace
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-orange-200/70">
                Elite Skin Exchange
              </span>
            </div>
          </Link>

          <ul className="relative z-10 hidden items-center gap-3 rounded-full border border-white/10 bg-black/20 px-3 py-2 lg:flex">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive(item.to)
                      ? 'bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 text-black shadow-[0_0_20px_rgba(255,190,80,0.25)]'
                      : 'text-text-secondary hover:bg-white/5 hover:text-orange-100'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/account" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-text-secondary transition-all hover:border-orange-300/30 hover:text-orange-100">
                <i className="fas fa-heart text-orange-200"></i> {copy.wishlist}
                <span className="rounded-full bg-gradient-to-r from-rose-400 to-orange-300 px-2 py-0.5 text-sm font-semibold text-black">
                  {wishlistCount}
                </span>
              </Link>
            </li>
          </ul>

          <div ref={panelRef} className="relative z-10 hidden xl:block">
            <div className="flex items-center gap-2 rounded-[1.7rem] border border-white/10 bg-[rgb(var(--color-bg-secondary)/0.86)] px-3 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <button type="button" className="rounded-2xl bg-[rgb(var(--color-accent-primary)/0.12)] px-4 py-3 text-lg font-bold text-text-primary transition-all hover:bg-[rgb(var(--color-accent-primary)/0.2)]">
                {formattedBalance}
              </button>

              <button
                type="button"
                onClick={() => togglePanel('currency')}
                className={`nav-utility-button ${openPanel === 'currency' ? 'nav-utility-button--active' : ''}`}
              >
                <span>{selectedCurrency.label}</span>
                <i className="fas fa-chevron-down text-[11px]"></i>
              </button>

              <button
                type="button"
                onClick={() => togglePanel('language')}
                className={`nav-utility-button ${openPanel === 'language' ? 'nav-utility-button--active' : ''}`}
              >
                <span>{language}</span>
                <i className="fas fa-chevron-down text-[11px]"></i>
              </button>

              <Link to="/cart" className="nav-icon-button" aria-label={copy.cart}>
                <i className="fas fa-cart-shopping text-xl"></i>
                {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
              </Link>

              <button type="button" onClick={() => togglePanel('notifications')} className="nav-icon-button" aria-label={copy.notifications}>
                <i className="far fa-bell text-xl"></i>
                {unreadNotifications > 0 && <span className="nav-badge">{unreadNotifications}</span>}
              </button>

              <button type="button" onClick={() => togglePanel('theme')} className="nav-icon-button" aria-label={copy.chooseTheme}>
                <i className="fas fa-palette text-xl"></i>
              </button>

              <Link to="/account" className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <img
                  src="https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=cs2trader"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </Link>
            </div>

            {openPanel === 'currency' && (
              <div className="nav-panel absolute right-[10.5rem] top-[calc(100%+0.85rem)] w-40">
                {currencyOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setCurrency(option.id)
                      setOpenPanel(null)
                    }}
                    className={`nav-panel-option ${currency === option.id ? 'nav-panel-option--active' : ''}`}
                  >
                    <span>{option.label}</span>
                    <span className="text-sm text-text-secondary">{option.symbol}</span>
                  </button>
                ))}
              </div>
            )}

            {openPanel === 'language' && (
              <div className="nav-panel absolute right-[6.8rem] top-[calc(100%+0.85rem)] w-44">
                {languageOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setLanguage(option.id)
                      setOpenPanel(null)
                    }}
                    className={`nav-panel-option ${language === option.id ? 'nav-panel-option--active' : ''}`}
                  >
                    <span>{option.id}</span>
                    <span className="text-sm text-text-secondary">{option.label}</span>
                  </button>
                ))}
              </div>
            )}

            {openPanel === 'notifications' && (
              <div className="nav-panel absolute right-[3.5rem] top-[calc(100%+0.85rem)] w-80">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">{copy.notifications}</h3>
                  <span className="rounded-full bg-[rgb(var(--color-accent-primary)/0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-primary">
                    {notifications.length} items
                  </span>
                </div>
                <div className="space-y-3">
                  {notifications.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-text-primary">{item.title}</span>
                            {item.unread && <span className="h-2.5 w-2.5 rounded-full bg-accent-primary shadow-[0_0_12px_rgb(var(--color-accent-primary)/0.7)]"></span>}
                          </div>
                          <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
                        </div>
                        <span className="text-xs uppercase tracking-[0.14em] text-text-muted">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {openPanel === 'theme' && (
              <div className="nav-panel absolute right-0 top-[calc(100%+0.85rem)] w-72">
                <h3 className="mb-4 text-2xl font-semibold text-text-primary">{copy.chooseTheme}</h3>
                <div className="space-y-3">
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setTheme(option.id)
                        setOpenPanel(null)
                      }}
                      className={`theme-tile ${theme === option.id ? 'theme-tile--active' : ''}`}
                    >
                      <span className="theme-tile-swatch" style={{ background: option.swatch }}></span>
                      <span className="text-lg font-medium text-text-primary">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            className="relative z-10 flex cursor-pointer flex-col gap-1.5 rounded-xl border border-orange-300/20 bg-black/25 px-3 py-3 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`h-0.5 w-6 bg-orange-200 transition-all ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
            <span className={`h-0.5 w-6 bg-orange-200 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`h-0.5 w-6 bg-orange-200 transition-all ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
          </button>
        </div>

        {isMenuOpen && (
          <div className="relative z-10 pb-4 md:hidden">
            <ul className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
              <li className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">{copy.balance}</p>
                  <p className="mt-2 text-xl font-bold text-text-primary">{formattedBalance}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">Currency</p>
                  <div className="flex flex-wrap gap-2">
                    {currencyOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setCurrency(option.id)}
                        className={`rounded-full px-3 py-1.5 text-sm ${currency === option.id ? 'bg-accent-primary text-black' : 'bg-white/5 text-text-secondary'}`}
                      >
                        {option.id}
                      </button>
                    ))}
                  </div>
                </div>
              </li>

              <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">Language</p>
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setLanguage(option.id)}
                      className={`rounded-full px-3 py-1.5 text-sm ${language === option.id ? 'bg-accent-primary text-black' : 'bg-white/5 text-text-secondary'}`}
                    >
                      {option.id}
                    </button>
                  ))}
                </div>
              </li>

              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`block rounded-2xl px-4 py-3 transition-all ${
                      isActive(item.to)
                        ? 'bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 font-semibold text-black'
                        : 'text-text-secondary hover:bg-white/5 hover:text-orange-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link to="/account" className="block rounded-2xl px-4 py-3 text-text-secondary transition-all hover:bg-white/5 hover:text-orange-100">
                  <i className="fas fa-heart"></i> {copy.wishlist} ({wishlistCount})
                </Link>
              </li>

              <li>
                <Link to="/cart" className="block rounded-2xl bg-gradient-to-r from-orange-300/15 to-yellow-200/10 px-4 py-3 text-orange-100 transition-all hover:from-orange-300 hover:to-yellow-200 hover:text-black">
                  <i className="fas fa-shopping-cart"></i> {copy.cart} ({cartCount})
                </Link>
              </li>

              <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium text-text-primary">{copy.notifications}</span>
                  {unreadNotifications > 0 && <span className="nav-badge">{unreadNotifications}</span>}
                </div>
                <div className="space-y-2">
                  {notifications.slice(0, 2).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/8 bg-black/20 p-3 text-sm text-text-secondary">
                      <div className="font-semibold text-text-primary">{item.title}</div>
                      <div className="mt-1">{item.description}</div>
                    </div>
                  ))}
                </div>
              </li>

              <li className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="mb-3 font-medium text-text-primary">{copy.chooseTheme}</p>
                <div className="grid grid-cols-2 gap-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setTheme(option.id)}
                      className={`rounded-2xl border px-3 py-3 text-left ${theme === option.id ? 'border-accent-primary bg-[rgb(var(--color-accent-primary)/0.12)]' : 'border-white/10 bg-black/20'}`}
                    >
                      <span className="mb-2 block h-8 w-8 rounded-full border border-white/10" style={{ background: option.swatch }}></span>
                      <span className="text-sm text-text-primary">{option.label}</span>
                    </button>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
