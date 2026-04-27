import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ItemCard from '../components/ItemCard'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useProduct } from '../hooks/useProduct'
import { useProducts } from '../hooks/useProducts'
import { getSkinFallbackImage } from '../utils/imageFallback'

const rarityColors = {
  consumer: 'bg-gray-400 text-black',
  industrial: 'bg-blue-500 text-white',
  milspec: 'bg-blue-600 text-white',
  restricted: 'bg-purple-600 text-white',
  classified: 'bg-pink-600 text-white',
  covert: 'bg-red-500 text-white',
}

function buildOrderBook(price) {
  return [0.82, 0.8, 0.43, 0.01, 0.008].map((ratio, index) => ({
    id: index,
    price: Math.max(1, price * ratio),
    quantity: 1,
  }))
}

function formatFloat(value) {
  return Number(value || 0).toFixed(10)
}

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  const productId = parseInt(id, 10)
  const { product, loading } = useProduct(productId)
  const { products: allProducts } = useProducts()

  const relatedProducts = useMemo(
    () => allProducts.filter((item) => item.category === product?.category && item.id !== product?.id).slice(0, 6),
    [allProducts, product],
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="glass-panel rounded-[2rem] p-8">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[300px_1fr_280px]">
            <div className="loading-shimmer h-[640px] rounded-[1.75rem]"></div>
            <div className="loading-shimmer h-[640px] rounded-[1.75rem]"></div>
            <div className="loading-shimmer h-[640px] rounded-[1.75rem]"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold">Product Not Found</h1>
        <Link to="/products" className="text-accent-primary hover:underline">Back to Products</Link>
      </div>
    )
  }

  const primaryImage = product.image || getSkinFallbackImage(product.name, 900, 700)
  const gallery = [primaryImage, ...(product.gallery || [])].filter(Boolean)
  const images = gallery.length > 0 ? gallery : [primaryImage]
  const selectedVisual = images[selectedImage] || primaryImage
  const floatValue = product.stats?.float ?? product.float ?? 0
  const pattern = product.stats?.pattern ?? 611
  const orderBook = buildOrderBook(product.price)
  const marketListings = relatedProducts.slice(0, 2)
  const watcherCount = 47
  const sideWatchers = [7, 13]
  const paintSeed = product.stats?.pattern ?? 14
  const similarity = 100
  const etaMinutes = 1

  const handleAddToCart = () => {
    addToCart(product)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
          <Link to="/" className="hover:text-accent-primary">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-accent-primary">Browse</Link>
          <span>/</span>
          <span className="text-text-primary">{product.name}</span>
        </div>

        <div className="premium-detail-shell rounded-[2rem] p-5 xl:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgb(var(--color-accent-primary)/0.12),transparent_22%),radial-gradient(circle_at_90%_20%,rgb(var(--color-accent-yellow)/0.1),transparent_20%),linear-gradient(180deg,rgb(var(--color-bg-secondary)/0.45),transparent_38%)]"></div>

          <div className="relative grid grid-cols-1 gap-6 xl:grid-cols-[300px_1fr_280px]">
            <aside className="premium-detail-panel rounded-[1.8rem] p-5">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-[1.75rem] leading-9 text-text-secondary">
                  {product.description || 'This item has a premium finish and collector-grade appeal.'}
                </p>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-[rgb(var(--color-bg-tertiary)/0.5)] p-5">
                <div className="flex items-center justify-between text-accent-primary">
                  <span className="flex items-center gap-3 text-4xl">
                    <i className="fas fa-shield-halved"></i>
                    <i className="far fa-clock text-3xl"></i>
                  </span>
                  <div className="text-right">
                    <div className="text-4xl font-black">{etaMinutes} min</div>
                    <div className="text-xl font-semibold">{similarity}%</div>
                    <div className="text-sm uppercase tracking-[0.18em] text-accent-primary/80">(15)</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="rounded-2xl border border-accent-primary/25 bg-accent-primary/10 px-4 py-4 text-lg font-semibold text-text-primary transition hover:bg-accent-primary/15">
                  <i className="fas fa-link mr-2 text-accent-primary"></i>
                  Similar
                </button>
                <button className="rounded-2xl border border-accent-primary/25 bg-accent-primary/10 px-4 py-4 text-lg font-semibold text-text-primary transition hover:bg-accent-primary/15">
                  <i className="fas fa-database mr-2 text-accent-primary"></i>
                  FloatDB
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-lg font-semibold text-text-primary transition hover:border-accent-primary/35 hover:text-accent-primary">
                  Buy Orders
                </button>
                <button className="rounded-2xl border border-accent-primary/35 bg-accent-primary/12 px-4 py-4 text-lg font-semibold text-accent-primary transition hover:bg-accent-primary/18">
                  <i className="far fa-square-plus mr-2"></i>
                  Create
                </button>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="mb-4 grid grid-cols-[1fr_88px] gap-4 border-b border-white/8 pb-4 text-xl font-semibold text-text-secondary">
                  <span>Price</span>
                  <span>Quantity</span>
                </div>
                <div className="space-y-2">
                  {orderBook.map((entry) => (
                    <div key={entry.id} className="grid grid-cols-[1fr_88px] gap-4 rounded-2xl px-3 py-3 text-xl font-semibold text-text-primary">
                      <span>${entry.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span>{entry.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <section className="premium-detail-panel rounded-[1.8rem] p-4">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-black text-text-primary">{product.name}</h1>
                  <p className="mt-2 text-2xl font-semibold text-text-secondary">{product.condition}</p>
                </div>
                <div className="rounded-full border border-accent-primary/25 bg-accent-primary/8 px-4 py-2 text-xl text-text-secondary">
                  <i className="far fa-eye mr-2 text-accent-primary"></i>
                  {watcherCount}
                </div>
              </div>

              <div className="premium-detail-media rounded-[1.6rem] border border-white/10 p-4">
                <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-[1.2rem]">
                  <img
                    src={selectedVisual}
                    alt={product.name}
                    className="max-h-[520px] w-full object-contain drop-shadow-[0_24px_24px_rgba(0,0,0,0.45)]"
                    loading="lazy"
                    onError={(event) => {
                      event.target.onerror = null
                      event.target.src = primaryImage
                    }}
                  />

                  <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-3">
                    {['fa-eye', 'fa-camera', 'fa-magnifying-glass-plus'].map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-primary/25 bg-bg-primary/55 text-2xl text-accent-primary transition hover:bg-accent-primary/12"
                      >
                        <i className={`fas ${icon}`}></i>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-accent-yellow/40 pt-4">
                  <div className="flex flex-wrap gap-3">
                    {images.slice(0, 3).map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`overflow-hidden rounded-2xl border p-1 transition ${selectedImage === index ? 'border-accent-primary bg-accent-primary/12' : 'border-white/10 bg-white/5'}`}
                      >
                        <div className="premium-showcase-media h-16 w-20 rounded-xl">
                          <img
                            src={image}
                            alt={`${product.name} view ${index + 1}`}
                            className="h-full w-full object-contain p-1"
                            onError={(event) => {
                              event.target.onerror = null
                              event.target.src = primaryImage
                            }}
                          />
                        </div>
                      </button>
                    ))}
                    <div className="theme-tag-alt rounded-2xl px-3 py-2 text-lg font-semibold">71%</div>
                    <div className="theme-tag rounded-2xl px-3 py-2 text-lg font-semibold">14%</div>
                  </div>

                  <div className="flex min-w-[280px] flex-1 flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Market Price</p>
                        <div className="mt-1 text-5xl font-black text-text-primary">
                          ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xl font-bold text-text-secondary">
                        <i className="fas fa-minus mr-2 text-accent-primary"></i>
                        5.6%
                      </div>
                    </div>

                    <div className="h-4 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[71%] rounded-full bg-[linear-gradient(90deg,rgb(var(--color-accent-primary)),rgb(var(--color-accent-yellow)))]"></div>
                    </div>

                    <div className="flex items-center justify-between text-2xl">
                      <span className="font-semibold text-text-primary">{formatFloat(floatValue)}</span>
                      <span className="font-semibold text-text-primary">{paintSeed}</span>
                    </div>

                    <div className="flex items-center gap-3 text-2xl text-text-secondary">
                      <span className="inline-flex h-4 w-4 rounded-full bg-white/40"></span>
                      Offline
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-3">
                      <button
                        onClick={handleAddToCart}
                        className="theme-button-primary col-span-2 rounded-2xl px-5 py-4 text-xl font-semibold transition hover:-translate-y-1"
                      >
                        <i className={`fas ${addedToCart ? 'fa-check' : 'fa-cart-shopping'} mr-3`}></i>
                        {addedToCart ? 'Added' : 'Buy Now'}
                      </button>
                      <button
                        onClick={() => {
                          if (isInWishlist(product.id)) {
                            removeFromWishlist(product.id)
                          } else {
                            addToWishlist(product)
                          }
                        }}
                        className="theme-button-secondary rounded-2xl px-5 py-4 text-xl font-semibold"
                      >
                        <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-4">
              {[product, ...marketListings].slice(0, 3).map((item, index) => {
                const listingImage = item.image || getSkinFallbackImage(item.name, 320, 240)
                const listingFloat = item.stats?.float ?? item.float ?? 0
                const listingPattern = item.stats?.pattern ?? pattern
                const watchValue = sideWatchers[index] ?? sideWatchers[sideWatchers.length - 1]

                return (
                  <div key={`${item.id}-${index}`} className="premium-detail-panel rounded-[1.8rem] p-3">
                    <div className="mb-3 flex items-start justify-between gap-3 px-2 pt-1">
                      <div>
                        <div className="text-xl font-bold text-text-primary">{item.name}</div>
                        <div className="mt-1 text-lg text-text-secondary">{item.condition}</div>
                      </div>
                      <div className="rounded-full border border-accent-primary/25 bg-accent-primary/8 px-3 py-1.5 text-lg text-text-secondary">
                        <i className="far fa-eye mr-2 text-accent-primary"></i>
                        {watchValue}
                      </div>
                    </div>

                    <div className="premium-detail-media rounded-[1.4rem]">
                      <img
                        src={listingImage}
                        alt={item.name}
                        className="h-64 w-full object-contain p-4 drop-shadow-[0_18px_18px_rgba(0,0,0,0.4)]"
                        onError={(event) => {
                          event.target.onerror = null
                          event.target.src = getSkinFallbackImage(item.name, 320, 240)
                        }}
                      />
                      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col gap-2">
                        {['fa-camera', 'fa-magnifying-glass-plus'].map((icon) => (
                          <button
                            key={`${item.id}-${icon}`}
                            type="button"
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent-primary/25 bg-bg-primary/55 text-xl text-accent-primary"
                          >
                            <i className={`fas ${icon}`}></i>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 border-t border-accent-yellow/40 pt-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-3xl font-black text-text-primary">
                          ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-lg font-bold text-text-secondary">
                          <i className="fas fa-minus mr-2 text-accent-primary"></i>
                          {index === 0 ? '1.6%' : '1.4%'}
                        </div>
                      </div>
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-[58%] rounded-full bg-[linear-gradient(90deg,rgb(var(--color-accent-primary)),rgb(var(--color-accent-yellow)))]"></div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-lg text-text-primary">
                        <span>{formatFloat(listingFloat)}</span>
                        <span>{listingPattern}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-lg text-text-secondary">
                        <span className="inline-flex h-3.5 w-3.5 rounded-full bg-white/40"></span>
                        Offline
                      </div>
                    </div>
                  </div>
                )
              })}
            </aside>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-12 text-center text-4xl font-bold">
              <span className="text-accent-primary text-glow">Related</span> Items
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
