"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FavoriteButton } from "@/components/marketplace/favorite-button";
import { BuyButton } from "@/components/marketplace/buy-button";
import { useLocale } from "@/components/providers/locale-provider";
import { currency } from "@/lib/utils";
import type { ListingCard } from "@/types/market";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowDownUp, Crosshair, Sparkles, Star, Zap } from "lucide-react";

type SortOption = "featured" | "price-asc" | "price-desc" | "liquidity";

export function MarketplaceGrid({ listings }: { listings: ListingCard[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const { t, localizeSkin } = useLocale();

  const localizedListings = useMemo(
    () => listings.map((listing) => ({ ...listing, skin: localizeSkin(listing.skin) })),
    [listings, localizeSkin],
  );

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    const next = localizedListings.filter((listing) => {
      const matchesQuery =
        listing.skin.name.toLowerCase().includes(normalized) ||
        listing.skin.category.toLowerCase().includes(normalized) ||
        listing.skin.collection.toLowerCase().includes(normalized);
      const matchesCategory = category === "all" || listing.skin.category === category;
      return matchesQuery && matchesCategory;
    });

    return next.sort((a, b) => {
      if (sort === "price-asc") return a.askPrice - b.askPrice;
      if (sort === "price-desc") return b.askPrice - a.askPrice;
      if (sort === "liquidity") return b.skin.liquidityScore - a.skin.liquidityScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [category, localizedListings, query, sort]);

  const categories = useMemo(
    () => ["all", ...new Set(localizedListings.map((listing) => listing.skin.category))],
    [localizedListings],
  );

  return (
    <div className="space-y-8">
      {/* Advanced Filtering UI / Category Tabs */}
      <div className="flex flex-col gap-6">
        {/* Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
            <input
              value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder="Search skins, collections..."
              className="w-full bg-[#05050a] border border-[#ffffff]/5 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/30 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
               <ArrowDownUp className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-600 pointer-events-none" />
               <select 
                 value={sort} onChange={(event) => setSort(event.target.value as SortOption)} 
                 className="w-full appearance-none bg-[#05050a] border border-[#ffffff]/5 rounded-2xl py-3 pl-10 pr-10 text-white text-sm focus:outline-none focus:border-[#ffaa00]/30 cursor-pointer"
               >
                 <option value="featured" className="bg-[#05050a]">Recently Added</option>
                 <option value="price-asc" className="bg-[#05050a]">Price: Low to High</option>
                 <option value="price-desc" className="bg-[#05050a]">Price: High to Low</option>
                 <option value="liquidity" className="bg-[#05050a]">High Liquidity</option>
               </select>
            </div>
          </div>
        </div>

        {/* Animated Category Tabs */}
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-3 p-1 bg-[#05050a] border border-[#ffffff]/5 rounded-2xl w-max">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-5 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all ${category === item ? 'bg-gradient-to-r from-[#a100ff] to-[#00f0ff] text-white glow-purple' : 'text-slate-500 hover:text-white'}`}
              >
                {item === "all" ? "All Items" : item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Luxury Marketplace Grid */}
      <AnimatePresence>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((listing) => (
            <motion.article 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              key={listing.id} 
              className="bg-[#05050a] border border-[#ffffff]/5 rounded-3xl p-5 cursor-pointer relative group overflow-hidden flex flex-col h-full"
            >
              {/* Rarity Background Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Animated Border on Hover */}
              <div className="absolute inset-0 border border-[#a100ff]/0 group-hover:border-[#a100ff]/30 rounded-3xl transition-colors duration-500" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider bg-[#020204] px-2.5 py-1 rounded-lg border border-[#ffffff]/5 text-[#ffaa00]">
                    FN {listing.skin.wear.toFixed(3)}
                  </span>
                  <div className="z-20">
                    <FavoriteButton skinId={listing.skin.id} initial={Boolean(listing.skin.favorite)} />
                  </div>
                </div>

                {/* Skin Image Mock */}
                <div className="h-40 mb-6 bg-gradient-to-b from-transparent to-[#ffffff]/5 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative">
                  <Image src={listing.skin.image} alt={listing.skin.name} fill className="object-contain p-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                </div>

                <div className="mb-4">
                  <div className="text-xs text-slate-600 font-medium mb-1">{listing.skin.category} • {listing.skin.collection}</div>
                  <Link href={`/marketplace/${listing.skin.slug}`} className="block">
                    <div className="text-base font-bold text-white group-hover:text-[#00f0ff] transition-colors truncate">
                      {listing.skin.name}
                    </div>
                  </Link>
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600">
                  <div className="bg-[#020204] p-2 rounded-lg border border-[#ffffff]/5 text-center">
                    <div className="text-slate-500 mb-0.5">Liquidity</div>
                    <div className="text-[#ffaa00]">{listing.skin.liquidityScore}</div>
                  </div>
                  <div className="bg-[#020204] p-2 rounded-lg border border-[#ffffff]/5 text-center">
                    <div className="text-slate-500 mb-0.5">Style</div>
                    <div className="text-white truncate">{listing.skin.finishStyle}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#ffffff]/5">
                  <div>
                    <div className="text-[9px] font-heading font-bold uppercase tracking-widest text-slate-600 mb-0.5">Price</div>
                    <div className="text-xl font-heading font-bold text-[#00ff87]">
                      {currency(listing.askPrice)}
                    </div>
                  </div>
                  <div className="transition-transform group-hover:scale-105">
                     <BuyButton listingId={listing.id} />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </AnimatePresence>

      {filtered.length === 0 && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-64 flex-col items-center justify-center rounded-3xl border border-[#ffffff]/5 bg-[#05050a] text-center">
            <Crosshair className="size-12 text-slate-600 mb-4 opacity-50" />
            <h3 className="font-heading text-xl font-bold text-white">No items found</h3>
            <p className="text-slate-500 mt-1 text-sm">Adjust your filters or search query</p>
         </motion.div>
      )}
    </div>
  );
}
