"use client";

import { useState } from "react";
import { ArrowRight, Flame, Plus, Sparkles, X, Zap, Atom } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ContractItem {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: "Mil-Spec" | "Restricted" | "Classified" | "Covert";
  wear: string;
}

const MOCK_INVENTORY: ContractItem[] = [
  { id: "1", name: "AK-47 | Redline", image: "/skins/ak-47-redline.png", price: 45.5, rarity: "Classified", wear: "FT" },
  { id: "2", name: "M4A4 | Asiimov", image: "/skins/m4a4-asiimov.png", price: 120.0, rarity: "Classified", wear: "FT" },
  { id: "3", name: "AWP | Neo-Noir", image: "/skins/awp-neo-noir.png", price: 85.0, rarity: "Classified", wear: "MW" },
  { id: "4", name: "Glock-18 | Water Elemental", image: "/skins/glock-18-water-elemental.png", price: 12.0, rarity: "Classified", wear: "FN" },
  { id: "5", name: "USP-S | Kill Confirmed", image: "/skins/usps-kill-confirmed.png", price: 150.0, rarity: "Covert", wear: "FT" },
  { id: "6", name: "Desert Eagle | Printstream", image: "/skins/deagle-printstream.png", price: 90.0, rarity: "Covert", wear: "MW" },
];

const RARITY_COLORS: Record<string, string> = {
  "Mil-Spec": "text-blue-500",
  "Restricted": "text-purple-500",
  "Classified": "text-[#ff2a5f]",
  "Covert": "text-red-500",
};

