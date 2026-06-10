"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";

export interface FilterState {
  categories: string[];
  rarities: string[];
  exteriors: string[];
  minPrice: number;
  maxPrice: number;
  sort: string;
  search: string;
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

const CATEGORIES = ["Pistol", "Rifle", "SMG", "Sniper", "Shotgun", "Knife", "Gloves", "Machinegun"];
const RARITIES = [
  { name: "Covert", color: "bg-[#FF4040]" },
  { name: "Classified", color: "bg-[#d32ce6]" },
  { name: "Restricted", color: "bg-[#8847ff]" },
  { name: "Mil-Spec", color: "bg-[#4b69ff]" },
  { name: "Industrial Grade", color: "bg-[#b0c3d9]" },
  { name: "Consumer Grade", color: "bg-slate-400" },
  { name: "Extraordinary", color: "bg-[#FFD700]" },
];
const EXTERIORS = ["Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"];
const SORT_OPTIONS = [
  { value: "trending", label: "Trending" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "float_asc", label: "Float: Best" },
];

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    rarities: [],
    exteriors: [],
    minPrice: 0,
    maxPrice: 10000,
    sort: "trending",
    search: "",
  });

  // Debounce price updates
  const [localMin, setLocalMin] = useState("0");
  const [localMax, setLocalMax] = useState("10000");

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateArray = (key: "categories" | "rarities" | "exteriors", value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter(i => i !== value) : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [], rarities: [], exteriors: [], minPrice: 0, maxPrice: 10000, sort: "trending", search: ""
    });
    setLocalMin("0"); setLocalMax("10000");
  };

  const handlePriceBlur = () => {
    let min = parseInt(localMin) || 0;
    let max = parseInt(localMax) || 10000;
    if (min > max) { const t = min; min = max; max = t; }
    setLocalMin(min.toString()); setLocalMax(max.toString());
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  return (
    <div className="bg-[#05050a] border border-white/5 rounded-3xl p-5 h-full flex flex-col gap-6 sticky top-24 custom-scrollbar overflow-y-auto max-h-[calc(100vh-120px)]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <SlidersHorizontal className="size-4" /> Filters
        </h2>
        <button onClick={clearFilters} className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors flex items-center gap-1">
          Clear <X className="size-3" />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
        <input 
          type="text" placeholder="Search skins..." 
          value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
          className="w-full bg-[#020204] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/30 transition-colors"
        />
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-3">Sort By</h3>
        <select 
          value={filters.sort} onChange={e => setFilters(p => ({ ...p, sort: e.target.value }))}
          className="w-full bg-[#020204] border border-white/5 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#00f0ff]/30 transition-colors appearance-none"
        >
          {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-3">Category</h3>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                filters.categories.includes(cat) ? "bg-[#00f0ff] border-[#00f0ff]" : "bg-[#020204] border-white/10 group-hover:border-white/30"
              }`}>
                {filters.categories.includes(cat) && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-[#020204] rounded-sm" />}
              </div>
              <span className={`text-xs ${filters.categories.includes(cat) ? "text-white font-medium" : "text-slate-400 group-hover:text-slate-300"}`}>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rarities */}
      <div>
        <h3 className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-3">Rarity</h3>
        <div className="flex flex-col gap-2">
          {RARITIES.map(r => (
            <label key={r.name} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                filters.rarities.includes(r.name) ? `${r.color} border-transparent` : "bg-[#020204] border-white/10 group-hover:border-white/30"
              }`}>
                {filters.rarities.includes(r.name) && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-[#020204] rounded-sm" />}
              </div>
              <div className={`w-2 h-2 rounded-full ${r.color}`} />
              <span className={`text-xs ${filters.rarities.includes(r.name) ? "text-white font-medium" : "text-slate-400 group-hover:text-slate-300"}`}>{r.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Exterior */}
      <div>
        <h3 className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-3">Exterior</h3>
        <div className="flex flex-col gap-2">
          {EXTERIORS.map(ext => (
            <label key={ext} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                filters.exteriors.includes(ext) ? "bg-[#00f0ff] border-[#00f0ff]" : "bg-[#020204] border-white/10 group-hover:border-white/30"
              }`}>
                {filters.exteriors.includes(ext) && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-[#020204] rounded-sm" />}
              </div>
              <span className={`text-xs ${filters.exteriors.includes(ext) ? "text-white font-medium" : "text-slate-400 group-hover:text-slate-300"}`}>{ext}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-3">Price Range (USD)</h3>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
            <input 
              type="text" value={localMin} onChange={e => setLocalMin(e.target.value.replace(/\D/g, ''))} onBlur={handlePriceBlur}
              className="w-full bg-[#020204] border border-white/5 rounded-xl py-2 pl-6 pr-2 text-xs text-white text-center focus:outline-none focus:border-[#00f0ff]/30"
            />
          </div>
          <span className="text-slate-600">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
            <input 
              type="text" value={localMax} onChange={e => setLocalMax(e.target.value.replace(/\D/g, ''))} onBlur={handlePriceBlur}
              className="w-full bg-[#020204] border border-white/5 rounded-xl py-2 pl-6 pr-2 text-xs text-white text-center focus:outline-none focus:border-[#00f0ff]/30"
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}
