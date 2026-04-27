import { Link } from 'react-router-dom'
import ItemCard from '../components/ItemCard'
import { categories, products } from '../data/products'
import { getSkinFallbackImage } from '../utils/imageFallback'

export default function Home() {
  const featuredItems = products.slice(0, 8)
  const heroItems = products.slice(0, 4)
  const categoryCards = categories.map((category) => ({
    ...category,
    previewItems: products.filter((item) => item.category === category.id).slice(0, 3),
  }))

  const getItemImage = (item, width = 400, height = 300) => item.image || getSkinFallbackImage(item.name, width, height)

  return (
    <>
      <section className="relative mb-16 overflow-hidden">
        <div className="theme-hero-surface absolute inset-0"></div>
        <div className="hero-orb theme-orb-secondary absolute -left-24 top-10 h-80 w-80 rounded-full blur-3xl"></div>
        <div className="hero-orb-delayed theme-orb-primary absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl"></div>
        <div className="hero-orb absolute left-[12%] top-[18%] h-56 w-56 rounded-full border border-accent-primary/15 bg-transparent"></div>
        <div className="hero-orb-delayed absolute right-[8%] top-[12%] h-72 w-72 rotate-12 rounded-[3rem] border border-white/5"></div>
        <div className="hero-orb absolute bottom-[-6rem] left-1/3 h-64 w-64 rounded-full border border-accent-yellow/15"></div>
        <div className="theme-grid-overlay hero-grid absolute inset-0 bg-[size:120px_120px] opacity-30"></div>
        <div className="absolute inset-0 bg-black/58"></div>

        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="theme-pill mb-5 inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
                Rare Drops • Elite Trading • Instant Flex
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-none sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                <span className="block text-text-primary">Own The</span>
                <span className="theme-heading-gradient block">Most Wanted</span>
                <span className="block text-text-primary/90">CS2 Skins</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-text-secondary md:text-xl">
                Counter-Strike 2 uchun premium knife, glove va weapon skinlar shu yerda.
                Top kolleksiyalarni ko‘ring, tez buyurtma bering va inventory’ingizni premium darajaga olib chiqing.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/products"
                  className="theme-button-primary inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 font-semibold transition-all hover:-translate-y-1"
                >
                  Browse Collection
                  <span>→</span>
                </Link>
                <Link
                  to="/account"
                  className="theme-button-secondary inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 font-semibold transition-all hover:-translate-y-1"
                >
                  Start Trading
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="theme-soft-panel rounded-3xl p-5">
                  <span className="block text-4xl font-black text-accent-yellow">50K+</span>
                  <span className="mt-2 block text-sm uppercase tracking-[0.18em] text-text-secondary">Active Items</span>
                </div>
                <div className="theme-soft-panel rounded-3xl p-5">
                  <span className="block text-4xl font-black text-accent-primary">25K+</span>
                  <span className="mt-2 block text-sm uppercase tracking-[0.18em] text-text-secondary">Active Traders</span>
                </div>
                <div className="theme-soft-panel rounded-3xl p-5">
                  <span className="block text-4xl font-black text-accent-tertiary">$2M+</span>
                  <span className="mt-2 block text-sm uppercase tracking-[0.18em] text-text-secondary">Monthly Volume</span>
                </div>
              </div>
            </div>

            <div className="relative min-h-[540px]">
              <div className="theme-orb-primary absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"></div>

              <div className="hero-card-float hero-card-float--1 absolute left-5 top-10 w-52">
                <div className="premium-showcase-card rounded-[2rem] p-3 transition-transform duration-700 hover:-translate-y-2">
                  <img
                    src={getItemImage(heroItems[0], 400, 320)}
                    alt={heroItems[0].name}
                    className="premium-showcase-media h-48 w-full rounded-[1.4rem] object-contain p-4"
                    loading="lazy"
                    onError={(event) => {
                      event.target.onerror = null
                      event.target.src = getSkinFallbackImage(heroItems[0].name, 400, 320)
                    }}
                  />
                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-accent-primary/80">Hot Pick</p>
                    <h3 className="mt-1 text-lg font-semibold">{heroItems[0].name}</h3>
                    <p className="mt-1 text-accent-yellow">${heroItems[0].price.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="hero-card-float hero-card-float--2 absolute right-0 top-0 w-56">
                <div className="premium-showcase-card rounded-[2rem] p-3 transition-transform duration-700 hover:translate-y-2">
                  <img
                    src={getItemImage(heroItems[1], 400, 360)}
                    alt={heroItems[1].name}
                    className="premium-showcase-media h-56 w-full rounded-[1.4rem] object-contain p-4"
                    loading="lazy"
                    onError={(event) => {
                      event.target.onerror = null
                      event.target.src = getSkinFallbackImage(heroItems[1].name, 400, 360)
                    }}
                  />
                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-accent-primary/80">Collector Grade</p>
                    <h3 className="mt-1 text-lg font-semibold">{heroItems[1].name}</h3>
                    <p className="mt-1 text-accent-yellow">${heroItems[1].price.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="hero-card-float hero-card-float--3 absolute bottom-6 left-10 w-60">
                <div className="premium-showcase-card theme-card-highlight rounded-[2rem] p-4 transition-transform duration-700 hover:-translate-y-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={getItemImage(heroItems[2], 200, 180)}
                      alt={heroItems[2].name}
                      className="premium-showcase-media h-20 w-20 rounded-2xl object-contain p-2"
                      loading="lazy"
                      onError={(event) => {
                        event.target.onerror = null
                        event.target.src = getSkinFallbackImage(heroItems[2].name, 200, 180)
                      }}
                    />
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-accent-primary/80">Top Seller</p>
                      <h3 className="text-base font-semibold">{heroItems[2].name}</h3>
                      <p className="mt-1 text-sm text-text-secondary">{heroItems[2].condition}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-black text-accent-yellow">${heroItems[2].price.toFixed(2)}</span>
                    <span className="theme-tag rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em]">In Demand</span>
                  </div>
                </div>
              </div>

              <div className="hero-card-float hero-card-float--4 absolute bottom-0 right-4 w-52">
                <div className="premium-showcase-card rounded-[2rem] p-3 transition-transform duration-700 hover:translate-y-2">
                  <img
                    src={getItemImage(heroItems[3], 240, 220)}
                    alt={heroItems[3].name}
                    className="premium-showcase-media h-44 w-full rounded-[1.4rem] object-contain p-4"
                    loading="lazy"
                    onError={(event) => {
                      event.target.onerror = null
                      event.target.src = getSkinFallbackImage(heroItems[3].name, 240, 220)
                    }}
                  />
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-accent-primary/80">Limited Wear</p>
                      <h3 className="mt-1 text-base font-semibold">{heroItems[3].name}</h3>
                    </div>
                    <span className="text-lg font-bold text-accent-yellow">${heroItems[3].price.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">
            <span className="text-accent-primary text-glow">Featured</span> Items
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="premium-market-scene bg-bg-secondary/70 py-16 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">
            <span className="text-accent-primary text-glow">Browse</span> by Category
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {categoryCards.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="premium-showcase-card group rounded-2xl p-4 text-center transition-all duration-500 hover:-translate-y-2 hover:border-accent-primary hover:shadow-glow"
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(var(--color-accent-primary)/0.1),transparent_55%,rgb(var(--color-accent-yellow)/0.06))] opacity-70"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    {category.previewItems.map((item, index) => (
                      <div
                        key={`${category.id}-${item.id}`}
                        className={`premium-showcase-media overflow-hidden rounded-xl border border-white/10 ${index === 0 ? 'col-span-3 aspect-[16/10]' : 'aspect-square'}`}
                      >
                        <img
                          src={getItemImage(item, 320, 240)}
                          alt={item.name}
                          className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          onError={(event) => {
                            event.target.onerror = null
                            event.target.src = getSkinFallbackImage(item.name, 320, 240)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="theme-pill mb-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                    {category.accent}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-text-secondary">{category.count.toLocaleString()} skins available</p>
                  <div className="theme-soft-panel mt-4 translate-y-3 rounded-2xl p-3 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-accent-primary/80">Top Skins</p>
                    <div className="space-y-2">
                      {category.previewItems.map((item) => (
                        <div key={`${category.id}-name-${item.id}`} className="flex items-center justify-between gap-3 text-sm">
                          <span className="truncate text-text-primary/90">{item.name}</span>
                          <span className="shrink-0 text-accent-yellow">${item.price.toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent-primary">
                      Explore Collection
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
