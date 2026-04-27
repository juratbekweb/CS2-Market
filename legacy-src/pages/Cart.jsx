import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getSkinFallbackImage } from '../utils/imageFallback'

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, checkout } = useCart()
  const navigate = useNavigate()

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0)

  const getItemImage = (item) => item.image || getSkinFallbackImage(item.name, 160, 120)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-orange-200/80">Secure Checkout</p>
          <h1 className="mt-2 text-4xl font-black">Shopping Cart</h1>
          <p className="mt-2 text-text-secondary">Premium skinlaringizni tekshirib, buyurtmani yakunlang.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 backdrop-blur-sm">
          <div className="text-sm text-text-secondary">Items in cart</div>
          <div className="text-3xl font-black text-accent-yellow">{cartItems.length}</div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-black/20 p-10 text-center backdrop-blur-sm">
          <p className="text-lg text-text-secondary">Your cart is empty. Browse the products to add items.</p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 px-6 py-3 font-semibold text-black"
          >
            Browse Products
            <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/20 p-5 backdrop-blur-sm md:flex-row md:items-center"
              >
                <img
                  src={getItemImage(item)}
                  alt={item.name}
                  className="h-28 w-full rounded-[1.5rem] object-cover md:w-32"
                  loading="lazy"
                  onError={(event) => {
                    event.target.onerror = null
                    event.target.src = getSkinFallbackImage(item.name, 160, 120)
                  }}
                />
                <div className="flex-1">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{item.name}</h2>
                      <p className="mt-2 text-sm text-text-secondary">{item.condition} • Float: {item.float}</p>
                      <div className="mt-3 inline-flex rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-orange-100">
                        Ready to ship
                      </div>
                    </div>
                    <div className="text-3xl font-black text-accent-yellow">${item.price?.toFixed(2)}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="rounded-2xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 font-semibold text-rose-200 transition-all hover:bg-rose-300 hover:text-black"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-[2rem] border border-orange-300/15 bg-black/25 p-6 backdrop-blur-sm lg:sticky lg:top-24">
            <h2 className="text-2xl font-black">Order Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-text-secondary">Items</span>
                <span className="font-semibold">{cartItems.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-text-secondary">Marketplace fee</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-orange-300/20 bg-orange-300/10 px-4 py-4">
                <span className="text-lg font-semibold text-orange-100">Total</span>
                <span className="text-3xl font-black text-accent-yellow">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <button
                onClick={async () => {
                  try {
                    const result = await checkout()
                    const orderId = result.order?.orderId
                    navigate('/orders', { state: { orderId } })
                  } catch {
                    alert('Checkout failed. Please try again.')
                  }
                }}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 px-4 py-4 font-semibold text-black transition-all hover:-translate-y-1"
              >
                Checkout Now
                <span>→</span>
              </button>
              <button
                onClick={() => {
                  clearCart()
                  navigate('/')
                }}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 font-semibold text-white transition-all hover:border-orange-300/30 hover:bg-orange-300/10"
              >
                Clear Cart
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
