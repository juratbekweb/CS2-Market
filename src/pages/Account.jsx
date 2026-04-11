import { useState } from 'react'
import ItemCard from '../components/ItemCard'
import { products } from '../data/products'
import { useWishlist } from '../context/WishlistContext'
import { getAvatarFallback, getSkinFallbackImage } from '../utils/imageFallback'

export default function Account() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const { wishlistItems } = useWishlist()

  const userInventory = products.slice(0, 12)

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.24em] text-orange-200/80">Player Hub</p>
          <h1 className="mt-2 text-4xl font-black">Account Center</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="rounded-[2rem] border border-white/10 bg-black/20 p-6 h-fit backdrop-blur-sm lg:sticky lg:top-24">
            <div className="text-center pb-6 border-b border-white/10 mb-6">
              <div className="w-24 h-24 rounded-full border border-orange-300/40 mx-auto mb-4 overflow-hidden shadow-[0_0_24px_rgba(255,170,0,0.18)]">
                <img
                  src="https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.target.onerror = null
                    event.target.src = getAvatarFallback('Trader_Pro_2024')
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">Trader_Pro_2024</h3>
              <p className="text-text-secondary text-sm">user@example.com</p>
              <div className="mt-4 rounded-[2rem] border border-orange-300/20 bg-gradient-to-br from-orange-300/10 via-black/30 to-black/40 p-4 shadow-[0_20px_60px_rgba(255,159,10,0.15)]">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-orange-200/70">Elite membership</p>
                    <p className="text-lg font-semibold">Premium Trader Pass</p>
                  </div>
                  <span className="rounded-full bg-black/80 px-3 py-1 text-[0.72rem] uppercase tracking-[0.16em] text-orange-100">Active</span>
                </div>
                <div className="grid gap-2 text-text-secondary text-sm">
                  <p>VIP support, discounted marketplace fees, priority trade matching.</p>
                  <p>Unlock daily market alerts, exclusive drops, and early sales access.</p>
                </div>
                <button className="mt-4 w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-sm font-semibold text-orange-100 transition-all hover:bg-white/15">
                  View Premium Benefits
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl font-bold text-accent-yellow">$12,450</div>
                    <div className="text-text-secondary text-xs">Balance</div>
                  </div>
                </div>
                <div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl font-bold text-orange-100">234</div>
                    <div className="text-text-secondary text-xs">Items</div>
                  </div>
                </div>
                <div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl font-bold text-orange-100">42</div>
                    <div className="text-text-secondary text-xs">Level</div>
                  </div>
                </div>
                <div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-2xl font-bold text-orange-100">98%</div>
                    <div className="text-text-secondary text-xs">Reputation</div>
                  </div>
                </div>
              </div>
            </div>
            <nav className="space-y-2">
              {[
                { id: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
                { id: 'inventory', icon: 'fa-box', label: 'My Inventory' },
                { id: 'wishlist', icon: 'fa-heart', label: 'Wishlist' },
                { id: 'purchases', icon: 'fa-shopping-bag', label: 'Purchases' },
                { id: 'sales', icon: 'fa-dollar-sign', label: 'Sales' },
                { id: 'trades', icon: 'fa-exchange-alt', label: 'Trades' },
                { id: 'settings', icon: 'fa-cog', label: 'Settings' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 text-black font-semibold'
                      : 'text-text-secondary hover:text-orange-100 hover:bg-white/5'
                  }`}
                >
                  <i className={`fas ${item.icon} w-5`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="rounded-[2rem] border border-white/10 bg-black/20 p-8 backdrop-blur-sm">
            {activeSection === 'dashboard' && (
              <div>
                <div className="mb-8 rounded-[2rem] border border-white/10 bg-black/20 p-8 backdrop-blur-sm">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-orange-200/80">Premium Dashboard</p>
                      <h2 className="mt-2 text-4xl font-black">Welcome back, Elite Trader</h2>
                      <p className="mt-3 max-w-2xl text-text-secondary">Monitor your portfolio, manage exclusive drops, and track your rewards in one elegant control center.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                        <div className="text-xs uppercase tracking-[0.24em] text-text-secondary">Premium Score</div>
                        <div className="mt-2 text-2xl font-bold text-accent-yellow">92</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                        <div className="text-xs uppercase tracking-[0.24em] text-text-secondary">Boosters</div>
                        <div className="mt-2 text-2xl font-bold text-orange-100">+18%</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                        <div className="text-xs uppercase tracking-[0.24em] text-text-secondary">Rewards</div>
                        <div className="mt-2 text-2xl font-bold text-orange-100">3 Slots</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] mb-8">
                  <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-orange-300/10 via-black/30 to-black/40 p-8 shadow-[0_40px_80px_rgba(255,159,10,0.12)]">
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-orange-200/70">Portfolio</p>
                        <h3 className="mt-2 text-2xl font-bold">Market Value</h3>
                      </div>
                      <span className="rounded-full bg-black/80 px-3 py-1 text-[0.72rem] uppercase tracking-[0.16em] text-orange-100">+12% this week</span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <p className="text-text-secondary text-sm">Total portfolio value</p>
                        <p className="mt-3 text-3xl font-bold text-accent-primary">$24,320</p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <p className="text-text-secondary text-sm">Premium fee reduction</p>
                        <p className="mt-3 text-3xl font-bold text-orange-100">42%</p>
                      </div>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {[
                        { label: 'Active bids', value: '6' },
                        { label: 'Live offers', value: '12' },
                        { label: 'Pending trades', value: '2' },
                      ].map((metric) => (
                        <div key={metric.label} className="rounded-3xl border border-white/10 bg-black/50 p-4">
                          <p className="text-sm text-text-secondary">{metric.label}</p>
                          <p className="mt-2 text-xl font-semibold">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: 'Premium Rewards', detail: 'Access exclusive drops and early sale notifications.', badge: 'Live' },
                      { title: 'Trade Insurance', detail: 'Instant protection for all high-value exchanges.', badge: 'Active' },
                    ].map((reward) => (
                      <div key={reward.title} className="rounded-[2rem] border border-white/10 bg-black/20 p-6">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div>
                            <h4 className="text-xl font-semibold">{reward.title}</h4>
                            <p className="text-text-secondary text-sm">{reward.detail}</p>
                          </div>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-orange-100">{reward.badge}</span>
                        </div>
                        <div className="rounded-3xl bg-white/5 p-4 text-text-secondary">
                          <p className="text-sm">Need help claiming your rewards? Visit the premium hub to manage offers and activate bonuses.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-bg-tertiary border border-border-color rounded-xl p-6 flex items-center gap-4">
                    <div className="text-3xl text-accent-primary">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div>
                      <div className="text-text-secondary text-sm">Total Spent</div>
                      <div className="text-2xl font-bold">$8,450.00</div>
                    </div>
                  </div>
                  <div className="bg-bg-tertiary border border-border-color rounded-xl p-6 flex items-center gap-4">
                    <div className="text-3xl text-accent-primary">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div>
                      <div className="text-text-secondary text-sm">Total Earned</div>
                      <div className="text-2xl font-bold">$4,200.00</div>
                    </div>
                  </div>
                  <div className="bg-bg-tertiary border border-border-color rounded-xl p-6 flex items-center gap-4">
                    <div className="text-3xl text-accent-primary">
                      <i className="fas fa-box"></i>
                    </div>
                    <div>
                      <div className="text-text-secondary text-sm">Items Owned</div>
                      <div className="text-2xl font-bold">234</div>
                    </div>
                  </div>
                  <div className="bg-bg-tertiary border border-border-color rounded-xl p-6 flex items-center gap-4">
                    <div className="text-3xl text-accent-primary">
                      <i className="fas fa-heart"></i>
                    </div>
                    <div>
                      <div className="text-text-secondary text-sm">Wishlist Items</div>
                      <div className="text-2xl font-bold">18</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { type: 'purchase', icon: 'fa-shopping-cart', item: 'AK-47 | Redline', amount: '-$125.50', time: '2 hours ago' },
                      { type: 'sale', icon: 'fa-dollar-sign', item: 'M4A4 | Howl', amount: '+$450.00', time: '1 day ago' },
                      { type: 'trade', icon: 'fa-exchange-alt', item: 'Trade completed', amount: '', time: '3 days ago' },
                      { type: 'purchase', icon: 'fa-shopping-cart', item: 'Karambit | Fade', amount: '-$2450.00', time: '5 days ago' },
                      { type: 'sale', icon: 'fa-dollar-sign', item: 'Glock-18 | Fade', amount: '+$380.00', time: '1 week ago' },
                    ].map((activity, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-300/10 text-orange-100">
                          <i className={`fas ${activity.icon}`}></i>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">
                            {activity.type === 'purchase' ? 'Purchased' : activity.type === 'sale' ? 'Sold' : 'Traded'}
                            {' '}
                            <strong>{activity.item}</strong>
                          </p>
                          <span className="text-text-secondary text-sm">{activity.time}</span>
                        </div>
                        {activity.amount && (
                          <div className={`font-bold text-lg ${activity.amount.startsWith('+') ? 'text-green-300' : 'text-orange-100'}`}>
                            {activity.amount}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'inventory' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold">My Inventory</h2>
                  <button className="px-6 py-3 bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 text-black rounded-2xl font-semibold transition-all">
                    List Item for Sale
                  </button>
                </div>
                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-text-primary"
                  />
                  <select className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-text-primary">
                    <option>All Items</option>
                    <option>Rifles</option>
                    <option>Pistols</option>
                    <option>Knives</option>
                    <option>Gloves</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userInventory.length > 0 ? (
                    userInventory.map((item) => <ItemCard key={item.id} item={item} />)
                  ) : (
                    <div className="col-span-full text-center py-12 text-text-secondary">
                      <p>No items in inventory</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'wishlist' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Wishlist</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.length > 0 ? (
                    wishlistItems.map((item) => <ItemCard key={item.id} item={item} />)
                  ) : (
                    <div className="col-span-full text-center py-12 text-text-secondary">
                      <p>No items in wishlist</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'purchases' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Purchase History</h2>
                <div className="space-y-4">
                  {products.slice(0, 8).map((item) => (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 flex items-center gap-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(event) => {
                          event.target.onerror = null
                          event.target.src = getSkinFallbackImage(item.name, 80, 80)
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{item.name}</h4>
                        <p className="text-text-secondary text-sm mb-1">{item.condition} • Float: {item.float}</p>
                        <span className="text-text-secondary text-sm">Purchased on March 15, 2024</span>
                      </div>
                      <div className="text-2xl font-bold text-accent-primary">${item.price.toFixed(2)}</div>
                      <button className="px-4 py-3 border border-white/10 rounded-2xl hover:border-orange-300/30 hover:text-orange-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'sales' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Sales History</h2>
                <div className="space-y-4">
                  {products.slice(8, 16).map((item) => (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6 flex items-center gap-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(event) => {
                          event.target.onerror = null
                          event.target.src = getSkinFallbackImage(item.name, 80, 80)
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{item.name}</h4>
                        <p className="text-text-secondary text-sm mb-1">{item.condition} • Float: {item.float}</p>
                        <span className="text-text-secondary text-sm">Sold on March 14, 2024</span>
                      </div>
                      <div className="text-2xl font-bold text-accent-primary">${item.price.toFixed(2)}</div>
                      <button className="px-4 py-3 border border-white/10 rounded-2xl hover:border-orange-300/30 hover:text-orange-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'trades' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold">Trade History</h2>
                  <button className="px-6 py-3 bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 text-black rounded-2xl font-semibold transition-all">
                    New Trade Offer
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6">
                    <div className="inline-block px-3 py-1 bg-orange-300/10 text-orange-100 border border-orange-300/20 rounded-full text-sm font-bold mb-4">
                      Completed
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                      <div className="flex-1">
                        <div className="text-text-secondary text-sm mb-2">You Gave:</div>
                        <div className="font-semibold">AK-47 | Redline</div>
                      </div>
                      <i className="fas fa-exchange-alt text-accent-tertiary text-2xl"></i>
                      <div className="flex-1">
                        <div className="text-text-secondary text-sm mb-2">You Received:</div>
                        <div className="font-semibold">M4A4 | Howl</div>
                      </div>
                    </div>
                    <span className="text-text-secondary text-sm">March 10, 2024</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6">
                    <div className="inline-block px-3 py-1 bg-rose-300/10 text-rose-200 border border-rose-300/20 rounded-full text-sm font-bold mb-4">
                      Completed
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                      <div className="flex-1">
                        <div className="text-text-secondary text-sm mb-2">You Gave:</div>
                        <div className="font-semibold">USP-S | Kill Confirmed</div>
                      </div>
                      <i className="fas fa-exchange-alt text-accent-tertiary text-2xl"></i>
                      <div className="flex-1">
                        <div className="text-text-secondary text-sm mb-2">You Received:</div>
                        <div className="font-semibold">Glock-18 | Fade</div>
                      </div>
                    </div>
                    <span className="text-text-secondary text-sm">February 28, 2024</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-6">
                    <div className="inline-block px-3 py-1 bg-sky-300/10 text-sky-200 border border-sky-300/20 rounded-full text-sm font-bold mb-4">
                      Pending
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                      <div className="flex-1">
                        <div className="text-text-secondary text-sm mb-2">You Offered:</div>
                        <div className="font-semibold">AWP | Asiimov</div>
                      </div>
                      <i className="fas fa-exchange-alt text-accent-tertiary text-2xl"></i>
                      <div className="flex-1">
                        <div className="text-text-secondary text-sm mb-2">They Want:</div>
                        <div className="font-semibold">Butterfly Knife | Fade</div>
                      </div>
                    </div>
                    <span className="text-text-secondary text-sm">Waiting for response</span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'settings' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Account Settings</h2>
                <div className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-text-secondary mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue="Trader_Pro_2024"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="user@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-2">Steam Profile</label>
                    <input
                      type="text"
                      placeholder="Steam ID or Profile URL"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-4">Notification Preferences</label>
                    <div className="space-y-3">
                      {['Email notifications', 'Trade offers', 'Price alerts'].map((pref, index) => (
                        <label key={index} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" defaultChecked={index < 2} className="w-4 h-4 accent-accent-primary" />
                          <span>{pref}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-200 text-black rounded-2xl font-semibold transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
