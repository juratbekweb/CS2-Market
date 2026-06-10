"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Plus, Sparkles, X, Zap, Atom, Info, RefreshCw, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContractItem {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: "Consumer Grade" | "Industrial Grade" | "Mil-Spec" | "Restricted" | "Classified" | "Covert";
  exterior: string;
  category: string;
}

const RARITY_COLORS: Record<string, { border: string; text: string; bg: string; glow: string }> = {
  "Consumer Grade":  { border: "border-slate-500/40", text: "text-slate-400", bg: "bg-slate-500/10", glow: "shadow-none" },
  "Industrial Grade":{ border: "border-[#b0c3d9]/40", text: "text-[#b0c3d9]", bg: "bg-[#b0c3d9]/10", glow: "shadow-none" },
  "Mil-Spec":        { border: "border-[#4b69ff]/60", text: "text-[#4b69ff]", bg: "bg-[#4b69ff]/10", glow: "shadow-[0_0_12px_rgba(75,105,255,0.2)]" },
  "Restricted":      { border: "border-[#8847ff]/60", text: "text-[#8847ff]", bg: "bg-[#8847ff]/10", glow: "shadow-[0_0_12px_rgba(136,71,255,0.2)]" },
  "Classified":      { border: "border-[#d32ce6]/60", text: "text-[#d32ce6]", bg: "bg-[#d32ce6]/10", glow: "shadow-[0_0_12px_rgba(211,44,230,0.2)]" },
  "Covert":          { border: "border-[#FF4040]/60", text: "text-[#FF4040]", bg: "bg-[#FF4040]/10", glow: "shadow-[0_0_12px_rgba(255,64,64,0.2)]" },
};

const RARITY_ORDER = ["Consumer Grade", "Industrial Grade", "Mil-Spec", "Restricted", "Classified", "Covert"];

const NEXT_RARITY: Record<string, string> = {
  "Consumer Grade": "Industrial Grade",
  "Industrial Grade": "Mil-Spec",
  "Mil-Spec": "Restricted",
  "Restricted": "Classified",
  "Classified": "Covert",
};

const MOCK_INVENTORY: ContractItem[] = [
  { id: "1", name: "AK-47 | Redline", image: "", price: 45.5, rarity: "Classified", exterior: "Field-Tested", category: "Rifle" },
  { id: "2", name: "M4A4 | Asiimov", image: "", price: 120.0, rarity: "Classified", exterior: "Field-Tested", category: "Rifle" },
  { id: "3", name: "AWP | Neo-Noir", image: "", price: 85.0, rarity: "Classified", exterior: "Minimal Wear", category: "Sniper" },
  { id: "4", name: "Glock-18 | Water Elemental", image: "", price: 12.0, rarity: "Restricted", exterior: "Factory New", category: "Pistol" },
  { id: "5", name: "USP-S | Kill Confirmed", image: "", price: 150.0, rarity: "Classified", exterior: "Field-Tested", category: "Pistol" },
  { id: "6", name: "Desert Eagle | Printstream", image: "", price: 90.0, rarity: "Classified", exterior: "Minimal Wear", category: "Pistol" },
  { id: "7", name: "P250 | Asiimov", image: "", price: 18.0, rarity: "Restricted", exterior: "Factory New", category: "Pistol" },
  { id: "8", name: "MP9 | Bulldozer", image: "", price: 5.5, rarity: "Mil-Spec", exterior: "Field-Tested", category: "SMG" },
  { id: "9", name: "Nova | Gila", image: "", price: 3.2, rarity: "Mil-Spec", exterior: "Battle-Scarred", category: "Shotgun" },
  { id: "10", name: "Tec-9 | Fuel Injector", image: "", price: 42.0, rarity: "Restricted", exterior: "Minimal Wear", category: "Pistol" },
  { id: "11", name: "M4A1-S | Icarus Fell", image: "", price: 11.0, rarity: "Restricted", exterior: "Well-Worn", category: "Rifle" },
  { id: "12", name: "Famas | Commemoration", image: "", price: 7.0, rarity: "Mil-Spec", exterior: "Factory New", category: "Rifle" },
];

