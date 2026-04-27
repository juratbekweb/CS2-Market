import { createContext, useContext, useState, useEffect } from 'react'
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist, clearWishlist as apiClearWishlist } from '../services/api'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const wishlist = await getWishlist()
        setWishlistItems(wishlist)
        setWishlistCount(wishlist.length)
      } catch {
        const savedWishlist = localStorage.getItem('wishlistItems')
        if (savedWishlist) {
          const items = JSON.parse(savedWishlist)
          const normalizedItems = Array.isArray(items) ? items : []
          setWishlistItems(normalizedItems)
          setWishlistCount(normalizedItems.length)
        }
      }
    }

    loadWishlist()
  }, [])

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = (item) => {
    setWishlistItems(prev => {
      const exists = prev.find(wishlistItem => wishlistItem.id === item.id)
      if (!exists) {
        const newItems = [...prev, item]
        setWishlistCount(newItems.length)

        apiAddToWishlist(item).catch(() => {
          /* ignore */
        })

        return newItems
      }
      return prev
    })
  }

  const removeFromWishlist = (itemId) => {
    setWishlistItems(prev => {
      const newItems = prev.filter(item => item.id !== itemId)
      setWishlistCount(newItems.length)

      apiRemoveFromWishlist(itemId).catch(() => {
        /* ignore */
      })

      return newItems
    })
  }

  const isInWishlist = (itemId) => {
    return Array.isArray(wishlistItems) && wishlistItems.some(item => item.id === itemId)
  }

  const clearWishlist = () => {
    setWishlistItems([])
    setWishlistCount(0)

    apiClearWishlist().catch(() => {
      /* ignore */
    })
  }

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      wishlistCount, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist, 
      clearWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}