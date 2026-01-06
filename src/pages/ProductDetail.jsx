import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { products } from '../data/products'
import ItemCard from '../components/ItemCard'

const rarityColors = {
  consumer: 'bg-gray-400 text-black',
  industrial: 'bg-blue-500 text-white',
  milspec: 'bg-blue-600 text-white',
  restricted: 'bg-purple-600 text-white',
  classified: 'bg-pink-600 text-white',
  covert: 'bg-red-500 text-white',
}

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState('description')
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const product = products.find(p => p.id === parseInt(id))
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <Link to="/products" className="text-accent-primary hover:underline">Back to Products</Link>
      </div>
    )
  }

  // Generate multiple view angles for the product
  const images = [
    product.image,
    product.image.replace(encodeURIComponent(product.name), encodeURIComponent(product.name + ' Side')),
    product.image.replace(encodeURIComponent(product.name), encodeURIComponent(product.name + ' Back')),
    product.image.replace(encodeURIComponent(product.name), encodeURIComponent(product.name + ' Inspect')),
  ]

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4 text-text-secondary">
          <Link to="/" className="hover:text-accent-primary">Home</Link> / <Link to="/products" className="hover:text-accent-primary">Browse</Link> / <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="relative bg-bg-secondary border border-border-color rounded-xl overflow-hidden aspect-[4/3] mb-4 flex items-center justify-center">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/600x450/1a1a2e/00ff88?text=${encodeURIComponent(product.name)}`;
                }}
              />
              <div className="absolute top-4 right-4 p-2 bg-black/70 rounded-md cursor-pointer text-accent-primary">
                <i className="fas fa-search-plus"></i>
              </div>
            </div>
            <div className="flex gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-24 h-16 border-2 rounded-md overflow-hidden transition-all ${
                    selectedImage === index
                      ? 'border-accent-primary shadow-glow'
                      : 'border-border-color hover:border-accent-primary/50'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`View ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/150x100/1a1a2e/00ff88?text=View+${index + 1}`;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded text-sm font-bold uppercase ${rarityColors[product.rarity]}`}>
                  {product.rarity}
                </span>
                <span className="text-text-secondary">{product.condition}</span>
              </div>
            </div>

            <div className="bg-bg-secondary border border-border-color rounded-xl p-6 mb-6">
              <div className="mb-4">
                <span className="text-text-secondary text-sm">Current Price</span>
                <div className="text-5xl font-bold text-accent-primary text-glow">${product.price.toFixed(2)}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-primary font-semibold">+$5.20 (24h)</span>
                <a href="#" className="text-accent-tertiary text-sm hover:underline">
                  View Price History <i className="fas fa-chart-line"></i>
                </a>
              </div>
            </div>

            <div className="bg-bg-secondary border border-border-color rounded-xl p-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border-color">
                  <span className="text-text-secondary">Float Value:</span>
                  <span className="font-semibold">{product.stats.float.toFixed(8)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border-color">
                  <span className="text-text-secondary">Pattern:</span>
                  <span className="font-semibold">{product.stats.pattern}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border-color">
                  <span className="text-text-secondary">Stickers:</span>
                  <span className="font-semibold">{product.stats.stickers}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border-color">
                  <span className="text-text-secondary">StatTrak™:</span>
                  <span className="font-semibold">{product.stats.stattrak ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-text-secondary">Souvenir:</span>
                  <span className="font-semibold">{product.stats.souvenir ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-accent-primary to-accent-tertiary text-bg-primary rounded-md font-semibold hover:shadow-glow-strong transition-all"
              >
                <i className="fas fa-shopping-cart mr-2"></i> Buy Now
              </button>
              <button className="flex-1 px-6 py-4 border-2 border-accent-primary text-accent-primary rounded-md font-semibold hover:bg-accent-primary hover:text-bg-primary transition-all">
                <i className="fas fa-exchange-alt mr-2"></i> Make Trade Offer
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="px-6 py-4 bg-bg-secondary border border-border-color rounded-md hover:bg-accent-primary hover:text-bg-primary transition-all"
              >
                <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`}></i>
              </button>
              <button className="px-6 py-4 bg-bg-secondary border border-border-color rounded-md hover:bg-accent-primary hover:text-bg-primary transition-all">
                <i className="fas fa-share-alt"></i>
              </button>
            </div>

            <div className="bg-bg-secondary border border-border-color rounded-xl p-6">
              <h3 className="text-accent-primary mb-4">Seller Information</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-accent-primary overflow-hidden">
                  <img src="https://via.placeholder.com/50/00ff88/000000?text=U" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-semibold">Trader_Pro_2024</div>
                  <div className="text-accent-yellow text-sm">
                    <i className="fas fa-star"></i> 4.9 (234 reviews)
                  </div>
                </div>
              </div>
              <div className="flex gap-8">
                <div>
                  <div className="text-2xl font-bold">1,234</div>
                  <div className="text-text-secondary text-sm">Items Sold</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-text-secondary text-sm">Positive Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-16">
          <div className="flex gap-4 border-b border-border-color mb-6">
            {['description', 'specs', 'history', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-text-secondary hover:text-accent-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="bg-bg-secondary border border-border-color rounded-xl p-8">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-2xl font-bold mb-4">About This Item</h3>
                <p className="text-text-secondary mb-4">{product.description}</p>
                <p className="text-text-secondary">
                  This particular item is in {product.condition} condition with a float value of {product.float}, making it an excellent balance between appearance and value.
                </p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div>
                <h3 className="text-2xl font-bold mb-4">Technical Specifications</h3>
                <table className="w-full">
                  <tbody className="space-y-2">
                    <tr className="border-b border-border-color">
                      <td className="py-3 text-text-secondary">Weapon Type</td>
                      <td className="py-3 font-semibold capitalize">{product.category}</td>
                    </tr>
                    <tr className="border-b border-border-color">
                      <td className="py-3 text-text-secondary">Collection</td>
                      <td className="py-3 font-semibold">The Cache Collection</td>
                    </tr>
                    <tr className="border-b border-border-color">
                      <td className="py-3 text-text-secondary">Rarity</td>
                      <td className="py-3 font-semibold capitalize">{product.rarity}</td>
                    </tr>
                    <tr className="border-b border-border-color">
                      <td className="py-3 text-text-secondary">Condition</td>
                      <td className="py-3 font-semibold">{product.condition}</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-text-secondary">Float Range</td>
                      <td className="py-3 font-semibold">0.10 - 0.20</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'history' && (
              <div>
                <h3 className="text-2xl font-bold mb-4">Price History</h3>
                <div className="bg-bg-tertiary border border-border-color rounded-lg p-12 text-center text-text-secondary">
                  <p>Price chart would be displayed here</p>
                  <p className="mt-2">Last 30 days: $120.00 - $130.00</p>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
                <div className="bg-bg-tertiary border border-border-color rounded-lg p-6 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">CS2_Player</span>
                    <div className="text-accent-yellow">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                  <p className="text-text-secondary mb-2">Great condition, fast delivery, exactly as described!</p>
                  <span className="text-text-secondary text-sm">2 days ago</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Items */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="text-accent-primary text-glow">Related</span> Items
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

