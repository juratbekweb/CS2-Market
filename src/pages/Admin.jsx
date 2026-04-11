import { useEffect, useMemo, useState } from 'react'
import { createProduct, deleteProduct, getOrders, updateOrder, updateProduct } from '../services/api'
import { useProducts } from '../hooks/useProducts'
import { getSkinFallbackImage } from '../utils/imageFallback'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
const ADMIN_TOKEN_KEY = 'cs2market_admin_token'

// Mock user analytics data
const generateUserAnalytics = () => {
  const days = 30
  const data = []
  let visitors = 1200
  let sessions = 950

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dayVisitors = Math.floor(visitors + (Math.random() - 0.5) * 200)
    const daySessions = Math.floor(sessions + (Math.random() - 0.5) * 150)
    data.push({
      date: date.toISOString().split('T')[0],
      visitors: Math.max(0, dayVisitors),
      sessions: Math.max(0, daySessions),
      pageViews: Math.floor(daySessions * (1.5 + Math.random() * 0.5)),
      bounceRate: Math.floor(30 + Math.random() * 40)
    })
    visitors = dayVisitors
    sessions = daySessions
  }
  return data
}

// Mock expenses data
const generateExpensesData = () => {
  const months = 12
  const data = []
  for (let i = months; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      marketing: Math.floor(500 + Math.random() * 1000),
      operations: Math.floor(800 + Math.random() * 1200),
      platform: Math.floor(200 + Math.random() * 300),
      shipping: Math.floor(300 + Math.random() * 500)
    })
  }
  return data
}

const userAnalyticsData = generateUserAnalytics()
const expensesData = generateExpensesData()

