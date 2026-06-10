"use client";

import { useState, useMemo } from "react";
import { FilterSidebar, FilterState } from "./filter-sidebar";
import { SkinCard, Listing } from "./skin-card";
import { AnimatePresence, motion } from "framer-motion";
import { Ghost, X } from "lucide-react";

interface MarketplaceGridProps {
  initialListings: Listing[];
}

export function MarketplaceGrid({ initialListings }: MarketplaceGridProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [], rarities: [], exteriors: [], minPrice: 0, maxPrice: 10000, sort: "trending", search: ""
  });

  const filteredListings = useMemo(() => {
    return initialListings.filter(listing => {
      const { skin, askPrice } = listing;
      if (filters.search && !skin.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.categories.length && !filters.categories.includes(skin.category)) return false;
      if (filters.rarities.length && !filters.rarities.includes(skin.rarity)) return false;
      if (filters.exteriors.length && !filters.exteriors.includes(skin.exterior)) return false;
      if (askPrice < filters.minPrice || askPrice > filters.maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (filters.sort === "price_asc") return a.askPrice - b.askPrice;
      if (filters.sort === "price_desc") return b.askPrice - a.askPrice;
      if (filters.sort === "float_asc") return a.skin.wear - b.skin.wear;
      // "trending" and "newest" keep original sort (assuming latest first initially)
      return 0;
    });
  }, [initialListings, filters]);

  const activeFilterCount = filters.categories.length + filters.rarities.length + filters.exteriors.length + (filters.search ? 1 : 0);

  const removeCategory = (cat: string) => setFilters(p => ({ ...p, categories: p.categories.filter(c => c !== cat) }));
  const removeRarity = (r: string) => setFilters(p => ({ ...p, rarities: p.rarities.filter(x => x !== r) }));
  const removeExterior = (e: string) => setFilters(p => ({ ...p, exteriors: p.exteriors.filter(x => x !== e) }));

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-[280px] shrink-0">
        <FilterSidebar onFilterChange={setFilters} />
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 min-w-0">
        
        {/* Top Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-heading font-bold text-white uppercase tracking-wider">
              {filteredListings.length} Results
            </span>
            {/* Active filter badges */}
            <AnimatePresence>
              {filters.categories.map(c => (
                <motion.button key={`cat-${c}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => removeCategory(c)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-300 hover:bg-white/10 transition-colors">
                  {c} <X className="size-3" />
                </motion.button>
              ))}
              {filters.rarities.map(r => (
                <motion.button key={`rar-${r}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => removeRarity(r)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-300 hover:bg-white/10 transition-colors">
                  {r} <X className="size-3" />
                </motion.button>
              ))}
              {filters.exteriors.map(e => (
                <motion.button key={`ext-${e}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => removeExterior(e)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-300 hover:bg-white/10 transition-colors">
                  {e} <X className="size-3" />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Grid */}
        {filteredListings.length > 0 ? (
          <motion.div layout className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 sm:gap-6">
            <AnimatePresence>
              {filteredListings.map(listing => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={listing.id}
                >
                  <SkinCard listing={listing} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 bg-[#05050a] border border-white/5 rounded-3xl mt-4">
            <Ghost className="size-16 text-slate-700 mb-4" />
            <h3 className="font-heading text-xl font-bold text-white mb-2">No items found</h3>
            <p className="text-sm text-slate-500 max-w-md text-center">We couldn&apos;t find any skins matching your exact filters. Try adjusting your search criteria or price range.</p>
            {activeFilterCount > 0 && (
              <button 
                onClick={() => setFilters({ categories: [], rarities: [], exteriors: [], minPrice: 0, maxPrice: 10000, sort: "trending", search: "" })}
                className="mt-6 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-heading font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