export default function ContractsPage() {
  const [selectedItems, setSelectedItems] = useState<ContractItem[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ContractItem | null>(null);

  const addItem = (item: ContractItem) => {
    if (selectedItems.length < 10 && !selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter((i) => i.id !== id));
  };

  const handleExecute = () => {
    if (selectedItems.length !== 10) return;
    setIsExecuting(true);
    setResult(null);

    setTimeout(() => {
      setIsExecuting(false);
      setResult({
        id: "result-1",
        name: "AWP | Dragon Lore",
        image: "/skins/awp-dragon-lore.png",
        price: 4500.0,
        rarity: "Covert",
        wear: "FN",
      });
      setSelectedItems([]);
    }, 3000);
  };

  const totalValue = selectedItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ff2a5f]/30 bg-[#ff2a5f]/10 px-6 py-2 text-xs font-heading font-bold uppercase tracking-wider text-[#ff2a5f] backdrop-blur-md"
        >
          <Sparkles className="size-3" /> Trade-up
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="font-heading text-6xl uppercase tracking-tighter text-white font-extrabold mb-4"
        >
          FUSION <span className="bg-gradient-to-r from-[#ff2a5f] to-[#ffaa00] bg-clip-text text-transparent">LAB</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-slate-400 font-medium"
        >
          Exchange 10 skins of the same rarity for 1 skin of a higher rarity.
        </motion.p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Side: Inventory */}
        <div className="bg-[#05050a] border border-[#ffffff]/5 flex h-[600px] flex-col rounded-3xl p-6">
          <h2 className="mb-4 text-sm font-heading font-bold text-white uppercase tracking-wider">Your Inventory</h2>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {MOCK_INVENTORY.map((item) => {
              const isSelected = selectedItems.some((i) => i.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => !isSelected && addItem(item)}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-3 transition-all ${
                    isSelected
                      ? "border-[#ff2a5f]/30 bg-[#ff2a5f]/5 opacity-50"
                      : "border-[#ffffff]/5 bg-[#020204] hover:border-[#ffffff]/10"
                  }`}
                >
                  <div className="relative h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-[#ffffff]/5 to-transparent p-2">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image src={item.image} alt={item.name} width={40} height={40} className="object-contain drop-shadow-md" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate text-xs font-bold text-white">{item.name}</div>
                    <div className={`text-[10px] font-heading font-bold uppercase tracking-wider ${RARITY_COLORS[item.rarity]}`}>{item.rarity}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-heading font-bold text-white">${item.price.toFixed(2)}</div>
                    <div className="text-[10px] font-heading font-bold text-slate-600 uppercase tracking-wider">{item.wear}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Contract Circle */}
        <div className="bg-[#05050a] border border-[#ffffff]/5 relative flex h-[600px] flex-col items-center justify-center rounded-3xl p-6 lg:col-span-2 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,42,95,0.05),transparent_70%)]" />

          {/* Contract pentagon/circle layout */}
          <div className="relative flex h-[350px] w-[350px] items-center justify-center">
            {/* Center Info */}
            <div className="absolute z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#020204] border border-[#ff2a5f]/20 shadow-[0_0_30px_rgba(255,42,95,0.1)]">
              <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-0.5">Total Value</div>
              <div className="text-xl font-heading font-bold text-[#ff2a5f]">${totalValue.toFixed(2)}</div>
              <div className="mt-1 text-[10px] font-heading font-bold text-white bg-[#ffffff]/5 px-2 py-0.5 rounded-full border border-[#ffffff]/10">{selectedItems.length} / 10</div>
            </div>

            {/* Slots */}
            {Array.from({ length: 10 }).map((_, i) => {
              const angle = (i * 360) / 10;
              const radius = 130;
              const x = Math.sin((angle * Math.PI) / 180) * radius;
              const y = -Math.cos((angle * Math.PI) / 180) * radius;
              const item = selectedItems[i];

              return (
                <div
                  key={i}
                  className="absolute flex h-14 w-14 items-center justify-center rounded-xl border border-[#ffffff]/5 bg-[#020204] shadow-lg backdrop-blur-md transition-all hover:scale-110"
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                >
                  {item ? (
                    <div className="relative h-full w-full group">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute -right-1.5 -top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-[#ff2a5f] text-white shadow-md group-hover:flex"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <Plus className="size-4 text-slate-700" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <button
              onClick={handleExecute}
              disabled={selectedItems.length !== 10 || isExecuting}
              className={`relative overflow-hidden rounded-xl px-10 py-3 text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                selectedItems.length !== 10 || isExecuting 
                  ? "opacity-50 bg-[#020204] border border-[#ffffff]/5 text-slate-600" 
                  : "bg-gradient-to-r from-[#ff2a5f] to-[#ffaa00] text-white glow-purple hover:scale-105"
              }`}
            >
              {isExecuting ? (
                <span className="flex items-center gap-2">
                  <Atom className="size-4 animate-spin text-white" /> Fusing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Execute Contract <ArrowRight className="size-4" />
                </span>
              )}
            </button>
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
              className="mx-4 w-full max-w-md rounded-3xl border border-[#ff2a5f]/30 bg-[#05050a] p-10 text-center relative overflow-hidden shadow-lg" 
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,95,0.1)_0%,transparent_70%)] pointer-events-none" />

              <div className="relative z-10">
                <div className="mb-4 text-xs font-heading font-bold uppercase tracking-wider text-[#ff2a5f] flex items-center justify-center gap-2">
                  <Zap className="size-4" /> Fusion Complete
                </div>
                <h2 className="font-heading text-3xl font-extrabold text-white mb-4">{result.name}</h2>
                
                <div className="relative my-6 h-40 w-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,95,0.15),transparent_70%)]" />
                  <Image src={result.image} alt={result.name} width={160} height={160} className="object-contain drop-shadow-[0_10px_20px_rgba(255,255,255,0.1)]" />
                </div>

                <div className="mb-6 rounded-xl border border-[#ffffff]/5 bg-[#020204] px-6 py-3">
                  <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-0.5">Estimated Value</div>
                  <div className="text-2xl font-heading font-bold text-[#ffaa00]">${result.price.toFixed(2)}</div>
                </div>

                <button onClick={() => setResult(null)} className="px-6 py-3 bg-[#020204] border border-[#ffffff]/5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-white hover:border-[#ff2a5f]/30 transition-colors w-full">
                  Claim Item
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
