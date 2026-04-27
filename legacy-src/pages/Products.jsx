import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ItemCard from '../components/ItemCard'
import { useProducts } from '../hooks/useProducts'
import { categories } from '../data/products'

const rarityColors = {
  consumer: 'bg-gray-400 text-black',
  industrial: 'bg-blue-500 text-white',
  milspec: 'bg-blue-600 text-white',
  restricted: 'bg-purple-600 text-white',
  classified: 'bg-pink-600 text-white',
  covert: 'bg-red-500 text-white',
}

const quickSellOptions = [
  { id: 'instant', label: 'Bir zumda', hint: 'Eng tez listinglar va hot demand itemlar' },
  { id: '15min', label: '15 daqiqa', hint: 'Faol xaridorlar uchun balansli ko‘rinish' },
  { id: 'any', label: 'Ixtiyoriy', hint: 'Barcha bozordagi takliflar' },
]

const marketGuideTopics = [
  {
    title: 'Saytga qanday kirishim mumkin?',
    body: 'Steam profilingizni ulang, account oynasida xavfsizlikni tekshiring va bir necha soniyada market rejimiga kiring.',
  },
  {
    title: 'Almashuv rejimi',
    body: 'Exchange rejimida inventoryingizdagi skinlarni platformadagi boshqa premium itemlarga tezda almashtirasiz.',
  },
  {
    title: 'Qanday qilib buyumlarni almashtirish mumkin?',
    body: 'Filterlardan kerakli skinni toping, itemni tanlang va qiymatni balanslab savdoni yakunlang.',
  },
  {
    title: 'Steam savdo himoyasi',
    body: 'Steam Guard yoqilgan va trade URL to‘g‘ri ekaniga ishonch hosil qiling. Bu savdoni ancha xavfsiz qiladi.',
  },
  {
    title: 'Bozor',
    body: 'Bozor bo‘limi knife, glove va rifle skinlarni narx, float va rarity bo‘yicha premium saralash imkonini beradi.',
  },
  {
    title: 'Tezkor savdo',
    body: 'Bir zumda yoki 15 daqiqa ichida sotuvga yaqin itemlarni alohida ko‘rishingiz mumkin.',
  },
  {
    title: 'Shaxsni tasdiqlash',
    body: 'Katta limitlar va tezroq operatsiyalar uchun KYC jarayonini yakunlash foydali.',
  },
  {
    title: 'Mahsulot holati',
    body: 'Factory New dan Battle-Scarred gacha bo‘lgan holatlar collector va traderlar uchun alohida filter qilinadi.',
  },
]

