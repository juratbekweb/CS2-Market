import { Link } from 'react-router-dom'
import ItemCard from '../components/ItemCard'
import { products, categories } from '../data/products'

export default function Home() {
  const featuredItems = products.slice(0, 4)

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-tertiary"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,136,0.1),transparent_70%)] animate-spin-slow" style={{ animationDuration: '20s' }}></div>
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center py-16">
          <h1 className="text-6xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-accent-primary to-accent-tertiary bg-clip-text text-transparent animate-glow">
              Premium CS2 Skins
            </span>
            <span className="block text-2xl md:text-3xl text-text-secondary font-light mt-2">
              Trade, Buy & Collect Rare Items
            </span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Discover the most exclusive weapon skins, knives, and gloves from Counter-Strike 2
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/products" 
              className="px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-tertiary text-bg-primary rounded-md font-semibold hover:shadow-glow-strong transition-all hover:-translate-y-1"
            >
              Browse Collection
            </Link>
            <Link 
              to="/account" 
              className="px-8 py-4 border-2 border-accent-primary text-accent-primary rounded-md font-semibold hover:bg-accent-primary hover:text-bg-primary transition-all"
            >
              Start Trading
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="text-center">
              <span className="block text-4xl font-bold text-accent-primary text-glow">50K+</span>
              <span className="block text-text-secondary text-sm mt-2">Active Items</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-bold text-accent-primary text-glow">25K+</span>
              <span className="block text-text-secondary text-sm mt-2">Active Traders</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-bold text-accent-primary text-glow">$2M+</span>
              <span className="block text-text-secondary text-sm mt-2">Monthly Volume</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-accent-primary text-glow">Featured</span> Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-accent-primary text-glow">Browse</span> by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="bg-bg-secondary border border-border-color rounded-xl p-6 text-center transition-all hover:-translate-y-1 hover:border-accent-primary hover:shadow-glow"
              >
                <div className="text-5xl text-accent-primary mb-4">
                  <i className={`fas ${category.icon}`}></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-text-secondary text-sm">{category.count.toLocaleString()} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

