import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')

const app = express()
const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || '0.0.0.0'
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123'
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || ''

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || !CLIENT_ORIGIN) {
        return callback(null, true)
      }

      const allowedOrigins = CLIENT_ORIGIN.split(',').map((item) => item.trim()).filter(Boolean)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
  }),
)
app.use(express.json())

const requireAdmin = (req, res, next) => {
  const key = req.headers['x-admin-key'] || req.headers['authorization']
  if (!key || key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

const readJson = async (name) => {
  const file = path.join(DATA_DIR, name)
  try {
    const raw = await fs.readFile(file, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    if (err.code === 'ENOENT') {
      // If file doesn't exist yet, initialize it
      await writeJson(name, [])
      return []
    }
    throw err
  }
}

const writeJson = async (name, data) => {
  const file = path.join(DATA_DIR, name)
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8')
}

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'cs2-marketplace-server',
    timestamp: new Date().toISOString(),
  })
})

// CART
app.get('/api/cart', async (req, res) => {
  try {
    const cart = await readJson('cart.json')
    res.json(cart)
  } catch (err) {
    res.status(500).json({ error: 'Unable to read cart' })
  }
})

app.post('/api/cart', async (req, res) => {
  try {
    const item = req.body
    if (!item || !item.id) {
      return res.status(400).json({ error: 'Cart item must include an id' })
    }
    const cart = await readJson('cart.json')
    const exists = cart.find(i => i.id === item.id)
    if (!exists) {
      cart.push(item)
      await writeJson('cart.json', cart)
    }
    res.json(cart)
  } catch (err) {
    res.status(500).json({ error: 'Unable to add to cart' })
  }
})

app.delete('/api/cart/:id', async (req, res) => {
  try {
    const itemId = parseInt(req.params.id, 10)
    const cart = await readJson('cart.json')
    const updated = cart.filter(item => item.id !== itemId)
    await writeJson('cart.json', updated)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Unable to remove from cart' })
  }
})

app.post('/api/cart/clear', async (req, res) => {
  try {
    await writeJson('cart.json', [])
    res.json([])
  } catch (err) {
    res.status(500).json({ error: 'Unable to clear cart' })
  }
})

// WISHLIST
app.get('/api/wishlist', async (req, res) => {
  try {
    const wishlist = await readJson('wishlist.json')
    res.json(wishlist)
  } catch (err) {
    res.status(500).json({ error: 'Unable to read wishlist' })
  }
})

app.post('/api/wishlist', async (req, res) => {
  try {
    const item = req.body
    if (!item || !item.id) {
      return res.status(400).json({ error: 'Wishlist item must include an id' })
    }
    const wishlist = await readJson('wishlist.json')
    const exists = wishlist.find(i => i.id === item.id)
    if (!exists) {
      wishlist.push(item)
      await writeJson('wishlist.json', wishlist)
    }
    res.json(wishlist)
  } catch (err) {
    res.status(500).json({ error: 'Unable to add to wishlist' })
  }
})

app.delete('/api/wishlist/:id', async (req, res) => {
  try {
    const itemId = parseInt(req.params.id, 10)
    const wishlist = await readJson('wishlist.json')
    const updated = wishlist.filter(item => item.id !== itemId)
    await writeJson('wishlist.json', updated)
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Unable to remove from wishlist' })
  }
})

app.post('/api/wishlist/clear', async (req, res) => {
  try {
    await writeJson('wishlist.json', [])
    res.json([])
  } catch (err) {
    res.status(500).json({ error: 'Unable to clear wishlist' })
  }
})

// CHECKOUT
app.post('/api/checkout', async (req, res) => {
  try {
    const cart = await readJson('cart.json')
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0)

    // Simulate a simple order confirmation
    const order = {
      orderId: `ORD-${Date.now()}`,
      total,
      items: cart,
      purchasedAt: new Date().toISOString(),
    }

    // Persist order history
    const orders = await readJson('orders.json')
    orders.unshift(order)
    await writeJson('orders.json', orders)

    // Clear cart after checkout
    await writeJson('cart.json', [])

    res.json({ success: true, order })
  } catch (err) {
    res.status(500).json({ error: 'Checkout failed' })
  }
})

// ORDERS
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await readJson('orders.json')
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: 'Unable to read orders' })
  }
})

app.put('/api/orders/:orderId', requireAdmin, async (req, res) => {
  try {
    const orderId = req.params.orderId
    const updates = req.body || {}
    const orders = await readJson('orders.json')
    const idx = orders.findIndex(o => o.orderId === orderId)
    if (idx === -1) return res.status(404).json({ error: 'Order not found' })

    orders[idx] = { ...orders[idx], ...updates }
    await writeJson('orders.json', orders)
    res.json(orders[idx])
  } catch (err) {
    res.status(500).json({ error: 'Unable to update order' })
  }
})

// PRODUCTS
app.get('/api/products', async (req, res) => {
  try {
    const products = await readJson('products.json')
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Unable to read products' })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const products = await readJson('products.json')
    const product = products.find(p => p.id === id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: 'Unable to read product' })
  }
})

app.post('/api/products', requireAdmin, async (req, res) => {
  try {
    const product = req.body
    if (!product || !product.name) {
      return res.status(400).json({ error: 'Product must include a name' })
    }

    const products = await readJson('products.json')
    const nextId = Math.max(0, ...products.map(p => p.id || 0)) + 1
    const newProduct = { ...product, id: nextId }
    products.push(newProduct)
    await writeJson('products.json', products)
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({ error: 'Unable to create product' })
  }
})

app.put('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const updates = req.body || {}
    const products = await readJson('products.json')
    const idx = products.findIndex(p => p.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Product not found' })

    products[idx] = { ...products[idx], ...updates }
    await writeJson('products.json', products)
    res.json(products[idx])
  } catch (err) {
    res.status(500).json({ error: 'Unable to update product' })
  }
})

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const products = await readJson('products.json')
    const updated = products.filter(p => p.id !== id)
    await writeJson('products.json', updated)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Unable to delete product' })
  }
})

// Optional: Serve built frontend
const distPath = path.join(__dirname, '..', 'dist')
const hasBuiltFrontend = async () => {
  try {
    await fs.access(path.join(distPath, 'index.html'))
    return true
  } catch {
    return false
  }
}

const start = async () => {
  if (await hasBuiltFrontend()) {
    app.use(express.static(distPath))
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'))
    })
  }

  app.listen(PORT, HOST, () => {
    console.log(`CS2 Marketplace API running on http://localhost:${PORT}`)
    console.log(`CS2 Marketplace API available on your network at http://<your-pc-ip>:${PORT}`)
  })
}

start()