export default function Products() {
  const [searchParams] = useSearchParams()
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedRarities, setSelectedRarities] = useState([])
  const [selectedConditions, setSelectedConditions] = useState([])
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState('price-asc')
  const [deliverySpeed, setDeliverySpeed] = useState('instant')
  const [guideSearch, setGuideSearch] = useState('')

  const { products, loading } = useProducts()
  const category = searchParams.get('category')
  const activeCategory = categories.find((item) => item.id === category)

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (category) {
      filtered = filtered.filter((product) => product.category === category)
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((product) => selectedTypes.includes(product.category))
    }

    if (selectedRarities.length > 0) {
      filtered = filtered.filter((product) => selectedRarities.includes(product.rarity))
    }

    if (selectedConditions.length > 0) {
      filtered = filtered.filter((product) =>
        selectedConditions.includes(product.condition.toLowerCase().replace(' ', '-'))
      )
    }

    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    )

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
  }, [products, category, selectedTypes, selectedRarities, selectedConditions, priceRange, sortBy])

  const filteredGuideTopics = useMemo(() => {
    const query = guideSearch.trim().toLowerCase()
    if (!query) return marketGuideTopics

    return marketGuideTopics.filter((topic) =>
      topic.title.toLowerCase().includes(query) || topic.body.toLowerCase().includes(query)
    )
  }, [guideSearch])

  const toggleFilter = (filterArray, setFilterArray, value) => {
    if (filterArray.includes(value)) {
      setFilterArray(filterArray.filter((filter) => filter !== value))
    } else {
      setFilterArray([...filterArray, value])
    }
  }

  const resetFilters = () => {
    setSelectedTypes([])
    setSelectedRarities([])
    setSelectedConditions([])
    setPriceRange([0, 5000])
    setDeliverySpeed('instant')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="glass-panel rounded-[2rem] p-8">
          <div className="loading-shimmer h-8 w-56 rounded-xl"></div>
          <div className="loading-shimmer mt-4 h-4 w-80 max-w-full rounded-xl"></div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="glass-panel rounded-[1.75rem] p-4">
                <div className="loading-shimmer aspect-[4/3] rounded-[1.5rem]"></div>
                <div className="loading-shimmer mt-4 h-5 w-3/4 rounded-lg"></div>
                <div className="loading-shimmer mt-3 h-4 w-1/2 rounded-lg"></div>
                <div className="loading-shimmer mt-6 h-10 w-full rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="border-b border-white/10 bg-black/20 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-2 text-4xl font-bold">
            {activeCategory ? `${activeCategory.name} Collection` : 'Browse All Items'}
          </h1>
          <p className="text-text-secondary">
            {activeCategory
              ? `${activeCategory.count} ta skin bilan ${activeCategory.name.toLowerCase()} bo'limi yangilandi.`
              : 'Find your perfect CS2 skin'}
          </p>
        </div>
      </section>

      <section className="premium-market-scene py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <aside className="glass-panel premium-market-sidebar h-fit rounded-[2rem] p-6 lg:sticky lg:top-24">
              <div className="mb-6 rounded-[1.6rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
                <div className="text-[11px] uppercase tracking-[0.24em] text-orange-100/70">Filters</div>
                <div className="mt-2 text-2xl font-bold text-white">Premium Market Panel</div>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Narx, rarity va tezlik bo‘yicha skinlarni professional tarzda saralash.
                </p>
              </div>

              <div className="mb-6 rounded-[1.4rem] border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">Saqlangan filterlar</h3>
                  <button type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition hover:border-orange-300/30 hover:text-orange-100">
                    Yangi
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Min</div>
                    <div className="mt-2 text-lg font-semibold text-white">${priceRange[0]}</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Max</div>
                    <div className="mt-2 text-lg font-semibold text-white">${priceRange[1]}</div>
                  </div>
                </div>
              </div>

              <div className="mb-6 border-b border-border-color pb-6">
                <h3 className="mb-4 text-lg font-semibold text-accent-primary">Weapon Type</h3>
                <div className="space-y-3">
                  {['rifles', 'pistols', 'knives', 'gloves', 'smgs', 'heavy'].map((type) => (
                    <label key={type} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3 text-text-secondary transition-colors hover:border-orange-300/20 hover:text-text-primary">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type)}
                        className="h-4 w-4 accent-accent-primary"
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6 border-b border-border-color pb-6">
                <h3 className="mb-4 text-lg font-semibold text-accent-primary">Rarity</h3>
                <div className="space-y-3">
                  {['consumer', 'industrial', 'milspec', 'restricted', 'classified', 'covert'].map((rarity) => (
                    <label key={rarity} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3 text-text-secondary transition-colors hover:border-orange-300/20 hover:text-text-primary">
                      <input
                        type="checkbox"
                        checked={selectedRarities.includes(rarity)}
                        onChange={() => toggleFilter(selectedRarities, setSelectedRarities, rarity)}
                        className="h-4 w-4 accent-accent-primary"
                      />
                      <span className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${rarityColors[rarity]}`}>
                        {rarity}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6 border-b border-border-color pb-6">
                <h3 className="mb-4 text-lg font-semibold text-accent-primary">Condition</h3>
                <div className="space-y-3">
                  {['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'].map((condition) => (
                    <label key={condition} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3 text-text-secondary transition-colors hover:border-orange-300/20 hover:text-text-primary">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(condition.toLowerCase().replace(' ', '-'))}
                        onChange={() => toggleFilter(selectedConditions, setSelectedConditions, condition.toLowerCase().replace(' ', '-'))}
                        className="h-4 w-4 accent-accent-primary"
                      />
                      <span>{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6 border-b border-border-color pb-6">
                <h3 className="mb-4 text-lg font-semibold text-accent-primary">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[0]}
                    onChange={(event) => setPriceRange([parseInt(event.target.value, 10), priceRange[1]])}
                    className="w-full accent-accent-primary"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(event) => setPriceRange([priceRange[0], parseInt(event.target.value, 10)])}
                    className="w-full accent-accent-primary"
                  />
                  <div className="flex justify-between text-text-secondary">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6 border-b border-border-color pb-6">
                <h3 className="mb-4 text-lg font-semibold text-accent-primary">Yetkazish tezligi</h3>
                <div className="space-y-3">
                  {quickSellOptions.map((option) => (
                    <label key={option.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                      deliverySpeed === option.id
                        ? 'border-sky-300/30 bg-sky-400/10 shadow-[0_14px_34px_rgba(48,164,255,0.14)]'
                        : 'border-white/8 bg-white/[0.025] hover:border-white/15'
                    }`}>
                      <input
                        type="radio"
                        name="delivery-speed"
                        checked={deliverySpeed === option.id}
                        onChange={() => setDeliverySpeed(option.id)}
                        className="mt-1 h-4 w-4 accent-sky-400"
                      />
                      <span className="block">
                        <span className="block font-semibold text-white">{option.label}</span>
                        <span className="mt-1 block text-sm text-white/55">{option.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6 rounded-[1.4rem] border border-white/8 bg-black/20 p-4">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Qo‘shimcha</div>
                <div className="mt-4 space-y-3 text-sm text-white/70">
                  {['StatTrak', 'Sticker bilan', 'Souvenir', 'Sovg‘a uchun', 'Low float'].map((tag) => (
                    <label key={tag} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-3 py-2.5">
                      <input type="checkbox" className="h-4 w-4 accent-orange-300" />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-secondary transition-colors hover:border-orange-300/30 hover:text-orange-100"
              >
                Reset Filters
              </button>
            </aside>

            <main>
              <div className="premium-market-header mb-6 rounded-[2rem] p-5">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/52">Market Mode</div>
                    <h2 className="mt-2 text-2xl font-bold text-white">Birja bo‘limi uchun premium listinglar</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                      Chap tomonda market-style filter panel, pastda esa katta exchange guide bo‘limi joylashdi.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                      <label className="text-text-secondary">Sort by:</label>
                      <select
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
                      >
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                      </select>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      {filteredProducts.length} items found
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="glass-panel rounded-[2rem] py-16 text-center">
                  <p className="text-xl text-text-secondary">No items found matching your filters.</p>
                </div>
              )}

              <section className="mt-14 rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(25,24,38,0.96),rgba(18,18,29,0.92))] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.3)] md:p-8">
                <div className="grid gap-8 xl:grid-cols-[360px_1fr]">
                  <aside className="rounded-[2rem] border border-white/8 bg-black/20 p-5">
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                      <input
                        type="text"
                        value={guideSearch}
                        onChange={(event) => setGuideSearch(event.target.value)}
                        placeholder="Qidiruv..."
                        className="w-full bg-transparent text-white outline-none placeholder:text-white/35"
                      />
                    </div>

                    <div className="mt-6 space-y-2">
                      {filteredGuideTopics.map((topic) => (
                        <div key={topic.title} className="rounded-[1.2rem] border border-white/6 bg-white/[0.02] px-4 py-4 transition hover:border-white/14 hover:bg-white/[0.035]">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium text-white">{topic.title}</span>
                            <span className="text-white/35">›</span>
                          </div>
                        </div>
                      ))}
                      {!filteredGuideTopics.length && (
                        <div className="rounded-[1.2rem] border border-white/6 bg-white/[0.02] px-4 py-6 text-sm text-white/55">
                          Hech narsa topilmadi.
                        </div>
                      )}
                    </div>
                  </aside>

                  <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-6 md:p-10">
                    <div className="text-center">
                      <div className="text-[11px] uppercase tracking-[0.3em] text-violet-100/55">Market Guide</div>
                      <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">Birja bo‘limi</h2>
                    </div>

                    <div className="mt-10 space-y-10">
                      <div>
                        <h3 className="text-3xl font-bold text-white">Exchange rejimiga xush kelibsiz!</h3>
                        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/68">
                          Agar siz Exchange rejimida yangi bo‘lsangiz, ushbu bo‘lim uning afzalliklari va platformada premium savdo qanday ishlashini tez tushunishga yordam beradi.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-3xl font-bold text-white">"Almashuv" rejimining maqsadi nima?</h3>
                        <p className="mt-4 max-w-4xl text-lg leading-8 text-white/68">
                          Savdo rejimida siz inventoryingizdagi CS2 buyumlarini platformadagi boshqa itemlarga almashtirishingiz, kerak bo‘lsa pul qo‘shib premium skin olishingiz yoki bir nechta item bilan qiymatni balanslashingiz mumkin.
                        </p>
                        <p className="mt-4 max-w-4xl text-lg leading-8 text-white/68">
                          Savdodan oldin Steam Guard faol, profilingiz ochiq va trade havolangiz to‘g‘ri ekaniga ishonch hosil qiling. Bu transaction jarayonini ancha ishonchli qiladi.
                        </p>
                      </div>

                      <div className="overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,rgba(12,12,20,0.95),rgba(17,17,29,0.9))] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
                        <div className="rounded-[1.6rem] border border-white/8 bg-black/40 p-4 md:p-6">
                          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="rounded-[1.4rem] border border-violet-300/10 bg-violet-400/5 p-4">
                              <div className="text-[11px] uppercase tracking-[0.24em] text-violet-100/60">Siz taklif qilasiz</div>
                              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                {filteredProducts.slice(0, 2).map((item) => (
                                  <div key={`offer-${item.id}`} className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-3">
                                    <div className="text-sm font-semibold text-white">{item.name}</div>
                                    <div className="mt-2 text-sm text-white/50">{item.condition}</div>
                                    <div className="mt-4 text-lg font-bold text-orange-100">${item.price.toFixed(2)}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="rounded-[1.4rem] border border-emerald-300/10 bg-emerald-400/5 p-4">
                              <div className="text-[11px] uppercase tracking-[0.24em] text-emerald-100/60">Siz olasiz</div>
                              <div className="mt-4 rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-4">
                                <div className="text-sm font-semibold text-white">{filteredProducts[0]?.name || 'Premium Skin'}</div>
                                <div className="mt-2 text-sm text-white/50">{filteredProducts[0]?.condition || 'Factory New'}</div>
                                <div className="mt-4 text-2xl font-bold text-cyan-100">
                                  ${filteredProducts[0]?.price?.toFixed(2) || '0.00'}
                                </div>
                              </div>
                              <button
                                type="button"
                                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-200 px-4 py-3 font-semibold text-slate-950 shadow-[0_16px_36px_rgba(145,105,255,0.3)] transition hover:-translate-y-0.5"
                              >
                                Almashishni boshlash
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Smart Filters</div>
                          <div className="mt-3 text-xl font-bold text-white">Marketga o‘xshash sidebar</div>
                          <p className="mt-2 text-sm leading-6 text-white/60">Chap tomondagi filter panel cs.money uslubidan ilhomlangan va premium palette bilan qayta ishlangan.</p>
                        </div>
                        <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Fast Discovery</div>
                          <div className="mt-3 text-xl font-bold text-white">Tez topish va saralash</div>
                          <p className="mt-2 text-sm leading-6 text-white/60">Narx, quality, rarity va tezlik bo‘yicha mahsulotlarni bir joyda boshqarish ancha osonlashdi.</p>
                        </div>
                        <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5">
                          <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Premium UX</div>
                          <div className="mt-3 text-xl font-bold text-white">Katta kontent bo‘limi</div>
                          <p className="mt-2 text-sm leading-6 text-white/60">O‘ng tomondagi guide section sahifani boyroq, ishonchliroq va tayyor mahsulotdek ko‘rsatadi.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </section>
    </>
  )
}
