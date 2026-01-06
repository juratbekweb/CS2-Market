import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)

  const addToCart = (item) => {
    setCartItems(prev => {
      const newItems = [...prev, item]
      setCartCount(newItems.length)
      return newItems
    })
  }

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => item.id !== itemId)
      setCartCount(newItems.length)
      return newItems
    })
  }

  const clearCart = () => {
    setCartItems([])
    setCartCount(0)
  }

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, clearCart }}>
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