const POSSIBLE_RESULTS: ContractItem[] = [
  { id: "r1", name: "AWP | Dragon Lore", image: "", price: 4500.0, rarity: "Covert", exterior: "Factory New", category: "Sniper" },
  { id: "r2", name: "M4A4 | Howl", image: "", price: 3800.0, rarity: "Covert", exterior: "Minimal Wear", category: "Rifle" },
  { id: "r3", name: "Karambit | Fade", image: "", price: 2200.0, rarity: "Covert", exterior: "Factory New", category: "Knife" },
  { id: "r4", name: "AK-47 | Fire Serpent", image: "", price: 1800.0, rarity: "Covert", exterior: "Field-Tested", category: "Rifle" },
];

function SkinPlaceholder({ rarity, name }: { rarity: string; name: string }) {
  const color = RARITY_COLORS[rarity] || RARITY_COLORS["Mil-Spec"];
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("");
  return (
    <div className={`w-full h-full flex items-center justify-center rounded-lg ${color.bg} border ${color.border}`}>
      <span className={`text-lg font-heading font-bold ${color.text}`}>{initials}</span>
    </div>
  );
}

export default function ContractsPage() {
  const [selectedItems, setSelectedItems] = useState<ContractItem[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ContractItem | null>(null);
  const [outputRarity, setOutputRarity] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"inventory" | "history">("inventory");
  const [contractHistory] = useState([
    { id: "h1", input: "10x Restricted skins", output: "AK-47 | Redline", value: 45.5, date: "2 hours ago", success: true },
    { id: "h2", input: "10x Mil-Spec skins", output: "M4A4 | Neo-Noir", value: 85.0, date: "5 hours ago", success: true },
    { id: "h3", input: "10x Classified skins", output: "Contract Failed", value: 0, date: "1 day ago", success: false },
  ]);
  const rotatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedItems.length === 0) { setOutputRarity(""); return; }
    const rarities = selectedItems.map(i => i.rarity);
    const allSame = rarities.every(r => r === rarities[0]);
    if (allSame) setOutputRarity(NEXT_RARITY[rarities[0]] || "");
    else setOutputRarity("");
  }, [selectedItems]);

  const addItem = (item: ContractItem) => {
    if (selectedItems.length < 10 && !selectedItems.find(i => i.id === item.id)) {
      setSelectedItems(prev => [...prev, item]);
    }
  };
  const removeItem = (id: string) => setSelectedItems(prev => prev.filter(i => i.id !== id));

  const canExecute = selectedItems.length === 10 && outputRarity !== "" && !isExecuting;
  const totalValue = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const avgValue = selectedItems.length > 0 ? totalValue / selectedItems.length : 0;

  const handleExecute = async () => {
    if (!canExecute) return;
    setIsExecuting(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 3200));
    const randomResult = POSSIBLE_RESULTS[Math.floor(Math.random() * POSSIBLE_RESULTS.length)];
    setResult(randomResult);
    setSelectedItems([]);
    setIsExecuting(false);
  };

  const filteredInventory = MOCK_INVENTORY.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRarity = selectedItems.length > 0 ? selectedItems[0].rarity : null;
  const primaryRarityColor = selectedRarity ? RARITY_COLORS[selectedRarity] : null;
  const outputRarityColor = outputRarity ? RARITY_COLORS[outputRarity] : null;

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ff2a5f]/30 bg-[#ff2a5f]/10 px-6 py-2 text-xs font-heading font-bold uppercase tracking-wider text-[#ff2a5f] backdrop-blur-md"
        >
          <Sparkles className="size-3" /> Trade-up Contracts
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
          Sacrifice 10 skins of the same rarity to forge 1 skin of a higher rarity. Higher input value = better output quality.
        </motion.p>
      </div>

      {/* Rarity Progression Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="mb-8 flex items-center justify-center gap-2 overflow-x-auto py-2"
      >
        {RARITY_ORDER.map((rarity, idx) => {
          const colors = RARITY_COLORS[rarity];
          const isActive = rarity === selectedRarity;
          const isOutput = rarity === outputRarity;
          return (
            <div key={rarity} className="flex items-center gap-2">
              <div className={`px-3 py-1.5 rounded-lg text-[10px] font-heading font-bold uppercase tracking-wider transition-all duration-300 border ${
                isOutput ? `${colors.bg} ${colors.border} ${colors.text} ${colors.glow} scale-110` :
                isActive ? `${colors.bg} ${colors.border} ${colors.text} opacity-100` :
                "border-white/5 text-slate-700 bg-transparent"
              }`}>
                {rarity}
              </div>
              {idx < RARITY_ORDER.length - 1 && (
                <ChevronRight className={`size-3 flex-shrink-0 ${
                  (RARITY_ORDER.indexOf(rarity) === RARITY_ORDER.indexOf(selectedRarity || "") ||
                   RARITY_ORDER.indexOf(rarity) < RARITY_ORDER.indexOf(outputRarity || "")) && selectedRarity
                    ? "text-white/40" : "text-white/10"
                }`} />
              )}
            </div>
          );
        })}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
        {/* LEFT: Inventory Panel */}
        <div className="flex flex-col gap-4">
          {/* Tab Switch */}
          <div className="flex bg-[#05050a] p-1 rounded-xl border border-white/5">
            {(["inventory", "history"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab ? "bg-gradient-to-r from-[#ff2a5f] to-[#ffaa00] text-white" : "text-slate-500 hover:text-white"
                }`}
              >
                {tab === "inventory" ? "My Inventory" : "History"}
              </button>
            ))}
          </div>

          {activeTab === "inventory" ? (
            <div className="bg-[#05050a] border border-white/5 rounded-3xl flex flex-col h-[600px] overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <div className="relative">
                  <input
                    type="text" placeholder="Search skins..."
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#020204] border border-white/5 rounded-xl py-2.5 pl-4 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#ff2a5f]/30 transition-colors"
                  />
                </div>
                {selectedRarity && (
                  <div className={`mt-2 px-3 py-1 rounded-lg text-[10px] font-heading font-bold uppercase tracking-wider ${primaryRarityColor?.bg} ${primaryRarityColor?.text} border ${primaryRarityColor?.border}`}>
                    Locked to: {selectedRarity} rarity
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredInventory.map(item => {
                  const isSelected = selectedItems.some(i => i.id === item.id);
                  const isWrongRarity = selectedRarity !== null && item.rarity !== selectedRarity;
                  const colors = RARITY_COLORS[item.rarity] || RARITY_COLORS["Mil-Spec"];
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={!isSelected && !isWrongRarity ? { x: 4 } : {}}
                      onClick={() => !isSelected && !isWrongRarity && addItem(item)}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-all cursor-pointer ${
                        isSelected ? `${colors.border} ${colors.bg} opacity-40` :
                        isWrongRarity ? "border-white/5 bg-[#020204] opacity-30 cursor-not-allowed" :
                        `border-white/5 bg-[#020204] hover:${colors.border} hover:${colors.bg}`
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden relative">
                        <SkinPlaceholder rarity={item.rarity} name={item.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{item.name}</div>
                        <div className={`text-[10px] font-heading font-bold uppercase tracking-wider ${colors.text}`}>{item.rarity}</div>
                        <div className="text-[10px] text-slate-600">{item.exterior}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-heading font-bold text-white">${item.price.toFixed(2)}</div>
                        {isSelected && <div className="text-[10px] text-[#ff2a5f] font-bold">SELECTED</div>}
                        {!isSelected && !isWrongRarity && <Plus className="size-4 text-slate-600 ml-auto" />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-[#05050a] border border-white/5 rounded-3xl flex flex-col h-[600px] overflow-hidden">
              <div className="p-4 border-b border-white/5">
                <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider">Contract History</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {contractHistory.map(h => (
                  <div key={h.id} className={`rounded-xl border p-4 ${h.success ? "border-[#00ff87]/20 bg-[#00ff87]/5" : "border-[#ff2a5f]/20 bg-[#ff2a5f]/5"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-white">{h.output}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{h.input}</div>
                        <div className="text-[10px] text-slate-600 mt-1">{h.date}</div>
                      </div>
                      <div className={`text-sm font-heading font-bold ${h.success ? "text-[#00ff87]" : "text-[#ff2a5f]"}`}>
                        {h.success ? `$${h.value.toFixed(2)}` : "Lost"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Contract Machine */}
        <div className="flex flex-col gap-6">
          {/* Selected Items Grid */}
          <div className="bg-[#05050a] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-heading font-bold text-white uppercase tracking-wider">Contract Slots</h2>
              <span className={`text-xs font-heading font-bold px-3 py-1 rounded-full border ${
                selectedItems.length === 10 ? "border-[#00ff87]/30 text-[#00ff87] bg-[#00ff87]/10" :
                "border-white/10 text-slate-500"
              }`}>{selectedItems.length} / 10</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => {
                const item = selectedItems[i];
                const colors = item ? (RARITY_COLORS[item.rarity] || RARITY_COLORS["Mil-Spec"]) : null;
                return (
                  <AnimatePresence key={i} mode="wait">
                    {item ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                        className={`relative aspect-square rounded-xl border ${colors!.border} ${colors!.bg} ${colors!.glow} group cursor-pointer`}
                        onClick={() => removeItem(item.id)}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-1 overflow-hidden rounded-xl">
                          <SkinPlaceholder rarity={item.rarity} name={item.name} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-[#ff2a5f]/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="size-5 text-white" />
                        </div>
                        <div className="absolute -bottom-0 left-0 right-0 text-center">
                          <span className="text-[8px] font-bold text-white/60 truncate block px-1">${item.price.toFixed(0)}</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`empty-${i}`}
                        className="aspect-square rounded-xl border border-dashed border-white/10 flex items-center justify-center"
                      >
                        <Plus className="size-5 text-white/20" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
          </div>

          {/* Contract Stats + Output Preview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#05050a] border border-white/5 rounded-2xl p-4 text-center">
              <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-1">Input Value</div>
              <div className="text-xl font-heading font-bold text-white">${totalValue.toFixed(2)}</div>
            </div>
            <div className="bg-[#05050a] border border-white/5 rounded-2xl p-4 text-center">
              <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-1">Avg. Value</div>
              <div className="text-xl font-heading font-bold text-[#ffaa00]">${avgValue.toFixed(2)}</div>
            </div>
            <div className={`rounded-2xl p-4 text-center border transition-all ${
              outputRarityColor ? `${outputRarityColor.bg} ${outputRarityColor.border} ${outputRarityColor.glow}` : "bg-[#05050a] border-white/5"
            }`}>
              <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-1">Output Rarity</div>
              <div className={`text-sm font-heading font-bold ${outputRarityColor ? outputRarityColor.text : "text-slate-600"}`}>
                {outputRarity || "—"}
              </div>
            </div>
          </div>

          {/* Output Preview */}
          {outputRarity && selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`bg-[#05050a] border rounded-3xl p-6 ${outputRarityColor?.border} ${outputRarityColor?.glow}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Info className="size-4 text-slate-500" />
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-400">Possible Output</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {POSSIBLE_RESULTS.map(r => (
                  <div key={r.id} className={`rounded-xl border p-3 text-center ${outputRarityColor?.border} ${outputRarityColor?.bg}`}>
                    <div className="w-12 h-12 rounded-lg mx-auto mb-2 overflow-hidden">
                      <SkinPlaceholder rarity={outputRarity} name={r.name} />
                    </div>
                    <div className="text-[10px] font-bold text-white truncate">{r.name.split("|")[1]?.trim()}</div>
                    <div className={`text-xs font-heading font-bold ${outputRarityColor?.text}`}>${r.price.toFixed(0)}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Warnings */}
          {selectedItems.length > 0 && !outputRarity && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ffaa00]/10 border border-[#ffaa00]/30">
              <Info className="size-4 text-[#ffaa00] shrink-0" />
              <span className="text-xs text-[#ffaa00] font-medium">All 10 skins must be the same rarity to execute a contract.</span>
            </div>
          )}

          {/* Execute Button */}
          <div className="relative" ref={rotatingRef}>
            <motion.button
              onClick={handleExecute}
              disabled={!canExecute}
              whileHover={canExecute ? { scale: 1.02 } : {}}
              whileTap={canExecute ? { scale: 0.98 } : {}}
              className={`relative overflow-hidden rounded-2xl w-full py-5 text-sm font-heading font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${
                canExecute
                  ? "bg-gradient-to-r from-[#ff2a5f] to-[#ffaa00] text-white shadow-[0_0_30px_rgba(255,42,95,0.3)]"
                  : "opacity-40 bg-[#020204] border border-white/5 text-slate-600"
              }`}
            >
              {isExecuting ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Atom className="size-5" />
                  </motion.div>
                  <span>Fusing Skins...</span>
                </>
              ) : (
                <>
                  <Zap className="size-5" />
                  <span>Execute Contract</span>
                  <ArrowRight className="size-5" />
                </>
              )}
              {isExecuting && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.button>
          </div>

          {/* How it works */}
          <div className="bg-[#05050a] border border-white/5 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="size-4 text-[#ffaa00]" />
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-400">How Fusion Lab Works</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { step: "1", text: "Select 10 skins of the same rarity", icon: "📦" },
                { step: "2", text: "Higher average value = better output quality", icon: "⚡" },
                { step: "3", text: "Receive 1 skin of the next rarity tier", icon: "🎯" },
              ].map(s => (
                <div key={s.step} className="space-y-2">
                  <div className="text-2xl">{s.icon}</div>
                  <div className="text-[10px] text-slate-500 font-medium leading-relaxed">{s.text}</div>
                </div>
              ))}
            </div>
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
              initial={{ scale: 0.85, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="mx-4 w-full max-w-md rounded-3xl border border-[#ffaa00]/30 bg-[#05050a] p-10 text-center relative overflow-hidden shadow-[0_0_60px_rgba(255,170,0,0.2)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,170,0,0.08)_0%,transparent_70%)] pointer-events-none" />
              {/* Confetti particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: ["#ff2a5f", "#ffaa00", "#00f0ff", "#00ff87", "#a100ff"][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{ y: [0, -60, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
                  transition={{ duration: 2, delay: i * 0.1, repeat: 2 }}
                />
              ))}

              <div className="relative z-10">
                <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }} className="text-5xl mb-4">🎉</motion.div>
                <div className="text-xs font-heading font-bold uppercase tracking-wider text-[#ffaa00] mb-2 flex items-center justify-center gap-2">
                  <Zap className="size-3" /> Fusion Complete
                </div>
                <h2 className="font-heading text-2xl font-extrabold text-white mb-1">{result.name}</h2>
                <div className={`text-xs font-heading font-bold mb-6 ${(RARITY_COLORS[result.rarity] || RARITY_COLORS["Mil-Spec"]).text}`}>{result.rarity}</div>

                <div className="relative my-6 h-40 w-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,170,0,0.1),transparent_70%)]" />
                  <div className="w-32 h-32 rounded-2xl overflow-hidden">
                    <SkinPlaceholder rarity={result.rarity} name={result.name} />
                  </div>
                </div>

                <div className="mb-6 rounded-xl border border-white/5 bg-[#020204] px-6 py-3">
                  <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-0.5">Estimated Value</div>
                  <div className="text-2xl font-heading font-bold text-[#ffaa00]">${result.price.toFixed(2)}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setResult(null)}
                    className="px-6 py-3 bg-gradient-to-r from-[#ff2a5f] to-[#ffaa00] rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
                  >
                    Add to Inventory
                  </button>
                  <button
                    onClick={() => setResult(null)}
                    className="px-6 py-3 bg-[#020204] border border-white/5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white hover:border-white/10 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
