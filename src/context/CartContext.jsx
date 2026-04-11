import { createContext, useContext, useState, useEffect } from 'react'
import {
  getCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
  checkoutCart,
  getOrders,
} from '../services/api'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [orders, setOrders] = useState([])
  const [lastOrder, setLastOrder] = useState(null)

  useEffect(() => {
    const loadCartAndOrders = async () => {
      try {
        const cart = await getCart()
        setCartItems(cart)
        setCartCount(cart.length)
      } catch {
        const savedCart = localStorage.getItem('cartItems')
        if (savedCart) {
          const items = JSON.parse(savedCart)
          setCartItems(items)
          setCartCount(items.length)
        }
      }

      try {
        const fetchedOrders = await getOrders()
        setOrders(fetchedOrders)
      } catch {
        // ignore
      }
    }

    loadCartAndOrders()
  }, [])

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item) => {
    setCartItems((prev) => {
      const newItems = [...prev, item]
      setCartCount(newItems.length)

      apiAddToCart(item).catch(() => {
        /* ignore */
      })

      return newItems
    })
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const newItems = prev.filter((item) => item.id !== itemId)
      setCartCount(newItems.length)

      apiRemoveFromCart(itemId).catch(() => {
        /* ignore */
      })

      return newItems
    })
  }

  const clearCart = () => {
    setCartItems([])
    setCartCount(0)

    apiClearCart().catch(() => {
      /* ignore */
    })
  }

  const refreshOrders = async () => {
    try {
      const fetchedOrders = await getOrders()
      setOrders(fetchedOrders)
    } catch {
      // ignore
    }
  }

  const checkout = async () => {
    const response = await checkoutCart()
    setCartItems([])
    setCartCount(0)
    localStorage.removeItem('cartItems')

    if (response?.order) {
      setLastOrder(response.order)
      setOrders((prev) => [response.order, ...prev])
    }

    return response
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
        orders,
        lastOrder,
        refreshOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
