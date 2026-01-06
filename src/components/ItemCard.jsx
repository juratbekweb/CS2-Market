import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

const rarityColors = {
  consumer: 'bg-gray-400 text-black',
  industrial: 'bg-blue-500 text-white',
  milspec: 'bg-blue-600 text-white',
  restricted: 'bg-purple-600 text-white',
  classified: 'bg-pink-600 text-white',
  covert: 'bg-red-500 text-white',
}

export default function ItemCard({ item }) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1000)
  }

  return (
    <div 
      className="bg-bg-secondary border border-border-color rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:border-accent-primary hover:shadow-glow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-bg-tertiary aspect-[4/3] overflow-hidden flex items-center justify-center">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
          onError={(e) => {
            // Fallback to a placeholder with skin name
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = `https://via.placeholder.com/400x300/1a1a2e/00ff88?text=${encodeURIComponent(item.name)}`;
          }}
        />
        <div className={`absolute top-2 right-2 px-3 py-1 rounded text-xs font-bold uppercase ${rarityColors[item.rarity] || rarityColors.covert}`}>
          {item.rarity}
        </div>
        <div className={`absolute inset-0 bg-black/80 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Link 
            to={`/product/${item.id}`}
            className="px-5 py-2.5 bg-accent-primary text-bg-primary rounded-md font-semibold hover:scale-105 transition-transform"
          >
            Quick View
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        <div className="flex gap-4 text-sm text-text-secondary mb-4">
          <span>{item.condition}</span>
          <span>Float: {item.float}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-accent-primary">${item.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className={`p-2 rounded-md transition-all ${
              added 
                ? 'bg-accent-primary text-bg-primary' 
                : 'bg-bg-tertiary border border-border-color text-accent-primary hover:bg-accent-primary hover:text-bg-primary'
            }`}
          >
            <i className={`fas ${added ? 'fa-check' : 'fa-shopping-cart'}`}></i>
          </button>
        </div>
      </div>
    </div>
  )
}

