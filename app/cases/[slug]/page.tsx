"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Package, Sparkles, Shield } from "lucide-react";

interface SkinDrop {
  id: string;
  name: string;
  rarity: string;
  image: string;
  price: number;
}

const RARITY_COLORS: Record<string, string> = {
  "Covert": "border-[#FF4040] bg-[#FF4040]/10 text-[#FF4040]",
  "Classified": "border-[#d32ce6] bg-[#d32ce6]/10 text-[#d32ce6]",
  "Restricted": "border-[#8847ff] bg-[#8847ff]/10 text-[#8847ff]",
  "Mil-Spec": "border-[#4b69ff] bg-[#4b69ff]/10 text-[#4b69ff]",
  "Industrial Grade": "border-[#b0c3d9] bg-[#b0c3d9]/10 text-[#b0c3d9]",
  "Consumer Grade": "border-slate-400 bg-slate-400/10 text-slate-400",
};

const MOCK_ITEMS: SkinDrop[] = [
  { id: "1", name: "AWP | Dragon Lore", rarity: "Covert", image: "", price: 4500 },
  { id: "2", name: "AK-47 | Fire Serpent", rarity: "Covert", image: "", price: 1200 },
  { id: "3", name: "M4A4 | Howl", rarity: "Covert", image: "", price: 3800 },
  { id: "4", name: "Desert Eagle | Blaze", rarity: "Classified", image: "", price: 450 },
  { id: "5", name: "Glock-18 | Fade", rarity: "Classified", image: "", price: 800 },
  { id: "6", name: "USP-S | Kill Confirmed", rarity: "Restricted", image: "", price: 150 },
  { id: "7", name: "P250 | Asiimov", rarity: "Restricted", image: "", price: 20 },
  { id: "8", name: "MAC-10 | Neon Rider", rarity: "Mil-Spec", image: "", price: 15 },
  { id: "9", name: "MP9 | Bulldozer", rarity: "Mil-Spec", image: "", price: 5 },
  { id: "10", name: "Nova | Gila", rarity: "Industrial Grade", image: "", price: 1 },
];

function generateRouletteStrip(winningItem: SkinDrop) {
  // Generate 60 items, winning item is at index 50
  const strip = [];
  for (let i = 0; i < 60; i++) {
    if (i === 50) {
      strip.push(winningItem);
    } else {
      // Pick a random item heavily weighted towards lower rarities
      const rand = Math.random();
      let picked;
      if (rand < 0.7) picked = MOCK_ITEMS.filter(i => ["Mil-Spec", "Industrial Grade", "Consumer Grade"].includes(i.rarity));
      else if (rand < 0.9) picked = MOCK_ITEMS.filter(i => ["Restricted", "Classified"].includes(i.rarity));
      else picked = MOCK_ITEMS.filter(i => i.rarity === "Covert");
      
      if (!picked.length) picked = MOCK_ITEMS;
      strip.push(picked[Math.floor(Math.random() * picked.length)]);
    }
  }
  return strip;
}

