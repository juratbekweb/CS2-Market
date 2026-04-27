import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getSkinFallbackImage } from '../utils/imageFallback'

export default function OrderHistory() {
  const { orders, lastOrder, refreshOrders } = useCart()
  const location = useLocation()
  const orderId = location.state?.orderId || lastOrder?.orderId

  useEffect(() => {
    refreshOrders()
  }, [refreshOrders])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-200/80">Transactions</p>
        <h1 className="mt-2 text-4xl font-black">Order History</h1>
      </div>

      {orderId && (
        <div className="mb-6 rounded-[2rem] border border-green-400/20 bg-green-400/10 p-5 text-green-100 backdrop-blur-sm">
          <p className="font-semibold">Order confirmed!</p>
          <p className="mt-1">
            Your order <span className="font-mono">{orderId}</span> is on its way.
          </p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-black/20 p-10 text-center backdrop-blur-sm">
          <p className="text-text-secondary">
            No orders yet. <Link to="/products" className="text-orange-100 underline">Browse products</Link> and checkout to create your first order.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.orderId} className="rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Order {order.orderId}</h2>
                  <p className="text-sm text-text-secondary">Placed on {new Date(order.purchasedAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-orange-100">
                    {order.status || 'created'}
                  </span>
                  <div className="text-2xl font-black text-accent-yellow">${order.total?.toFixed(2)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <img
                    src={item.image || getSkinFallbackImage(item.name, 80, 80)}
                    alt={item.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                    loading="lazy"
                    onError={(event) => {
                      event.target.onerror = null
                      event.target.src = getSkinFallbackImage(item.name, 80, 80)
                    }}
                  />
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className="mt-1 text-sm text-text-secondary">{item.condition} • Float: {item.float}</div>
                    </div>
                    <div className="font-semibold text-orange-100">${item.price?.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