const rarityOptions = ['consumer', 'industrial', 'milspec', 'restricted', 'classified', 'covert']
const conditionOptions = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred']
const categoryOptions = ['rifles', 'pistols', 'knives', 'gloves', 'smgs', 'heavy']
const productStatusOptions = ['live', 'featured', 'hidden', 'soldout', 'draft']
const orderStatusOptions = ['created', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled']

const rarityBadgeMap = {
  consumer: 'bg-zinc-500/15 text-zinc-200 border-zinc-400/20',
  industrial: 'bg-sky-500/15 text-sky-200 border-sky-400/20',
  milspec: 'bg-blue-500/15 text-blue-200 border-blue-400/20',
  restricted: 'bg-violet-500/15 text-violet-200 border-violet-400/20',
  classified: 'bg-pink-500/15 text-pink-200 border-pink-400/20',
  covert: 'bg-red-500/15 text-red-200 border-red-400/20',
}

const statusBadgeMap = {
  live: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20',
  featured: 'bg-amber-400/15 text-amber-100 border-amber-300/30',
  hidden: 'bg-slate-500/15 text-slate-200 border-slate-400/20',
  soldout: 'bg-rose-500/15 text-rose-200 border-rose-400/20',
  draft: 'bg-purple-500/15 text-purple-200 border-purple-400/20',
  created: 'bg-white/10 text-white border-white/10',
  paid: 'bg-sky-500/15 text-sky-200 border-sky-400/20',
  preparing: 'bg-amber-400/15 text-amber-100 border-amber-300/30',
  shipped: 'bg-cyan-500/15 text-cyan-200 border-cyan-400/20',
  delivered: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20',
  cancelled: 'bg-rose-500/15 text-rose-200 border-rose-400/20',
}

const expenseColorMap = {
  marketing: '#ff5f6d',
  operations: '#ffb347',
  platform: '#7c6cff',
  shipping: '#45d7ff',
}

const inventoryColorMap = ['#ff6b6b', '#ffb84d', '#37d67a', '#4de2d4', '#7c6cff', '#ff7ad9']

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

function normalizeProduct(product) {
  const stock = Math.max(0, Number(product.stock ?? 1))
  const status = product.status || (stock === 0 ? 'soldout' : 'live')

  return {
    ...product,
    stock,
    status,
    featured: Boolean(product.featured || status === 'featured'),
    tags: Array.isArray(product.tags)
      ? product.tags
      : typeof product.tags === 'string' && product.tags.trim()
        ? product.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
    stats: {
      float: product.stats?.float ?? product.float ?? 0.01,
      pattern: product.stats?.pattern ?? 0,
      stickers: product.stats?.stickers ?? 'None',
      stattrak: Boolean(product.stats?.stattrak),
      souvenir: Boolean(product.stats?.souvenir),
    },
  }
}

function createEmptyProductForm() {
  return {
    name: '',
    category: 'rifles',
    image: '',
    price: '0',
    rarity: 'consumer',
    condition: 'Factory New',
    description: '',
    status: 'draft',
    stock: '1',
    featured: false,
    tags: '',
    float: '0.01',
    pattern: '0',
    stickers: 'None',
    stattrak: false,
    souvenir: false,
  }
}

function toProductPayload(form) {
  const stock = Math.max(0, Number(form.stock) || 0)
  const status = stock === 0 && form.status !== 'hidden' ? 'soldout' : form.status

  return {
    name: form.name.trim(),
    category: form.category,
    image: form.image.trim(),
    price: Number(form.price) || 0,
    rarity: form.rarity,
    condition: form.condition,
    description: form.description.trim(),
    status,
    stock,
    featured: Boolean(form.featured || status === 'featured'),
    tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    float: Number(form.float) || 0,
    stats: {
      float: Number(form.float) || 0,
      pattern: Number(form.pattern) || 0,
      stickers: form.stickers.trim() || 'None',
      stattrak: Boolean(form.stattrak),
      souvenir: Boolean(form.souvenir),
    },
  }
}

function Badge({ value, map = statusBadgeMap, className = '' }) {
  const key = String(value || '').toLowerCase()
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${map[key] || 'bg-white/10 text-white border-white/10'} ${className}`}>
      {value}
    </span>
  )
}

function StatCard({ label, value, hint }) {
  return (
    <div className="glass-panel premium-stat-card rounded-[1.75rem] p-5">
      <div className="text-xs uppercase tracking-[0.24em] text-orange-200/70">{label}</div>
      <div className="mt-3 text-3xl font-bold text-white">{value}</div>
      <div className="mt-2 text-sm text-text-secondary">{hint}</div>
    </div>
  )
}

function ProductForm({ form, setForm, onSubmit, submitLabel, onReset }) {
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block"><span className="text-sm text-text-secondary">Skin Name</span><input value={form.name} onChange={handleChange('name')} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" /></label>
        <label className="block"><span className="text-sm text-text-secondary">Image URL</span><input value={form.image} onChange={handleChange('image')} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" /></label>
        <label className="block"><span className="text-sm text-text-secondary">Category</span><select value={form.category} onChange={handleChange('category')} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
        <label className="block"><span className="text-sm text-text-secondary">Rarity</span><select value={form.rarity} onChange={handleChange('rarity')} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{rarityOptions.map((rarity) => <option key={rarity} value={rarity}>{rarity}</option>)}</select></label>
        <label className="block"><span className="text-sm text-text-secondary">Condition</span><select value={form.condition} onChange={handleChange('condition')} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{conditionOptions.map((condition) => <option key={condition} value={condition}>{condition}</option>)}</select></label>
        <label className="block"><span className="text-sm text-text-secondary">Status</span><select value={form.status} onChange={handleChange('status')} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{productStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
        <label className="block"><span className="text-sm text-text-secondary">Price</span><input type="number" min="0" step="0.01" value={form.price} onChange={handleChange('price')} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" /></label>
        <label className="block"><span className="text-sm text-text-secondary">Stock</span><input type="number" min="0" step="1" value={form.stock} onChange={handleChange('stock')} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" /></label>
        <label className="block"><span className="text-sm text-text-secondary">Float</span><input type="number" min="0" max="1" step="0.0001" value={form.float} onChange={handleChange('float')} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" /></label>
        <label className="block"><span className="text-sm text-text-secondary">Pattern</span><input type="number" min="0" step="1" value={form.pattern} onChange={handleChange('pattern')} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" /></label>
        <label className="block md:col-span-2"><span className="text-sm text-text-secondary">Tags</span><input value={form.tags} onChange={handleChange('tags')} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" placeholder="featured, premium" /></label>
        <label className="block md:col-span-2"><span className="text-sm text-text-secondary">Stickers</span><input value={form.stickers} onChange={handleChange('stickers')} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" /></label>
        <label className="block md:col-span-2"><span className="text-sm text-text-secondary">Description</span><textarea value={form.description} onChange={handleChange('description')} className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" /></label>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary"><input type="checkbox" checked={form.featured} onChange={handleChange('featured')} className="accent-orange-300" />Featured</label>
        <label className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary"><input type="checkbox" checked={form.stattrak} onChange={handleChange('stattrak')} className="accent-orange-300" />StatTrak</label>
        <label className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary"><input type="checkbox" checked={form.souvenir} onChange={handleChange('souvenir')} className="accent-orange-300" />Souvenir</label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onSubmit} className="premium-button rounded-2xl px-5 py-3 font-semibold">{submitLabel}</button>
        <button type="button" onClick={onReset} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-text-secondary hover:border-orange-300/30 hover:text-orange-100">Reset</button>
      </div>
    </div>
  )
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const { products, loading: productsLoading, error: productsError, refresh: refreshProducts } = useProducts()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterRarity, setFilterRarity] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterStockState, setFilterStockState] = useState('')
  const [orderFilter, setOrderFilter] = useState('')
  const [editingProductId, setEditingProductId] = useState(null)
  const [editForm, setEditForm] = useState(() => createEmptyProductForm())
  const [newProduct, setNewProduct] = useState(() => createEmptyProductForm())

  const normalizedProducts = useMemo(() => products.map(normalizeProduct), [products])
  const sortedOrders = useMemo(() => [...orders].sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt)), [orders])

  const analytics = useMemo(() => {
    const totalInventoryValue = normalizedProducts.reduce((sum, product) => sum + product.price * product.stock, 0)
    const lowStockCount = normalizedProducts.filter((product) => product.stock > 0 && product.stock <= 2).length
    const featuredCount = normalizedProducts.filter((product) => product.featured).length
    const totalRevenue = sortedOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0)
    const averageOrder = sortedOrders.length ? totalRevenue / sortedOrders.length : 0

    // Calculate expenses (mock data)
    const totalExpenses = expensesData.reduce((sum, month) => sum + month.marketing + month.operations + month.platform + month.shipping, 0)
    const netProfit = totalRevenue - totalExpenses

    // User analytics
    const todayVisitors = userAnalyticsData[userAnalyticsData.length - 1]?.visitors || 0
    const yesterdayVisitors = userAnalyticsData[userAnalyticsData.length - 2]?.visitors || 0
    const visitorGrowth = yesterdayVisitors ? ((todayVisitors - yesterdayVisitors) / yesterdayVisitors * 100) : 0

    const totalVisitors = userAnalyticsData.reduce((sum, day) => sum + day.visitors, 0)
    const totalSessions = userAnalyticsData.reduce((sum, day) => sum + day.sessions, 0)
    const avgBounceRate = userAnalyticsData.reduce((sum, day) => sum + day.bounceRate, 0) / userAnalyticsData.length

    // Top products by revenue
    const productSales = {}
    sortedOrders.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          const key = item.id || item.name
          if (!productSales[key]) {
            productSales[key] = { name: item.name, revenue: 0, quantity: 0 }
          }
          productSales[key].revenue += Number(item.price) || 0
          productSales[key].quantity += 1
        })
      }
    })
    const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

    return {
      totalInventoryValue,
      lowStockCount,
      featuredCount,
      totalRevenue,
      averageOrder,
      totalExpenses,
      netProfit,
      todayVisitors,
      visitorGrowth,
      totalVisitors,
      totalSessions,
      avgBounceRate,
      topProducts
    }
  }, [normalizedProducts, sortedOrders])

  const topCategories = useMemo(() => {
    const counts = normalizedProducts.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4)
  }, [normalizedProducts])

  const premiumProducts = useMemo(() => [...normalizedProducts].sort((a, b) => b.price - a.price).slice(0, 5), [normalizedProducts])

  const filteredProducts = useMemo(() => {
    return normalizedProducts.filter((product) => {
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query) || product.tags.some((tag) => tag.toLowerCase().includes(query))
      const matchesCategory = !filterCategory || product.category === filterCategory
      const matchesRarity = !filterRarity || product.rarity === filterRarity
      const matchesStatus = !filterStatus || product.status === filterStatus
      const matchesStock =
        !filterStockState ||
        (filterStockState === 'in-stock' && product.stock > 0) ||
        (filterStockState === 'low-stock' && product.stock > 0 && product.stock <= 2) ||
        (filterStockState === 'sold-out' && product.stock === 0)

      return matchesSearch && matchesCategory && matchesRarity && matchesStatus && matchesStock
    })
  }, [filterCategory, filterRarity, filterStatus, filterStockState, normalizedProducts, searchQuery])

  const filteredOrders = useMemo(() => {
    if (!orderFilter) return sortedOrders
    return sortedOrders.filter((order) => (order.status || 'created') === orderFilter)
  }, [orderFilter, sortedOrders])

  const activeProduct = useMemo(() => normalizedProducts.find((product) => product.id === editingProductId) || null, [editingProductId, normalizedProducts])

  const loadOrders = async () => {
    setOrdersLoading(true)
    setOrdersError(null)
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (error) {
      setOrdersError(error)
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    const token = window.localStorage.getItem(ADMIN_TOKEN_KEY)
    if (token === ADMIN_PASSWORD) setLoggedIn(true)
  }, [])

  useEffect(() => {
    if (loggedIn) loadOrders()
  }, [loggedIn])

  const showMessage = (type, text) => setActionMessage({ type, text })

  const handleLogin = (event) => {
    event.preventDefault()
    if (password === ADMIN_PASSWORD) {
      window.localStorage.setItem(ADMIN_TOKEN_KEY, ADMIN_PASSWORD)
      setLoggedIn(true)
      showMessage('success', 'Admin access granted. Control center is ready.')
    } else {
      showMessage('error', 'Wrong password.')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY)
    setLoggedIn(false)
    setPassword('')
    setActiveTab('overview')
  }

  const startEdit = (product) => {
    const normalized = normalizeProduct(product)
    setEditingProductId(product.id)
    setActiveTab('products')
    setEditForm({
      name: normalized.name || '',
      category: normalized.category || 'rifles',
      image: normalized.image || '',
      price: String(normalized.price ?? 0),
      rarity: normalized.rarity || 'consumer',
      condition: normalized.condition || 'Factory New',
      description: normalized.description || '',
      status: normalized.status || 'live',
      stock: String(normalized.stock ?? 1),
      featured: Boolean(normalized.featured),
      tags: normalized.tags.join(', '),
      float: String(normalized.stats.float ?? 0.01),
      pattern: String(normalized.stats.pattern ?? 0),
      stickers: normalized.stats.stickers || 'None',
      stattrak: Boolean(normalized.stats.stattrak),
      souvenir: Boolean(normalized.stats.souvenir),
    })
  }

  const cancelEdit = () => {
    setEditingProductId(null)
    setEditForm(createEmptyProductForm())
  }

  const handleSaveEdit = async () => {
    try {
      await updateProduct(editingProductId, toProductPayload(editForm))
      await refreshProducts()
      showMessage('success', 'Product updated successfully.')
    } catch (error) {
      showMessage('error', `Failed to update product: ${error.message}`)
    }
  }

  const handleCreate = async () => {
    try {
      await createProduct(toProductPayload(newProduct))
      await refreshProducts()
      setNewProduct(createEmptyProductForm())
      showMessage('success', 'New skin added to the catalog.')
    } catch (error) {
      showMessage('error', `Failed to create product: ${error.message}`)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      await refreshProducts()
      if (editingProductId === id) cancelEdit()
      showMessage('success', 'Product deleted.')
    } catch (error) {
      showMessage('error', `Failed to delete product: ${error.message}`)
    }
  }

  const runQuickProductAction = async (product, patch) => {
    try {
      await updateProduct(product.id, patch)
      await refreshProducts()
      showMessage('success', `${product.name} updated.`)
    } catch (error) {
      showMessage('error', `Quick action failed: ${error.message}`)
    }
  }

  const handleOrderUpdate = async (orderId, updates) => {
    try {
      await updateOrder(orderId, updates)
      await loadOrders()
      showMessage('success', `Order ${orderId} updated.`)
    } catch (error) {
      showMessage('error', `Failed to update order: ${error.message}`)
    }
  }

  if (!loggedIn) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-panel relative overflow-hidden rounded-[2.2rem] border border-white/10 p-8 lg:p-10">
            <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-orange-300/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-yellow-200/10 blur-3xl" />
            <p className="text-sm uppercase tracking-[0.3em] text-orange-200/70">Premium Admin Suite</p>
            <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight md:text-5xl">Inventory, orders and spotlight skins in one control center.</h1>
            <p className="mt-4 max-w-2xl text-base text-text-secondary">Premium overview, low-stock monitoring, fast product actions and richer order management are all ready inside this admin panel.</p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <StatCard label="Live Ops" value="24/7" hint="Manage drops and catalog updates from your phone." />
              <StatCard label="Smart Filters" value="5+" hint="Search by stock, rarity, status and category instantly." />
              <StatCard label="Quick Actions" value="1 Tap" hint="Feature, hide, discount or sell out a skin quickly." />
            </div>
          </div>
          <div className="glass-panel rounded-[2.2rem] border border-white/10 p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold">Admin Login</h2>
            <p className="mt-2 text-text-secondary">Unlock the dashboard to manage skins, stock, featured items and orders.</p>
            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-text-secondary">Password</span>
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 focus:outline-none" />
              </label>
              <button type="submit" className="premium-button w-full rounded-2xl px-4 py-4 text-lg font-semibold">Unlock Admin Panel</button>
            </form>
            <div className="mt-6 rounded-2xl border border-orange-300/15 bg-orange-300/8 p-4 text-sm text-orange-100">Demo password: <code className="rounded bg-black/20 px-2 py-1">admin123</code></div>
            {actionMessage && <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${actionMessage.type === 'error' ? 'border-red-400/20 bg-red-500/10 text-red-200' : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200'}`}>{actionMessage.text}</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <section className="glass-panel relative overflow-hidden rounded-[2.4rem] border border-white/10 p-6 md:p-8">
        <div className="absolute -top-20 right-8 h-44 w-44 rounded-full bg-orange-200/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-orange-200/70">Control Center</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">Premium Admin Dashboard</h1>
            <p className="mt-3 max-w-2xl text-text-secondary">Manage showcase skins, stock depth, catalog polish and customer orders from one premium workspace.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {['overview', 'orders', 'products'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${activeTab === tab ? 'bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 text-black shadow-[0_16px_40px_rgba(255,180,0,0.22)]' : 'border border-white/10 bg-white/5 text-text-secondary hover:border-orange-300/30 hover:text-orange-100'}`}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <button type="button" onClick={handleLogout} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 font-semibold text-text-secondary transition hover:border-orange-300/30 hover:text-orange-100">Logout</button>
          </div>
        </div>
      </section>

      {actionMessage && <div className={`mt-6 rounded-[1.5rem] border px-5 py-4 text-sm ${actionMessage.type === 'error' ? 'border-red-400/20 bg-red-500/10 text-red-200' : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200'}`}>{actionMessage.text}</div>}

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Today's Visitors" value={analytics.todayVisitors.toLocaleString()} hint={`${analytics.visitorGrowth >= 0 ? '+' : ''}${analytics.visitorGrowth.toFixed(1)}% from yesterday`} />
        <StatCard label="Total Sessions" value={analytics.totalSessions.toLocaleString()} hint={`Avg bounce rate: ${analytics.avgBounceRate.toFixed(1)}%`} />
        <StatCard label="Revenue" value={formatCurrency(analytics.totalRevenue)} hint="Lifetime earnings" />
        <StatCard label="Expenses" value={formatCurrency(analytics.totalExpenses)} hint="Monthly operational costs" />
        <StatCard label="Net Profit" value={formatCurrency(analytics.netProfit)} hint={`${analytics.netProfit >= 0 ? 'Profit' : 'Loss'} margin`} />
        <StatCard label="Avg Order" value={formatCurrency(analytics.averageOrder)} hint="Per transaction value" />
      </section>

      {activeTab === 'overview' && (
        <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {/* User Analytics Chart */}
            <div className="glass-panel rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-200/70">User Analytics</p>
                  <h2 className="mt-2 text-2xl font-bold">Visitor Trends (30 Days)</h2>
                </div>
                <div className="text-right">
                  <div className="text-sm text-text-secondary">Total Visitors</div>
                  <div className="text-xl font-bold text-white">{analytics.totalVisitors.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#ffffff60" fontSize={12} />
                    <YAxis stroke="#ffffff60" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#000000',
                        border: '1px solid #ffffff20',
                        borderRadius: '0.5rem',
                        color: '#ffffff'
                      }}
                    />
                    <Area type="monotone" dataKey="visitors" stroke="#f97316" fill="#f97316" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="sessions" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue vs Expenses Chart */}
            <div className="glass-panel premium-chart-card premium-chart-card--finance rounded-[2rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-100/75">Financial Overview</p>
                  <h2 className="mt-2 text-2xl font-bold">Revenue vs Expenses (12 Months)</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                    Premium spend mix with warmer acquisition tones and cooler logistics accents for faster scanning.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-right shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Net Profit</div>
                  <div className={`mt-2 text-2xl font-bold ${analytics.netProfit >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {formatCurrency(analytics.netProfit)}
                  </div>
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/15 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="grid gap-3 pb-4 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">Marketing</div>
                    <div className="mt-2 font-semibold text-[#ff9ca5]">{formatCurrency(analytics.totalRevenue * 0.18)}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">Operations</div>
                    <div className="mt-2 font-semibold text-[#ffd38a]">{formatCurrency(analytics.totalExpenses * 0.36)}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">Platform</div>
                    <div className="mt-2 font-semibold text-[#b6a7ff]">{formatCurrency(analytics.totalExpenses * 0.12)}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">Shipping</div>
                    <div className="mt-2 font-semibold text-[#99efff]">{formatCurrency(analytics.totalExpenses * 0.16)}</div>
                  </div>
                </div>
                <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expensesData}>
                    <defs>
                      <linearGradient id="marketingGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ff7e8a" />
                        <stop offset="100%" stopColor="#ff4d61" />
                      </linearGradient>
                      <linearGradient id="operationsGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ffd27a" />
                        <stop offset="100%" stopColor="#ff9a3d" />
                      </linearGradient>
                      <linearGradient id="platformGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#9f90ff" />
                        <stop offset="100%" stopColor="#6958ff" />
                      </linearGradient>
                      <linearGradient id="shippingGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#7debff" />
                        <stop offset="100%" stopColor="#29c7ff" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
                    <XAxis dataKey="month" stroke="#ffffff66" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff66" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(11, 12, 20, 0.92)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '1rem',
                        color: '#ffffff'
                      }}
                      formatter={(value, name) => [formatCurrency(value), name]}
                    />
                    <Bar dataKey="marketing" stackId="expenses" fill="url(#marketingGradient)" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="operations" stackId="expenses" fill="url(#operationsGradient)" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="platform" stackId="expenses" fill="url(#platformGradient)" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="shipping" stackId="expenses" fill="url(#shippingGradient)" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              </div>
              <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ['Marketing', 'Warm demand capture', expenseColorMap.marketing],
                  ['Operations', 'Core fulfillment', expenseColorMap.operations],
                  ['Platform', 'Infrastructure stack', expenseColorMap.platform],
                  ['Shipping', 'Delivery pipeline', expenseColorMap.shipping],
                ].map(([label, description, color]) => (
                  <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full shadow-[0_0_18px_currentColor]" style={{ backgroundColor: color, color }}></span>
                      <span className="font-semibold text-white">{label}</span>
                    </div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/40">{description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products Chart */}
            <div className="glass-panel rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-200/70">Top Performers</p>
              <h2 className="mt-2 text-2xl font-bold">Best Selling Products</h2>
              <div className="mt-6 space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-300 to-yellow-200 text-sm font-bold text-black">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-semibold text-white">{product.name}</div>
                      <div className="text-sm text-text-secondary">{product.quantity} units sold</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-100">{formatCurrency(product.revenue)}</div>
                    </div>
                  </div>
                ))}
                {!analytics.topProducts.length && (
                  <div className="text-center text-text-secondary py-8">No sales data available yet</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Real-time Stats */}
            <div className="glass-panel rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-200/70">Live Metrics</p>
              <h2 className="mt-2 text-2xl font-bold">Current Status</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Active Users</span>
                  <span className="font-bold text-white">{Math.floor(Math.random() * 50) + 10}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Server Status</span>
                  <span className="font-bold text-emerald-400">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Response Time</span>
                  <span className="font-bold text-white">{Math.floor(Math.random() * 100) + 50}ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Uptime</span>
                  <span className="font-bold text-white">99.9%</span>
                </div>
              </div>
            </div>

            {/* Category Distribution Pie Chart */}
            <div className="glass-panel premium-chart-card premium-chart-card--inventory rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/70">Inventory</p>
              <h2 className="mt-2 text-2xl font-bold">Category Distribution</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Cleaner category contrast with jewel-toned slices and a polished ring layout.
              </p>
              <div className="mt-6 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topCategories.map(([category, count]) => ({ name: category, value: count }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={84}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth={2}
                    >
                      {topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={inventoryColorMap[index % inventoryColorMap.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(11, 12, 20, 0.92)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '1rem',
                        color: '#ffffff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {topCategories.map((category, index) => (
                  <div key={category[0]} className="flex items-center gap-3 rounded-[1.15rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm">
                    <div className="h-3 w-3 rounded-full shadow-[0_0_18px_currentColor]" style={{ backgroundColor: inventoryColorMap[index % inventoryColorMap.length], color: inventoryColorMap[index % inventoryColorMap.length] }}></div>
                    <span className="capitalize text-white/75">{category[0]}</span>
                    <span className="ml-auto text-xs uppercase tracking-[0.18em] text-white/40">Items</span>
                    <span className="font-semibold text-white">{category[1]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel premium-chart-card premium-chart-card--activity rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-violet-100/70">Activity Feed</p>
              <h2 className="mt-2 text-2xl font-bold">Recent Events</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Softer contrast, better depth and status emphasis for high-value admin actions.
              </p>
              <div className="mt-6 space-y-3">
                {sortedOrders.slice(0, 5).map((order) => (
                  <div key={order.orderId} className="flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.16)] backdrop-blur-md">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,255,190,0.9)]"></div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-white">New Order</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.16em] text-white/40">{formatDate(order.purchasedAt)}</div>
                    </div>
                    <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-sm font-bold text-emerald-100">
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                ))}
                {!sortedOrders.length && (
                  <div className="text-center text-text-secondary py-4">No recent activity</div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'orders' && (
        <section className="mt-8 space-y-6">
          <div className="glass-panel rounded-[2rem] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-orange-200/70">Order Management</p>
                <h2 className="mt-2 text-2xl font-bold">Track and update every purchase</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select value={orderFilter} onChange={(event) => setOrderFilter(event.target.value)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary">
                  <option value="">All statuses</option>
                  {orderStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <button type="button" onClick={loadOrders} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-secondary hover:border-orange-300/30 hover:text-orange-100">Refresh</button>
              </div>
            </div>
          </div>

          {ordersLoading ? (
            <div className="glass-panel rounded-[2rem] p-8 text-text-secondary">Loading orders...</div>
          ) : ordersError ? (
            <div className="glass-panel rounded-[2rem] border border-red-400/20 bg-red-500/10 p-8 text-red-200">Failed to load orders: {ordersError.message}</div>
          ) : (
            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <div key={order.orderId} className="glass-panel rounded-[2rem] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="font-mono text-sm text-orange-100">{order.orderId}</div>
                      <div className="mt-2 text-sm text-text-secondary">{formatDate(order.purchasedAt)}</div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge value={order.status || 'created'} />
                        <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-text-secondary">{Array.isArray(order.items) ? order.items.length : 0} items</span>
                      </div>
                    </div>
                    <div className="min-w-[220px]">
                      <div className="text-right text-2xl font-bold text-white">{formatCurrency(order.total)}</div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => handleOrderUpdate(order.orderId, { status: 'paid' })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-secondary hover:border-sky-400/30 hover:text-sky-200">Paid</button>
                        <button type="button" onClick={() => handleOrderUpdate(order.orderId, { status: 'preparing' })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-secondary hover:border-amber-300/30 hover:text-amber-100">Preparing</button>
                        <button type="button" onClick={() => handleOrderUpdate(order.orderId, { status: 'shipped' })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-secondary hover:border-cyan-300/30 hover:text-cyan-100">Shipped</button>
                        <button type="button" onClick={() => handleOrderUpdate(order.orderId, { status: 'delivered' })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-secondary hover:border-emerald-300/30 hover:text-emerald-100">Delivered</button>
                        <button type="button" onClick={() => handleOrderUpdate(order.orderId, { status: 'cancelled' })} className="col-span-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/15">Cancel Order</button>
                      </div>
                    </div>
                  </div>

                  {Array.isArray(order.items) && order.items.length > 0 && (
                    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {order.items.map((item, index) => (
                        <div key={`${order.orderId}-${item.id || index}`} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-3">
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="mt-1 text-sm text-text-secondary capitalize">{item.category || 'skin'} • {item.condition || 'Condition n/a'}</div>
                          <div className="mt-2 text-sm font-semibold text-orange-100">{formatCurrency(item.price)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {!filteredOrders.length && <div className="glass-panel rounded-[2rem] p-8 text-center text-text-secondary">No orders found for this filter.</div>}
            </div>
          )}
        </section>
      )}

      {activeTab === 'products' && (
        <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="glass-panel rounded-[2rem] p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-200/70">Catalog Command Bar</p>
                  <h2 className="mt-2 text-2xl font-bold">Search, filter and act fast</h2>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search by name, category or tag" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 xl:col-span-2" />
                  <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><option value="">All categories</option>{categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}</select>
                  <select value={filterRarity} onChange={(event) => setFilterRarity(event.target.value)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><option value="">All rarities</option>{rarityOptions.map((rarity) => <option key={rarity} value={rarity}>{rarity}</option>)}</select>
                  <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><option value="">All statuses</option>{productStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[{ value: '', label: 'All stock' }, { value: 'in-stock', label: 'In stock' }, { value: 'low-stock', label: 'Low stock' }, { value: 'sold-out', label: 'Sold out' }].map((option) => (
                    <button key={option.label} type="button" onClick={() => setFilterStockState(option.value)} className={`rounded-full px-4 py-2 text-sm transition ${filterStockState === option.value ? 'bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 text-black' : 'border border-white/10 bg-white/5 text-text-secondary hover:border-orange-300/30 hover:text-orange-100'}`}>{option.label}</button>
                  ))}
                </div>
              </div>
            </div>

            {productsLoading ? (
              <div className="glass-panel rounded-[2rem] p-8 text-text-secondary">Loading products...</div>
            ) : productsError ? (
              <div className="glass-panel rounded-[2rem] border border-red-400/20 bg-red-500/10 p-8 text-red-200">Failed to load products: {productsError.message}</div>
            ) : (
              <div className="glass-panel overflow-hidden rounded-[2rem]">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                  <div><h3 className="text-xl font-bold">Product Catalog</h3><p className="mt-1 text-sm text-text-secondary">{filteredProducts.length} items match your current filters.</p></div>
                  <button type="button" onClick={refreshProducts} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-secondary hover:border-orange-300/30 hover:text-orange-100">Refresh</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-black/20 text-left text-xs uppercase tracking-[0.18em] text-text-secondary">
                      <tr><th className="px-6 py-4">Skin</th><th className="px-4 py-4">Price</th><th className="px-4 py-4">Stock</th><th className="px-4 py-4">Rarity</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Quick Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-t border-white/10 align-top hover:bg-white/5">
                          <td className="px-6 py-4">
                            <div className="flex min-w-[280px] items-start gap-4">
                              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                                <img src={product.image || ''} alt={product.name} className="h-full w-full object-cover" onError={(event) => { event.target.onerror = null; event.target.src = getSkinFallbackImage(product.name, 96, 96) }} />
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-white">{product.name}</div>
                                <div className="mt-1 text-xs text-text-secondary capitalize">{product.category} • {product.condition} • Float {Number(product.stats.float || 0).toFixed(4)}</div>
                                {product.tags.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{product.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-text-secondary">{tag}</span>)}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 font-semibold text-orange-100">{formatCurrency(product.price)}</td>
                          <td className="px-4 py-4"><div className="font-semibold text-white">{product.stock}</div><div className="text-xs text-text-secondary">{product.stock === 0 ? 'Sold out' : product.stock <= 2 ? 'Low stock' : 'Healthy'}</div></td>
                          <td className="px-4 py-4"><Badge value={product.rarity} map={rarityBadgeMap} /></td>
                          <td className="px-4 py-4"><div className="space-y-2"><Badge value={product.status} />{product.featured && <Badge value="featured pick" className="bg-amber-400/10 text-amber-100 border-amber-300/20" />}</div></td>
                          <td className="px-4 py-4">
                            <div className="flex min-w-[260px] flex-wrap gap-2">
                              <button type="button" onClick={() => startEdit(product)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-text-secondary hover:border-orange-300/30 hover:text-orange-100">Edit</button>
                              <button type="button" onClick={() => runQuickProductAction(product, { featured: !product.featured, status: !product.featured ? 'featured' : 'live' })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-text-secondary hover:border-amber-300/30 hover:text-amber-100">{product.featured ? 'Unfeature' : 'Feature'}</button>
                              <button type="button" onClick={() => runQuickProductAction(product, { stock: 0, status: 'soldout' })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-text-secondary hover:border-red-300/30 hover:text-red-200">Sell Out</button>
                              <button type="button" onClick={() => runQuickProductAction(product, { price: Number((product.price * 0.9).toFixed(2)), tags: Array.from(new Set([...product.tags, 'sale'])) })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-text-secondary hover:border-emerald-300/30 hover:text-emerald-100">-10%</button>
                              <button type="button" onClick={() => handleDelete(product.id)} className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-red-200 hover:bg-red-500/15">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-panel rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-200/70">Editor</p>
              <h3 className="mt-2 text-2xl font-bold">{activeProduct ? 'Edit active skin' : 'Select a skin to edit'}</h3>
              <p className="mt-2 text-sm text-text-secondary">Fine-tune pricing, stock, rarity, float data, status and featured placement without leaving the dashboard.</p>
              {activeProduct ? (
                <div className="mt-6 space-y-5">
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <div className="font-semibold text-white">{activeProduct.name}</div>
                    <div className="mt-2 flex flex-wrap gap-2"><Badge value={activeProduct.status} /><Badge value={activeProduct.rarity} map={rarityBadgeMap} /></div>
                  </div>
                  <ProductForm form={editForm} setForm={setEditForm} onSubmit={handleSaveEdit} submitLabel="Save Product" onReset={cancelEdit} />
                </div>
              ) : <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-5 text-sm text-text-secondary">Pick any skin from the catalog table to open the full editor here.</div>}
            </div>

            <div className="glass-panel rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-orange-200/70">Create New Listing</p>
              <h3 className="mt-2 text-2xl font-bold">Launch a fresh skin drop</h3>
              <div className="mt-6"><ProductForm form={newProduct} setForm={setNewProduct} onSubmit={handleCreate} submitLabel="Create Product" onReset={() => setNewProduct(createEmptyProductForm())} /></div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
