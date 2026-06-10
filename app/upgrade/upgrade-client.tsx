/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
"use client";

import { useState, useEffect } from "react";
import { Zap, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InventoryItem {
  id: string; skinId: string; currentValue: number;
  skin: { id: string; name: string; image: string; rarity: string; category: string; exterior: string };
}
interface TargetSkin { id: string; name: string; image: string; price: number; rarity: string; category: string; }
interface UpgradeResult {
  result: "WIN" | "LOSE"; roll: number; chance: number; multiplier: number;
  serverSeedHash: string; serverSeed: string; clientSeed: string; nonce: number;
  inputItem: { name: string; value: number }; targetItem: { name: string; value: number };
}

export default function UpgradePageClient({ initialInventory, initialTargets, initialHistory = [] }: { initialInventory: InventoryItem[], initialTargets: TargetSkin[], initialHistory?: unknown[] }) {
  const [selectedInput, setSelectedInput] = useState<InventoryItem | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<TargetSkin | null>(null);
  const [calculation, setCalculation] = useState<{ chance: number; multiplier: number; isValid: boolean; expectedValue: number } | null>(null);
  const [result, setResult] = useState<UpgradeResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gaugeValue, setGaugeValue] = useState(0);
  const [clientSeed, setClientSeed] = useState("");
  const [searchInv, setSearchInv] = useState("");
  const [searchTarget, setSearchTarget] = useState("");

  useEffect(() => { setClientSeed(Math.random().toString(36).substring(2, 18)); }, []);

  useEffect(() => {
    if (selectedInput && selectedTarget) {
      fetch("/api/upgrade/calculate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputItemId: selectedInput.id, targetItemId: selectedTarget.id }),
      }).then(r => r.json()).then(setCalculation).catch(() => {});
    } else { setCalculation(null); }
  }, [selectedInput, selectedTarget]);

  const handleUpgrade = async () => {
    if (!selectedInput || !selectedTarget || isSpinning) return;
    setIsSpinning(true); setResult(null);

    // Initial spin animation for suspense
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15;
      if (current > 100) current = Math.random() * 100;
      setGaugeValue(current);
    }, 50);

    try {
      const res = await fetch("/api/upgrade/execute", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputItemId: selectedInput.id, targetItemId: selectedTarget.id, clientSeed }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        clearInterval(interval); setIsSpinning(false);
        alert(data.error || "Failed to execute upgrade"); return;
      }

      setTimeout(() => {
        clearInterval(interval);
        setGaugeValue(data.roll || 0);
        setTimeout(() => { setResult(data); setIsSpinning(false); }, 1000);
      }, 3000);
    } catch {
      clearInterval(interval); setIsSpinning(false); alert("An unexpected error occurred");
    }
  };

  const chancePercent = calculation?.chance ?? 0;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = isSpinning 
    ? circumference - (gaugeValue / 100) * circumference 
    : circumference - (chancePercent / 100) * circumference;

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffaa00]/10 flex items-center justify-center border border-[#ffaa00]/20 glow-gold">
            <Zap className="size-5 text-[#ffaa00]" />
          </div>
          <div>
            <h1 className="font-heading text-4xl font-extrabold text-white tracking-tight uppercase">UPGRADE MACHINE</h1>
            <p className="text-slate-500 text-sm font-medium">Multiply your inventory value with provably fair odds.</p>
          </div>
        </div>
      </div>

      {/* TOP VISUALIZER SECTION (Cyberpunk Casino Feeling) */}
      <div className="premium-glass mb-12 overflow-hidden rounded-3xl border border-[#a100ff]/20 shadow-lg relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(161,0,255,0.1)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center py-16 px-8 relative z-10 gap-12">
          
          {/* Left Pedestal (Input) */}
          <div className="flex flex-col items-center justify-center relative">
            <motion.div 
              animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative mb-8 h-48 w-48 flex items-center justify-center"
            >
              <div className="absolute bottom-0 h-8 w-40 rounded-[100%] bg-[#00f0ff]/10 blur-xl" />
              {selectedInput ? (
                <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={selectedInput.skin.image} alt={selectedInput.skin.name} className="relative z-10 max-h-full max-w-full drop-shadow-[0_10px_20px_rgba(0,240,255,0.3)]" />
              ) : (
                <div className="relative z-10 w-24 h-24 bg-[#020204] border border-[#ffffff]/5 rounded-2xl flex items-center justify-center">
                  <span className="text-xs font-heading font-bold text-slate-700">SELECT INPUT</span>
                </div>
              )}
            </motion.div>
            {selectedInput ? (
               <div className="text-center bg-[#020204] rounded-xl px-6 py-2.5 border border-[#ffffff]/5 shadow-lg">
                 <div className="text-[10px] font-heading font-bold text-slate-600 uppercase tracking-wider mb-0.5">Your Item</div>
                 <div className="text-[#00f0ff] font-heading font-bold text-xl">${selectedInput.currentValue.toFixed(2)}</div>
               </div>
            ) : (
               <div className="bg-[#020204] rounded-xl px-6 py-3 border border-[#ffffff]/5 text-xs font-heading font-bold text-slate-600 uppercase tracking-wider">Awaiting Input</div>
            )}
          </div>

          {/* Center Machine / Gauge */}
          <div className="flex flex-col items-center justify-center relative z-20">
             <div className="relative w-64 h-64 flex items-center justify-center">
               {/* Decorative outer rings */}
               <div className="absolute inset-0 rounded-full border border-dashed border-[#ffffff]/5 animate-[spin_30s_linear_infinite]" />
               <div className="absolute inset-4 rounded-full border border-[#ffffff]/5" />
               
               {/* SVG Gauge */}
               <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="128" cy="128" r="100" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="8" />
                 <motion.circle 
                   cx="128" cy="128" r="100" fill="transparent" 
                   stroke="url(#upgrade-gradient)" strokeWidth="8" strokeLinecap="round"
                   strokeDasharray={circumference}
                   animate={{ strokeDashoffset }}
                   transition={isSpinning ? { duration: 0.1 } : { duration: 1, ease: "easeOut" }}
                   className="drop-shadow-[0_0_15px_rgba(161,0,255,0.5)]"
                 />
                 <defs>
                   <linearGradient id="upgrade-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#a100ff" />
                     <stop offset="100%" stopColor="#00f0ff" />
                   </linearGradient>
                 </defs>
               </svg>

               {/* Center Value */}
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020204] rounded-full m-8 border border-[#ffffff]/5 shadow-inner">
                  <div className="text-[10px] font-heading font-bold text-slate-600 uppercase tracking-wider mb-0.5">Chance</div>
                  <motion.div 
                    className="font-heading text-4xl font-extrabold text-white"
                  >
                    {isSpinning ? gaugeValue.toFixed(1) : chancePercent.toFixed(1)}%
                  </motion.div>
                  {calculation?.multiplier && !isSpinning && (
                    <div className="mt-1 text-[10px] font-heading font-bold text-[#a100ff] bg-[#a100ff]/10 px-2 py-0.5 rounded-full border border-[#a100ff]/20">
                      {calculation.multiplier}x
                    </div>
                  )}
               </div>
             </div>

             <button 
               onClick={handleUpgrade}
               disabled={!selectedInput || !selectedTarget || isSpinning || !calculation?.isValid}
               className={`mt-8 relative group overflow-hidden flex w-full max-w-[240px] items-center justify-center gap-3 rounded-xl py-4 text-xs font-heading font-bold uppercase tracking-wider text-white transition-all ${(!selectedInput || !selectedTarget || isSpinning || !calculation?.isValid) ? 'opacity-50 bg-[#05050a] border border-[#ffffff]/5' : 'bg-gradient-to-r from-[#a100ff] to-[#00f0ff] glow-purple hover:scale-105'}`}
             >
               <Zap className={`size-4 ${selectedInput && selectedTarget && calculation?.isValid && !isSpinning ? 'animate-pulse' : ''}`} /> 
               {isSpinning ? "Upgrading..." : "Execute Upgrade"}
             </button>
          </div>

          {/* Right Pedestal (Target) */}
          <div className="flex flex-col items-center justify-center relative">
            <motion.div 
              animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="relative mb-8 h-48 w-48 flex items-center justify-center"
            >
              <div className="absolute bottom-0 h-8 w-40 rounded-[100%] bg-[#a100ff]/10 blur-xl" />
              {selectedTarget ? (
                <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={selectedTarget.image} alt={selectedTarget.name} className="relative z-10 max-h-full max-w-full drop-shadow-[0_10px_20px_rgba(161,0,255,0.3)]" />
              ) : (
                <div className="relative z-10 w-24 h-24 bg-[#020204] border border-[#ffffff]/5 rounded-2xl flex items-center justify-center">
                  <span className="text-xs font-heading font-bold text-slate-700">SELECT TARGET</span>
                </div>
              )}
            </motion.div>
            {selectedTarget ? (
               <div className="text-center bg-[#020204] rounded-xl px-6 py-2.5 border border-[#ffffff]/5 shadow-lg">
                 <div className="text-[10px] font-heading font-bold text-slate-600 uppercase tracking-wider mb-0.5">Target Item</div>
                 <div className="text-[#a100ff] font-heading font-bold text-xl">${selectedTarget.price.toFixed(2)}</div>
               </div>
            ) : (
               <div className="bg-[#020204] rounded-xl px-6 py-3 border border-[#ffffff]/5 text-xs font-heading font-bold text-slate-600 uppercase tracking-wider">Select Target</div>
            )}
          </div>
        </div>
      </div>

      {/* PANELS */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Inventory Panel */}
        <div className="bg-[#05050a] border border-[#ffffff]/5 flex flex-col overflow-hidden rounded-3xl h-[500px]">
          <div className="p-5 border-b border-[#ffffff]/5 flex flex-col gap-4">
            <h2 className="text-sm font-heading font-bold text-white uppercase tracking-wider">Your Inventory</h2>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
              <input type="text" placeholder="Search items..." className="w-full rounded-xl bg-[#020204] border border-[#ffffff]/5 py-2.5 pl-11 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/30" value={searchInv} onChange={(e) => setSearchInv(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
             {initialInventory.filter(item => item.skin.name.toLowerCase().includes(searchInv.toLowerCase())).length > 0 ? (
             <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
                 {initialInventory.filter(item => item.skin.name.toLowerCase().includes(searchInv.toLowerCase())).map(item => (
                   <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={item.id} onClick={() => setSelectedInput(item)}
                     className={`group relative flex flex-col items-center rounded-xl bg-[#020204] p-3 transition-all border ${selectedInput?.id === item.id ? 'border-[#00f0ff]/30 bg-[#00f0ff]/5' : 'border-[#ffffff]/5 hover:border-[#ffffff]/10'}`}>
                     <div className="relative flex h-20 w-full items-center justify-center mb-2">
                       <img src={item.skin.image} alt={item.skin.name} className="max-h-full max-w-full drop-shadow-md" />
                     </div>
                     <div className="w-full text-center">
                       <div className="text-[9px] font-heading font-bold text-slate-600 uppercase tracking-wider">{item.skin.exterior}</div>
                       <div className="text-xs font-bold text-white truncate my-0.5">{item.skin.name}</div>
                       <div className="text-xs font-heading font-bold text-[#00f0ff]">${item.currentValue.toFixed(2)}</div>
                     </div>
                   </motion.button>
                 ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                 <p className="text-sm font-heading font-bold text-white">No Items</p>
                 <p className="text-xs text-slate-600 mt-1">Your inventory is empty or no items match your search.</p>
               </div>
             )}
          </div>
        </div>

        {/* Targets Panel */}
        <div className="bg-[#05050a] border border-[#ffffff]/5 flex flex-col overflow-hidden rounded-3xl h-[500px]">
          <div className="p-5 border-b border-[#ffffff]/5 flex flex-col gap-4">
            <h2 className="text-sm font-heading font-bold text-white uppercase tracking-wider">Select Target</h2>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
              <input type="text" placeholder="Search target skins..." className="w-full rounded-xl bg-[#020204] border border-[#ffffff]/5 py-2.5 pl-11 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#a100ff]/30" value={searchTarget} onChange={(e) => setSearchTarget(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
             <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
               {initialTargets.filter(item => item.name.toLowerCase().includes(searchTarget.toLowerCase())).map(item => (
                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={item.id} onClick={() => setSelectedTarget(item)}
                   className={`group relative flex flex-col items-center rounded-xl bg-[#020204] p-3 transition-all border ${selectedTarget?.id === item.id ? 'border-[#a100ff]/30 bg-[#a100ff]/5' : 'border-[#ffffff]/5 hover:border-[#ffffff]/10'}`}>
                   <div className="relative flex h-20 w-full items-center justify-center mb-2">
                     <img src={item.image} alt={item.name} className="max-h-full max-w-full drop-shadow-md" />
                   </div>
                   <div className="w-full text-center">
                     <div className="text-[9px] font-heading font-bold text-slate-600 uppercase tracking-wider">{item.category}</div>
                     <div className="text-xs font-bold text-white truncate my-0.5">{item.name}</div>
                     <div className="text-xs font-heading font-bold text-[#a100ff]">${item.price.toFixed(2)}</div>
                   </div>
                 </motion.button>
               ))}
             </div>
          </div>
        </div>
      {/* History Panel */}
      <div className="mt-8 bg-[#05050a] border border-[#ffffff]/5 overflow-hidden rounded-3xl">
        <div className="p-5 border-b border-[#ffffff]/5">
          <h2 className="text-sm font-heading font-bold text-white uppercase tracking-wider">Recent Upgrades</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-[#020204]">
                <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500">Player</th>
                <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500">Input</th>
                <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500">Target</th>
                <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 text-center">Chance</th>
                <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 text-center">Roll</th>
                <th className="px-6 py-4 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff]/5">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(initialHistory as any[]).map((entry, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                        {entry.user.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-white">{entry.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img src={entry.input.image} alt={entry.input.name} className="w-8 h-8 object-contain" />
                      <div>
                        <div className="text-xs font-bold text-slate-300 truncate max-w-[150px]">{entry.input.name}</div>
                        <div className="text-[10px] text-slate-500">${entry.input.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img src={entry.target.image} alt={entry.target.name} className="w-8 h-8 object-contain" />
                      <div>
                        <div className="text-xs font-bold text-slate-300 truncate max-w-[150px]">{entry.target.name}</div>
                        <div className="text-[10px] text-[#a100ff]">${entry.target.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-white">{entry.chance}%</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-white">{entry.roll.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {entry.status === 'win' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#00f0ff]/10 text-[#00f0ff] text-[10px] font-heading font-bold uppercase">
                        WIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#ff2a5f]/10 text-[#ff2a5f] text-[10px] font-heading font-bold uppercase">
                        LOSE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#020204]/90 backdrop-blur-xl" 
            onClick={() => setResult(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className={`mx-4 w-full max-w-md rounded-3xl border p-10 text-center relative overflow-hidden ${
              result.result === "WIN" ? "border-[#00f0ff]/30 bg-[#05050a] shadow-lg" : "border-[#ff2a5f]/30 bg-[#05050a] shadow-lg"
            }`} onClick={e => e.stopPropagation()}>
              
              {result.result === "WIN" && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)] pointer-events-none" />
              )}

              <div className="relative z-10">
                <motion.div 
                  animate={result.result === "WIN" ? { rotate: [0, 10, -10, 0] } : { scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 text-6xl"
                >
                  {result.result === "WIN" ? "🎉" : "💥"}
                </motion.div>
                
                <h2 className={`font-heading text-3xl font-extrabold uppercase tracking-tight mb-2 ${result.result === "WIN" ? "text-[#00f0ff]" : "text-[#ff2a5f]"}`}>
                  {result.result === "WIN" ? "UPGRADE SUCCESS" : "UPGRADE FAILED"}
                </h2>
                
                <div className="my-6">
                  {result.result === "WIN" ? (
                    <div className="flex justify-center mb-4">
                      <motion.img 
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                        src={selectedTarget?.image} className="w-40 h-40 object-contain drop-shadow-[0_10px_20px_rgba(0,240,255,0.3)]" 
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center mb-4 opacity-20 grayscale blur-[1px]">
                       <img src={selectedInput?.skin.image} className="w-40 h-40 object-contain" />
                    </div>
                  )}
                  <p className="text-base text-white font-bold">
                    {result.result === "WIN"
                      ? `Acquired ${result.targetItem.name}`
                      : `${result.inputItem.name} destroyed`}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 font-heading font-bold">${result.result === "WIN" ? result.targetItem.value.toFixed(2) : '0.00'}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px] font-heading font-bold text-slate-600 bg-[#020204] p-4 rounded-xl mb-6 border border-[#ffffff]/5 text-left">
                   <div>Roll: <span className="text-white">{result.roll.toFixed(2)}</span></div>
                   <div>Chance: <span className="text-white">{result.chance.toFixed(2)}%</span></div>
                   <div className="col-span-2 truncate">Hash: <span className="text-white">{result.serverSeedHash.substring(0, 20)}...</span></div>
                </div>

                <button onClick={() => setResult(null)}
                  className="px-6 py-3 bg-[#020204] border border-[#ffffff]/5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-white hover:border-[#00f0ff]/30 transition-colors w-full">
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
