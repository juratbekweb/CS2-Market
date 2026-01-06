import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ItemCard from '../components/ItemCard'
import { products } from '../data/products'

const rarityColors = {
  consumer: 'bg-gray-400 text-black',
  industrial: 'bg-blue-500 text-white',
  milspec: 'bg-blue-600 text-white',
  restricted: 'bg-purple-600 text-white',
  classified: 'bg-pink-600 text-white',
  covert: 'bg-red-500 text-white',
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedRarities, setSelectedRarities] = useState([])
  const [selectedConditions, setSelectedConditions] = useState([])
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState('price-asc')

  const category = searchParams.get('category')

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filter by category
    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }

    // Filter by weapon type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(p => selectedTypes.includes(p.category))
    }

    // Filter by rarity
    if (selectedRarities.length > 0) {
      filtered = filtered.filter(p => selectedRarities.includes(p.rarity))
    }

    // Filter by condition
    if (selectedConditions.length > 0) {
      filtered = filtered.filter(p => selectedConditions.includes(p.condition.toLowerCase().replace(' ', '-')))
    }

    // Filter by price
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })

    return filtered
  }, [category, selectedTypes, selectedRarities, selectedConditions, priceRange, sortBy])

  const toggleFilter = (filterArray, setFilterArray, value) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter(f => f !== value))
    } else {
      setFilterArray([...filterArray, value])
    }
  }

  return (
    <>
      <section className="py-12 bg-bg-secondary border-b border-border-color">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Browse All Items</h1>
          <p className="text-text-secondary">Find your perfect CS2 skin</p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Filters Sidebar */}
            <aside className="bg-bg-secondary border border-border-color rounded-xl p-6 h-fit lg:sticky lg:top-24">
              <div className="mb-6 pb-6 border-b border-border-color">
                <h3 className="text-lg font-semibold text-accent-primary mb-4">Weapon Type</h3>
                <div className="space-y-3">
                  {['rifles', 'pistols', 'knives', 'gloves', 'smgs', 'heavy'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-text-primary transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type)}
                        className="w-4 h-4 accent-accent-primary"
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-border-color">
                <h3 className="text-lg font-semibold text-accent-primary mb-4">Rarity</h3>
                <div className="space-y-3">
                  {['consumer', 'industrial', 'milspec', 'restricted', 'classified', 'covert'].map(rarity => (
                    <label key={rarity} className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-text-primary transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedRarities.includes(rarity)}
                        onChange={() => toggleFilter(selectedRarities, setSelectedRarities, rarity)}
                        className="w-4 h-4 accent-accent-primary"
                      />
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${rarityColors[rarity]}`}>
                        {rarity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-border-color">
                <h3 className="text-lg font-semibold text-accent-primary mb-4">Condition</h3>
                <div className="space-y-3">
                  {['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'].map(condition => (
                    <label key={condition} className="flex items-center gap-2 cursor-pointer text-text-secondary hover:text-text-primary transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition.toLowerCase().replace(' ', '-'))}
                        onChange={() => toggleFilter(selectedConditions, setSelectedConditions, condition.toLowerCase().replace(' ', '-'))}
                        className="w-4 h-4 accent-accent-primary"
                      />
                      <span>{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-accent-primary mb-4">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full accent-accent-primary"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-accent-primary"
                  />
                  <div className="flex justify-between text-text-secondary">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedTypes([])
                  setSelectedRarities([])
                  setSelectedConditions([])
                  setPriceRange([0, 5000])
                }}
                className="w-full px-4 py-2 border border-border-color rounded-md text-text-secondary hover:border-accent-primary hover:text-accent-primary transition-colors"
              >
                Reset Filters
              </button>
            </aside>

            {/* Products Grid */}
            <main>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <label className="text-text-secondary">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-bg-secondary border border-border-color rounded-md text-text-primary"
                  >
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
                <div className="text-text-secondary">
                  {filteredProducts.length} items found
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-text-secondary text-xl">No items found matching your filters.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  )
}

