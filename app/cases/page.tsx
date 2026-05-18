"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Sparkles, Star, Search, Zap, Crown, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CaseInfo {
  id: string; name: string; slug: string; price: number;
  image: string; itemCount: number; bestDrop: string; bestDropValue: number;
}

const RARITY_GLOW: Record<string, string> = {
  "phantom-collection": "rgba(161,0,255,0.4)",
  "neon-rush": "rgba(0,240,255,0.4)",
  "dragon-lore": "rgba(255,170,0,0.4)",
  "budget-blaster": "rgba(0,255,135,0.4)",
};

const CASE_GRADIENT: Record<string, string> = {
  "phantom-collection": "from-[#a100ff] to-transparent",
  "neon-rush": "from-[#00f0ff] to-transparent",
  "dragon-lore": "from-[#ffaa00] to-transparent",
  "budget-blaster": "from-[#00ff87] to-transparent",
};

export default function CasesPage() {
  const [cases, setCases] = useState<CaseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/cases")
      .then((r) => r.json())
      .then((data) => { setCases(data.cases || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredCases = cases.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilter !== "ALL") {
      if (activeFilter === "PREMIUM" && c.price < 20) return false;
      if (activeFilter === "BUDGET" && c.price >= 20) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <div className="mb-16 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-6 py-2 text-xs font-heading font-bold uppercase tracking-wider text-[#00f0ff] backdrop-blur-md"
        >
          <Package className="size-4" /> Case Openings
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="font-heading text-6xl uppercase tracking-tighter text-white font-extrabold mb-4"
        >
          PREMIUM <span className="bg-gradient-to-r from-[#a100ff] to-[#00f0ff] bg-clip-text text-transparent">DROPS</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-slate-400 font-medium"
        >
          Unlock exclusive skins with provably fair odds. Every case is a new opportunity to build your ultimate inventory.
        </motion.p>
      </div>

      {/* Filters and Search */}
      <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 z-10 relative">
        <div className="flex bg-[#05050a] backdrop-blur-md p-1 rounded-2xl border border-[#ffffff]/5 shadow-lg">
          {["ALL", "PREMIUM", "BUDGET", "NEW"].map((filter) => (
            <button 
              key={filter} onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all ${activeFilter === filter ? 'bg-gradient-to-r from-[#a100ff] to-[#00f0ff] text-white glow-purple' : 'text-slate-500 hover:text-white'}`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
          <input 
            type="text" placeholder="Search cases..." 
            className="w-full bg-[#05050a] border border-[#ffffff]/5 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/30 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Cases Grid */}
      {loading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-[#05050a] h-[450px] animate-pulse rounded-3xl border border-[#ffffff]/5" />
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredCases.map((c, index) => (
              <motion.div 
                layout initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                key={c.id}
              >
                <Link href={`/cases/${c.slug}`} className="block h-full">
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="relative bg-[#05050a] border border-[#ffffff]/5 rounded-3xl p-6 cursor-pointer group overflow-hidden transition-all duration-500"
                  >
                    {/* Background glow specific to case */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
                      style={{ background: `radial-gradient(circle at top, ${RARITY_GLOW[c.slug] || 'rgba(0,240,255,0.15)'} 0%, transparent 70%)` }}
                    />
                    
                    {/* Animated Border on Hover */}
                    <div className="absolute inset-0 border border-[#a100ff]/0 group-hover:border-[#a100ff]/30 rounded-3xl transition-colors duration-500" />

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Case Visual */}
                      <div className="relative mx-auto mb-6 flex h-40 w-40 items-center justify-center">
                        <div className={`absolute inset-0 bg-gradient-to-b ${CASE_GRADIENT[c.slug] || 'from-[#ffffff]/10 to-transparent'} rounded-full blur-2xl opacity-10 group-hover:opacity-30 group-hover:scale-125 transition-all duration-700`} />
                        
                        <motion.div 
                          animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          className="relative z-10 flex items-center justify-center"
                        >
                          {/* Stylized Box */}
                          <div className="w-24 h-24 bg-[#020204] border border-[#ffffff]/10 rounded-2xl flex items-center justify-center group-hover:border-[#00f0ff]/30 transition-colors duration-500">
                            <Package className="size-10 text-slate-600 group-hover:text-[#00f0ff] transition-colors duration-500" />
                          </div>
                        </motion.div>
                        
                        {/* Floating particles effect */}
                        <div className="absolute inset-0 overflow-hidden rounded-full opacity-0 group-hover:opacity-100">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white rounded-full"
                              initial={{ x: 80, y: 80, opacity: 0 }}
                              animate={{ x: Math.random() * 160, y: Math.random() * 160 - 40, opacity: [0, 1, 0] }}
                              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Info */}
                      <h3 className="text-center font-heading text-xl font-bold text-white mb-1 group-hover:text-[#00f0ff] transition-colors">{c.name}</h3>

                      <div className="flex items-center justify-center gap-1.5 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-6">
                        <Sparkles className="size-3 text-[#ffaa00]" /> {c.itemCount} items
                      </div>

                      <div className="mt-auto">
                        {/* Best drop */}
                        <div className="rounded-xl bg-[#020204] border border-[#ffffff]/5 p-3 mb-4 group-hover:border-[#ffffff]/10 transition-colors">
                          <div className="flex items-center gap-1.5 text-[9px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">
                            <Star className="size-3 text-[#ffaa00]" /> Top Drop
                          </div>
                          <div className="truncate text-xs font-bold text-white mb-0.5">{c.bestDrop}</div>
                          <div className="text-sm font-heading font-bold text-[#ffaa00]">${c.bestDropValue.toFixed(2)}</div>
                        </div>

                        {/* Price and CTA */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-heading font-bold uppercase tracking-wider text-slate-600">Price</span>
                            <span className="font-heading text-2xl font-bold text-[#00ff87]">${c.price.toFixed(2)}</span>
                          </div>
                          <button className="px-4 py-2 bg-[#020204] border border-[#00ff87]/20 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-[#00ff87] hover:bg-[#00ff87] hover:text-[#020204] hover:glow-emerald transition-all">
                            Unlock
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Trust Indicator */}
      <motion.div 
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="premium-glass mt-24 rounded-3xl p-12 text-center border-[#00f0ff]/20 relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent" />
        <div className="text-xs font-heading font-bold uppercase tracking-wider text-[#00f0ff] mb-4 flex items-center justify-center gap-2">
          <Zap className="size-4" /> Provably Fair
        </div>
        <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-400">
          Our cryptographic system guarantees absolute fairness. Every case opening is generated using a combination of your client seed and our server seed, ensuring 100% transparency.
        </p>
      </motion.div>
    </div>
  );
}
