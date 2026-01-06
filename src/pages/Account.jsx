import { useState } from 'react'
import ItemCard from '../components/ItemCard'
import { products } from '../data/products'

export default function Account() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isWishlisted, setIsWishlisted] = useState({})

  const userInventory = products.slice(0, 6)
  const wishlistItems = products.slice(0, 4)

  const toggleWishlist = (id) => {
    setIsWishlisted(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="bg-bg-secondary border border-border-color rounded-xl p-6 h-fit lg:sticky lg:top-24">
            <div className="text-center pb-6 border-b border-border-color mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-accent-primary mx-auto mb-4 overflow-hidden shadow-glow">
                <img src="https://via.placeholder.com/100/00ff88/000000?text=U" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Trader_Pro_2024</h3>
              <p className="text-text-secondary text-sm">user@example.com</p>
              <div className="flex justify-around mt-4">
                <div>
                  <div className="text-2xl font-bold text-accent-primary">$12,450</div>
                  <div className="text-text-secondary text-xs">Balance</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-primary">234</div>
                  <div className="text-text-secondary text-xs">Items</div>
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
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                    activeSection === item.id
                      ? 'bg-bg-tertiary text-accent-primary'
                      : 'text-text-secondary hover:text-accent-primary hover:bg-bg-tertiary'
                  }`}
                >
                  <i className={`fas ${item.icon} w-5`}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="bg-bg-secondary border border-border-color rounded-xl p-8">
            {/* Dashboard */}
            {activeSection === 'dashboard' && (
              <div>
                <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
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
                      { type: 'purchase', icon: 'fa-shopping-cart', item: 'AK-47 | Redline', amount: '-$125.50', time: '2 hours ago', color: 'accent-primary' },
                      { type: 'sale', icon: 'fa-dollar-sign', item: 'M4A4 | Howl', amount: '+$450.00', time: '1 day ago', color: 'accent-secondary' },
                      { type: 'trade', icon: 'fa-exchange-alt', item: 'Trade completed', amount: '', time: '3 days ago', color: 'accent-tertiary' },
                    ].map((activity, index) => (
                      <div key={index} className="bg-bg-tertiary border border-border-color rounded-xl p-6 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${activity.color}/20 text-${activity.color}`}>
                          <i className={`fas ${activity.icon}`}></i>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{activity.type === 'purchase' ? 'Purchased' : activity.type === 'sale' ? 'Sold' : ''} <strong>{activity.item}</strong></p>
                          <span className="text-text-secondary text-sm">{activity.time}</span>
                        </div>
                        {activity.amount && (
                          <div className={`font-bold text-lg ${activity.amount.startsWith('+') ? 'text-accent-primary' : ''}`}>
                            {activity.amount}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Inventory */}
            {activeSection === 'inventory' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold">My Inventory</h2>
                  <button className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-tertiary text-bg-primary rounded-md font-semibold hover:shadow-glow-strong transition-all">
                    List Item for Sale
                  </button>
                </div>
                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    className="flex-1 px-4 py-2 bg-bg-tertiary border border-border-color rounded-md text-text-primary"
                  />
                  <select className="px-4 py-2 bg-bg-tertiary border border-border-color rounded-md text-text-primary">
                    <option>All Items</option>
                    <option>Rifles</option>
                    <option>Pistols</option>
                    <option>Knives</option>
                    <option>Gloves</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userInventory.length > 0 ? (
                    userInventory.map(item => (
                      <ItemCard key={item.id} item={item} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-text-secondary">
                      <p>No items in inventory</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wishlist */}
            {activeSection === 'wishlist' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Wishlist</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.length > 0 ? (
                    wishlistItems.map(item => (
                      <div key={item.id} className="relative">
                        <ItemCard item={item} />
                        <button
                          onClick={() => toggleWishlist(item.id)}
                          className="absolute top-4 right-4 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-accent-secondary hover:bg-accent-secondary hover:text-bg-primary transition-all z-10"
                        >
                          <i className={`fas ${isWishlisted[item.id] ? 'fa-heart' : 'far fa-heart'}`}></i>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-text-secondary">
                      <p>No items in wishlist</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Purchases */}
            {activeSection === 'purchases' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Purchase History</h2>
                <div className="space-y-4">
                  {products.slice(0, 5).map(item => (
                    <div key={item.id} className="bg-bg-tertiary border border-border-color rounded-xl p-6 flex items-center gap-6">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/80/1a1a2e/00ff88?text=${encodeURIComponent(item.name.substring(0, 10))}`;
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{item.name}</h4>
                        <p className="text-text-secondary text-sm mb-1">{item.condition} • Float: {item.float}</p>
                        <span className="text-text-secondary text-sm">Purchased on March 15, 2024</span>
                      </div>
                      <div className="text-2xl font-bold text-accent-primary">${item.price.toFixed(2)}</div>
                      <button className="px-4 py-2 border border-border-color rounded-md hover:border-accent-primary hover:text-accent-primary transition-colors">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sales */}
            {activeSection === 'sales' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Sales History</h2>
                <div className="space-y-4">
                  {products.slice(5, 10).map(item => (
                    <div key={item.id} className="bg-bg-tertiary border border-border-color rounded-xl p-6 flex items-center gap-6">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/80/1a1a2e/00ff88?text=${encodeURIComponent(item.name.substring(0, 10))}`;
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{item.name}</h4>
                        <p className="text-text-secondary text-sm mb-1">{item.condition} • Float: {item.float}</p>
                        <span className="text-text-secondary text-sm">Sold on March 14, 2024</span>
                      </div>
                      <div className="text-2xl font-bold text-accent-primary">${item.price.toFixed(2)}</div>
                      <button className="px-4 py-2 border border-border-color rounded-md hover:border-accent-primary hover:text-accent-primary transition-colors">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trades */}
            {activeSection === 'trades' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold">Trade History</h2>
                  <button className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-tertiary text-bg-primary rounded-md font-semibold hover:shadow-glow-strong transition-all">
                    New Trade Offer
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-bg-tertiary border border-border-color rounded-xl p-6">
                    <div className="inline-block px-3 py-1 bg-accent-primary/20 text-accent-primary rounded text-sm font-bold mb-4">
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
                </div>
              </div>
            )}

            {/* Settings */}
            {activeSection === 'settings' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Account Settings</h2>
                <div className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-text-secondary mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue="Trader_Pro_2024"
                      className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-md text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="user@example.com"
                      className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-md text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-text-secondary mb-2">Steam Profile</label>
                    <input
                      type="text"
                      placeholder="Steam ID or Profile URL"
                      className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-md text-text-primary"
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
                  <button className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-tertiary text-bg-primary rounded-md font-semibold hover:shadow-glow-strong transition-all">
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

