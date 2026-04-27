import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CartProvider } from './context/CartContext'
import { PreferencesProvider } from './context/PreferencesContext'
import { WishlistProvider } from './context/WishlistContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Account from './pages/Account'
import Cart from './pages/Cart'
import OrderHistory from './pages/OrderHistory'
import Admin from './pages/Admin'

function RouteMetadata() {
  const location = useLocation()

  useEffect(() => {
    const titleMap = {
      '/': 'CS2 Marketplace - Premium Skin Trading',
      '/products': 'Browse CS2 Skins - CS2 Marketplace',
      '/cart': 'Your Cart - CS2 Marketplace',
      '/orders': 'Order History - CS2 Marketplace',
      '/account': 'Account Center - CS2 Marketplace',
      '/admin': 'Admin Dashboard - CS2 Marketplace',
    }

    const exactTitle = titleMap[location.pathname]
    const isProductDetail = location.pathname.startsWith('/product/')

    document.title = isProductDetail
      ? 'Product Details - CS2 Marketplace'
      : exactTitle || 'CS2 Marketplace'
  }, [location.pathname])

  return null
}

function App() {
  return (
    <PreferencesProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <div className="app-shell min-h-screen flex flex-col">
              <RouteMetadata />
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </PreferencesProvider>
  )
}

export default App

