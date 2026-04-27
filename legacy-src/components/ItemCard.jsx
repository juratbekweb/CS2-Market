import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { getSkinFallbackImage } from '../utils/imageFallback'

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
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const fallbackImage = getSkinFallbackImage(item.name)

  const handleAddToCart = (event) => {
    event.preventDefault()
    event.stopPropagation()
    addToCart(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWishlistToggle = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist(item)
    }
  }

  return (
    <div
      className="premium-card-shell group rounded-[1.7rem] transition-all duration-500 hover:-translate-y-2 hover:border-accent-primary/60 hover:shadow-[0_25px_70px_rgb(var(--color-accent-primary)/0.18)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgb(var(--color-accent-yellow)/0.10),transparent_50%)] opacity-80"></div>

      <div className="premium-card-media relative flex aspect-[4/3] items-center justify-center overflow-hidden">
        <img
          src={item.image || fallbackImage}
          alt={item.name}
          width="400"
          height="300"
          className="premium-card-image relative z-[1] h-full w-full object-contain px-4 pb-3 pt-5 transition-transform duration-500 group-hover:scale-[1.08]"
          loading="lazy"
          onError={(event) => {
            event.target.onerror = null
            event.target.src = fallbackImage
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/24 to-transparent opacity-90"></div>
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
          <div className="theme-tag rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em] backdrop-blur-sm">
            Premium Drop
          </div>
          <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase shadow-lg backdrop-blur-sm ${rarityColors[item.rarity] || rarityColors.covert}`}>
            {item.rarity}
          </div>
        </div>
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="theme-strong-panel rounded-2xl p-4">
            <Link
              to={`/product/${item.id}`}
              className="theme-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition-transform hover:scale-105"
            >
              Quick View
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="premium-card-meta relative p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-snug text-text-primary">{item.name}</h3>
            <p className="mt-1 text-sm text-text-secondary">{item.description}</p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-text-secondary">
            {item.condition}
          </span>
          <span className="theme-tag rounded-full px-3 py-1.5">Float: {item.float}</span>
          <span className="theme-tag-alt rounded-full px-3 py-1.5">Pattern #{item.stats?.pattern ?? 'N/A'}</span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Marketplace Price</p>
            <span className="mt-1 block text-3xl font-black text-accent-yellow">${item.price.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleWishlistToggle}
              className={`rounded-xl border px-3 py-3 transition-all ${
                isInWishlist(item.id)
                  ? 'border-accent-secondary bg-accent-secondary text-bg-primary shadow-[0_0_20px_rgba(255,107,107,0.35)]'
                  : 'border-white/10 bg-white/5 text-accent-secondary hover:border-accent-secondary hover:bg-accent-secondary hover:text-bg-primary'
              }`}
            >
              <i className={`fa-heart ${isInWishlist(item.id) ? 'fas' : 'far'}`}></i>
            </button>
            <button
              onClick={handleAddToCart}
              className={`rounded-xl border px-3 py-3 transition-all ${
                added
                  ? 'border-accent-primary bg-accent-primary text-bg-primary shadow-[0_0_24px_rgb(var(--color-accent-primary)/0.35)]'
                  : 'border-accent-primary/30 bg-[linear-gradient(90deg,rgb(var(--color-accent-primary)/0.12),rgb(var(--color-accent-yellow)/0.1))] text-text-primary hover:border-accent-primary hover:bg-[linear-gradient(90deg,rgb(var(--color-accent-primary)),rgb(var(--color-accent-yellow)))] hover:text-bg-primary'
              }`}
            >
              <i className={`fas ${added ? 'fa-check' : 'fa-shopping-cart'}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
