"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Info, X, Zap, Grid, List, Filter, RefreshCw, Link as LinkIcon } from "lucide-react";
import { SellForm } from "@/components/marketplace/sell-form";
import { currency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function InventoryClient({ items }: { items: any[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [inspectItem, setInspectItem] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tradeUrl, setTradeUrl] = useState("");

  const filteredItems = items.filter((item) => {
    const skin = item.skin;
    const matchesSearch = skin.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || skin.category === filter || skin.rarity === filter;
    return matchesSearch && matchesFilter;
  });

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate API call to fetch steam inventory
    setTimeout(() => {
      setIsSyncing(false);
      alert("Inventory synced with Steam successfully!");
    }, 2000);
  };

  const handleSaveUrl = () => {
    if (!tradeUrl.includes("steamcommunity.com/tradeoffer")) {
      alert("Please enter a valid Steam Trade URL.");
      return;
    }
    setShowSettings(false);
    alert("Trade URL saved successfully!");
  };

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
          <input
            type="text"
            placeholder="Search inventory..."
            className="w-full bg-[#05050a] border border-[#ffffff]/5 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/30 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          {/* Filter */}
          <div className="relative flex-1 md:w-48">
             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-600 pointer-events-none" />
             <select 
               value={filter} onChange={(e) => setFilter(e.target.value)} 
               className="w-full appearance-none bg-[#05050a] border border-[#ffffff]/5 rounded-2xl py-3 pl-10 pr-10 text-white text-xs font-heading font-bold uppercase tracking-wider focus:outline-none focus:border-[#a100ff]/30 cursor-pointer"
             >
                <option value="all" className="bg-[#05050a]">All Items</option>
                <option value="Rifle" className="bg-[#05050a]">Rifles</option>
                <option value="Pistol" className="bg-[#05050a]">Pistols</option>
                <option value="Knife" className="bg-[#05050a]">Knives</option>
                <option value="Gloves" className="bg-[#05050a]">Gloves</option>
                <option value="Covert" className="bg-[#05050a]">Covert</option>
                <option value="Classified" className="bg-[#05050a]">Classified</option>
             </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-[#05050a] border border-[#ffffff]/5 rounded-2xl p-1">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? 'bg-[#020204] text-[#00f0ff] border border-[#ffffff]/5' : 'text-slate-600 hover:text-white'}`}
            >
              <Grid className="size-4" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl transition-all ${viewMode === "list" ? 'bg-[#020204] text-[#00f0ff] border border-[#ffffff]/5' : 'text-slate-600 hover:text-white'}`}
            >
              <List className="size-4" />
            </button>
          </div>

          <div className="flex bg-[#05050a] border border-[#ffffff]/5 rounded-2xl p-1 gap-1">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                isSyncing ? 'text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-[#a100ff]/20 to-[#00f0ff]/20 text-white hover:border-[#00f0ff]/30 border border-transparent'
              }`}
            >
              <RefreshCw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? "Syncing..." : "Sync Steam"}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl text-slate-600 hover:text-white transition-colors"
              title="Trade Settings"
            >
              <LinkIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid / List View */}
      <AnimatePresence>
        <div className={viewMode === "grid" ? "grid gap-4 sm:gap-6 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]" : "space-y-4"}>
          {filteredItems.map((item) => {
            const skin = item.skin;
            
            if (viewMode === "grid") {
              return (
                <motion.article 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  key={item.id} 
                  className="bg-[#05050a] border border-[#ffffff]/5 rounded-3xl p-5 cursor-pointer relative group overflow-hidden flex flex-col h-full"
                  onClick={() => setInspectItem(item)}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Animated Border on Hover */}
                  <div className="absolute inset-0 border border-[#a100ff]/0 group-hover:border-[#a100ff]/30 rounded-3xl transition-colors duration-500" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-heading font-bold uppercase tracking-wider bg-[#020204] px-2.5 py-1 rounded-lg border border-[#ffffff]/5 text-[#ffaa00]">
                        {skin.exterior}
                      </span>
                      <button className="text-slate-600 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setInspectItem(item); }}>
                         <Info className="size-4" />
                      </button>
                    </div>

                    <div className="h-32 mb-4 bg-gradient-to-b from-transparent to-[#ffffff]/5 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative">
                      <Image src={skin.image} alt={skin.name} fill className="object-contain p-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                    </div>

                    <div className="mb-4">
                      <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">{skin.category}</div>
                      <div className="text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors truncate">
                        {skin.name}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600">
                      <div className="bg-[#020204] p-2 rounded-lg border border-[#ffffff]/5 text-center">
                        <div className="text-slate-500 mb-0.5">Value</div>
                        <div className="text-[#00ff87]">${Number(item.currentValue).toFixed(2)}</div>
                      </div>
                      <div className="bg-[#020204] p-2 rounded-lg border border-[#ffffff]/5 text-center">
                        <div className="text-slate-500 mb-0.5">P/L</div>
                        <div className={`${item.pnl >= 0 ? "text-[#00ff87]" : "text-[#ff2a5f]"}`}>
                          {item.pnl >= 0 ? "+" : ""}{Number(item.pnl).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto flex gap-2 pt-4 border-t border-[#ffffff]/5" onClick={e => e.stopPropagation()}>
                      {item.isListed ? (
                        <div className="flex-1 text-center text-[10px] font-heading font-bold uppercase tracking-wider text-[#00f0ff] bg-[#00f0ff]/10 py-2 rounded-lg border border-[#00f0ff]/20">
                          Listed
                        </div>
                      ) : (
                        <div className="flex-1">
                          <SellForm skinId={skin.id} suggestedPrice={item.currentValue} />
                        </div>
                      )}
                      <Link href="/upgrade" className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#020204] border border-[#ffffff]/5 rounded-lg text-[10px] font-heading font-bold uppercase tracking-wider text-white hover:border-[#a100ff]/30 transition-colors">
                        <Zap className="size-3 text-[#ffaa00]" /> Upgrade
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            } else {
              // List View
              return (
                <motion.article 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  key={item.id} 
                  className="bg-[#05050a] border border-[#ffffff]/5 rounded-2xl p-4 cursor-pointer relative group overflow-hidden flex items-center justify-between gap-6"
                  onClick={() => setInspectItem(item)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-16 bg-[#020204] rounded-lg flex items-center justify-center p-2 border border-[#ffffff]/5">
                      <div className="relative w-full h-full">
                        <Image src={skin.image} alt={skin.name} fill className="object-contain drop-shadow-md" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors truncate">{skin.name}</div>
                      <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600">{skin.exterior} • {skin.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[9px] font-heading font-bold uppercase tracking-wider text-slate-600">Value</div>
                      <div className="text-sm font-heading font-bold text-[#00ff87]">${Number(item.currentValue).toFixed(2)}</div>
                    </div>
                    <div className="text-right hidden md:block">
                      <div className="text-[9px] font-heading font-bold uppercase tracking-wider text-slate-600">P/L</div>
                      <div className={`text-sm font-heading font-bold ${item.pnl >= 0 ? "text-[#00ff87]" : "text-[#ff2a5f]"}`}>
                        {item.pnl >= 0 ? "+" : ""}{Number(item.pnl).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      {item.isListed ? (
                        <div className="px-3 py-1.5 text-[10px] font-heading font-bold uppercase tracking-wider text-[#00f0ff] bg-[#00f0ff]/10 rounded-lg border border-[#00f0ff]/20">
                          Listed
                        </div>
                      ) : (
                        <div className="w-32">
                          <SellForm skinId={skin.id} suggestedPrice={item.currentValue} />
                        </div>
                      )}
                      <Link href="/upgrade" className="flex items-center justify-center p-2 bg-[#020204] border border-[#ffffff]/5 rounded-lg text-white hover:border-[#a100ff]/30 transition-colors">
                        <Zap className="size-3 text-[#ffaa00]" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            }
          })}
        </div>
      </AnimatePresence>

      {filteredItems.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-[#ffffff]/5 bg-[#05050a] text-center">
          <p className="text-slate-500 text-sm">No items found matching your filters.</p>
        </div>
      )}

      {/* Inspect Modal */}
      <AnimatePresence>
        {inspectItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#020204]/90 backdrop-blur-xl p-4" 
            onClick={() => setInspectItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full max-w-2xl rounded-3xl border border-[#ffffff]/5 bg-[#05050a] p-6" 
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute right-4 top-4 z-10">
                <button onClick={() => setInspectItem(null)} className="p-2 text-slate-600 hover:text-white transition-colors">
                  <X className="size-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                 {/* Image Side */}
                 <div className="relative flex h-64 items-center justify-center bg-gradient-to-b from-transparent to-[#ffffff]/5 rounded-2xl p-6">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)]" />
                   <Image src={inspectItem.skin.image} alt={inspectItem.skin.name} width={200} height={200} className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-10" />
                   <div className="absolute bottom-4 left-4 rounded-lg border border-[#ffffff]/10 bg-[#020204] px-2.5 py-1 text-[10px] font-heading font-bold uppercase tracking-wider text-white">
                     {inspectItem.skin.rarity}
                   </div>
                 </div>
                 
                 {/* Details Side */}
                 <div className="flex flex-col justify-center">
                   <div className="text-xs text-slate-600 font-heading font-bold uppercase tracking-wider mb-1">{inspectItem.skin.category} • {inspectItem.skin.collection}</div>
                   <h3 className="font-heading text-2xl font-bold text-white mb-6">{inspectItem.skin.name}</h3>
                   
                   <div className="grid grid-cols-2 gap-4 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-6">
                     <div className="bg-[#020204] p-3 rounded-xl border border-[#ffffff]/5">
                       <div className="text-slate-500 mb-0.5">Exterior</div>
                       <div className="text-white text-xs">{inspectItem.skin.exterior}</div>
                     </div>
                     <div className="bg-[#020204] p-3 rounded-xl border border-[#ffffff]/5">
                       <div className="text-slate-500 mb-0.5">Float</div>
                       <div className="text-white text-xs">{inspectItem.skin.wear?.toFixed(4) || "0.0123"}</div>
                     </div>
                     <div className="bg-[#020204] p-3 rounded-xl border border-[#ffffff]/5">
                       <div className="text-slate-500 mb-0.5">Cost Basis</div>
                       <div className="text-white text-xs">{currency(Number(inspectItem.acquisition))}</div>
                     </div>
                     <div className="bg-[#020204] p-3 rounded-xl border border-[#ffffff]/5">
                       <div className="text-slate-500 mb-0.5">P/L</div>
                       <div className={`text-xs ${inspectItem.pnl >= 0 ? "text-[#00ff87]" : "text-[#ff2a5f]"}`}>
                         {inspectItem.pnl >= 0 ? "+" : ""}{Number(inspectItem.pnl).toFixed(2)}
                       </div>
                     </div>
                   </div>
                   
                   <div className="mb-6">
                     <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-0.5">Estimated Value</div>
                     <div className="text-3xl font-heading font-bold text-[#00ff87]">${Number(inspectItem.currentValue).toFixed(2)}</div>
                   </div>

                   <div className="flex gap-3">
                     {inspectItem.isListed ? (
                       <div className="flex-1 text-center text-xs font-heading font-bold uppercase tracking-wider text-[#00f0ff] bg-[#00f0ff]/10 py-3 rounded-lg border border-[#00f0ff]/20">
                         Listed on Market
                       </div>
                     ) : (
                       <div className="flex-1">
                         <SellForm skinId={inspectItem.skin.id} suggestedPrice={inspectItem.currentValue} />
                       </div>
                     )}
                     <Link href="/upgrade" className="flex items-center justify-center gap-1.5 px-4 py-3 bg-[#020204] border border-[#ffffff]/5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-white hover:border-[#a100ff]/30 transition-colors">
                       <Zap className="size-4 text-[#ffaa00]" />
                     </Link>
                   </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#020204]/90 backdrop-blur-xl p-4" 
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl border border-[#ffffff]/5 bg-[#05050a] p-6 shadow-2xl" 
            >
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-heading text-lg font-bold uppercase text-white flex items-center gap-2">
                   <LinkIcon className="size-5 text-[#a100ff]" /> Trade Settings
                 </h3>
                 <button onClick={() => setShowSettings(false)} className="text-slate-600 hover:text-white transition-colors">
                   <X className="size-5" />
                 </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500 mb-2 block">Steam Trade URL</label>
                  <input 
                    type="text" 
                    placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..." 
                    value={tradeUrl}
                    onChange={(e) => setTradeUrl(e.target.value)}
                    className="w-full bg-[#020204] border border-[#ffffff]/5 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#a100ff]/50 transition-colors"
                  />
                  <div className="mt-2 text-[10px] text-slate-500">
                    Find your Trade URL in Steam &gt; Inventory &gt; Trade Offers &gt; Who can send me Trade Offers?
                  </div>
                </div>

                <button 
                  onClick={handleSaveUrl}
                  className="w-full py-3 bg-gradient-to-r from-[#a100ff] to-[#00f0ff] rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white hover:opacity-90 transition-opacity mt-4"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