export default function CaseOpeningPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [isOpening, setIsOpening] = useState(false);
  const [result, setResult] = useState<SkinDrop | null>(null);
  const [rouletteItems, setRouletteItems] = useState<SkinDrop[]>([]);
  const [offset, setOffset] = useState(0);
  
  const stripRef = useRef<HTMLDivElement>(null);
  const ITEM_WIDTH = 156; // 140px width + 16px gap

  useEffect(() => {
    // Initial strip for display before opening
    setRouletteItems(generateRouletteStrip(MOCK_ITEMS[0]));
    setOffset(0);
  }, []);

  const handleOpen = () => {
    if (isOpening) return;
    
    // Simulate API call to get result
    setIsOpening(true);
    setResult(null);
    setOffset(0); // Reset position instantly
    
    // Pick a random winner for demo
    const winner = MOCK_ITEMS[Math.floor(Math.random() * MOCK_ITEMS.length)];
    const newStrip = generateRouletteStrip(winner);
    setRouletteItems(newStrip);

    // Give React a tick to render new strip at offset 0
    setTimeout(() => {
      // Calculate target offset
      // Target index is 50. We want index 50 to land exactly in the center of the viewport
      // Viewport width is container width.
      const containerWidth = stripRef.current?.parentElement?.clientWidth || 800;
      const centerPos = containerWidth / 2;
      
      // We want the center of item 50 to be at centerPos
      // Center of item 50 = (50 * ITEM_WIDTH) + (140 / 2)
      // So offset = Center of item 50 - centerPos
      
      // Add a slight random jitter so it doesn't land exactly center every time
      const jitter = (Math.random() - 0.5) * 100; 
      
      const targetOffset = (50 * ITEM_WIDTH) + 70 - centerPos + jitter;
      setOffset(-targetOffset);

      // Animation takes 6 seconds
      setTimeout(() => {
        setResult(winner);
        setIsOpening(false);
      }, 6500);
    }, 50);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header Navigation */}
      <Link href="/cases" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 font-heading font-bold uppercase tracking-wider text-xs">
        <ArrowLeft className="size-4" /> Back to Cases
      </Link>

      <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#00f0ff] mb-2 font-heading font-bold tracking-wider text-[10px] px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30">
            <Package className="size-3" /> OFFICIAL CASE
          </div>
          <h1 className="font-heading text-4xl font-extrabold text-white tracking-tight uppercase">
            {slug.replace("-", " ")}
          </h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-heading font-bold text-slate-400">
          <Shield className="size-4 text-purple-400" /> Provably Fair Enabled
        </div>
      </div>

      {/* ROULETTE SECTION */}
      <div className="relative mb-16">
        {/* Pointer line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-[#00f0ff] z-20 shadow-[0_0_15px_#00f0ff]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-[#00f0ff]" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-[#00f0ff]" />
        </div>

        {/* Roulette Track Container */}
        <div className="overflow-hidden bg-[#020204] border-y border-white/10 py-8 relative">
          {/* Edge gradients to fade out sides */}
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-[#020204] to-transparent z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#020204] to-transparent z-10" />

          {/* Scrolling Strip */}
          <div 
            ref={stripRef}
            className="flex gap-4 px-[50vw]"
            style={{ 
              transform: `translateX(${offset}px)`,
              transition: isOpening ? 'transform 6s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none'
            }}
          >
            {rouletteItems.map((item, i) => {
              const rColor = RARITY_COLORS[item.rarity] || RARITY_COLORS["Mil-Spec"];
              return (
                <div 
                  key={i} 
                  className={`w-[140px] shrink-0 h-40 bg-[#05050a] border-t-2 ${rColor.split(' ')[0]} rounded-lg p-3 flex flex-col items-center justify-between relative`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${rColor.split(' ')[1]} to-transparent opacity-20 pointer-events-none rounded-lg`} />
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center relative z-10">
                     <div className={`text-3xl font-heading font-bold opacity-30 ${rColor.split(' ')[2]}`}>{item.name[0]}</div>
                  </div>
                  <div className="text-center relative z-10 w-full">
                    <div className="text-[9px] text-slate-500 font-bold truncate">{item.name.split('|')[0]}</div>
                    <div className="text-xs font-bold text-white truncate">{item.name.split('|')[1]?.trim() || item.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleOpen}
            disabled={isOpening}
            className={`px-12 py-4 rounded-2xl font-heading font-bold uppercase tracking-widest transition-all ${
              isOpening 
                ? "bg-[#05050a] border border-white/5 text-slate-600 cursor-not-allowed" 
                : "bg-gradient-to-r from-[#00f0ff] to-[#a100ff] text-white hover:scale-105 shadow-[0_0_30px_rgba(0,240,255,0.3)] glow-blue"
            }`}
          >
            {isOpening ? "Opening..." : "Unlock Case — $9.99"}
          </button>
        </div>
      </div>

      {/* Case Contents Grid */}
      <div className="bg-[#05050a] border border-white/5 rounded-3xl p-8">
        <h2 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Sparkles className="size-4 text-[#ffaa00]" /> What&apos;s Inside
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {MOCK_ITEMS.map((item, i) => {
            const rColor = RARITY_COLORS[item.rarity] || RARITY_COLORS["Mil-Spec"];
            return (
              <div key={i} className="bg-[#020204] border border-white/5 rounded-xl p-3 relative group hover:border-white/20 transition-colors">
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${rColor.split(' ')[0]} border-t-2`} />
                <div className="h-24 flex items-center justify-center mb-2">
                   <div className={`text-4xl font-heading font-bold opacity-10 ${rColor.split(' ')[2]}`}>{item.name[0]}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-bold truncate">{item.name.split('|')[0]}</div>
                <div className="text-xs font-bold text-white truncate">{item.name.split('|')[1]?.trim() || item.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {result && !isOpening && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#020204]/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="w-full max-w-xl text-center"
            >
              <div className="mb-4 text-[#00ff87] text-sm font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                <Sparkles className="size-4" /> Item Unlocked
              </div>
              
              <div className={`inline-block mb-8 rounded-full px-4 py-1 border ${RARITY_COLORS[result.rarity]}`}>
                <span className="text-xs font-heading font-bold uppercase tracking-wider">{result.rarity}</span>
              </div>

              <h2 className="text-4xl font-extrabold text-white mb-2">{result.name}</h2>
              <div className="text-3xl font-heading font-bold text-[#00ff87] mb-12">${result.price.toFixed(2)}</div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => setResult(null)} className="w-full sm:w-auto px-8 py-3 bg-[#020204] border border-white/10 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white hover:border-white/30 transition-colors">
                  Close
                </button>
                <button onClick={() => { setResult(null); handleOpen(); }} className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#00f0ff] to-[#a100ff] rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white hover:opacity-90 transition-opacity">
                  Open Another ($9.99)
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                 <div className="text-[10px] text-slate-500 font-mono">
                   Server Seed: a8f9...b2e • Client Seed: d1c4...9a2 • Roll: {Math.floor(Math.random() * 100000)}
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
