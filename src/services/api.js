const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

async function safeJsonResponse(response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const ADMIN_TOKEN_KEY = 'cs2market_admin_token'

function getAdminKey() {
  return typeof window !== 'undefined' ? window.localStorage.getItem(ADMIN_TOKEN_KEY) : null
}

async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const adminKey = getAdminKey()

  const authHeaders = adminKey
    ? {
        'x-admin-key': adminKey,
        authorization: adminKey,
      }
    : {}

  const headers = {
    ...(options.headers || {}),
    ...authHeaders,
  }

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const body = await safeJsonResponse(res)
    const message = body && body.error ? body.error : res.statusText
    throw new Error(message)
  }
  return safeJsonResponse(res)
}

export async function getCart() {
  return fetchJson('/cart')
}

export async function addToCart(item) {
  return fetchJson('/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
}

export async function removeFromCart(itemId) {
  return fetchJson(`/cart/${itemId}`, { method: 'DELETE' })
}

export async function clearCart() {
  return fetchJson('/cart/clear', { method: 'POST' })
}

export async function checkoutCart() {
  return fetchJson('/checkout', { method: 'POST' })
}

export async function getOrders() {
  return fetchJson('/orders')
}

export async function updateOrder(orderId, updates) {
  return fetchJson(`/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
}

export async function getProducts() {
  return fetchJson('/products')
}

export async function getProduct(id) {
  return fetchJson(`/products/${id}`)
}

export async function createProduct(product) {
  return fetchJson('/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
}

export async function updateProduct(id, updates) {
  return fetchJson(`/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
}

export async function deleteProduct(id) {
  return fetchJson(`/products/${id}`, { method: 'DELETE' })
}

export async function getWishlist() {
  return fetchJson('/wishlist')
}

export async function addToWishlist(item) {
  return fetchJson('/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
}

export async function removeFromWishlist(itemId) {
  return fetchJson(`/wishlist/${itemId}`, { method: 'DELETE' })
}

export async function clearWishlist() {
  return fetchJson('/wishlist/clear', { method: 'POST' })
}
