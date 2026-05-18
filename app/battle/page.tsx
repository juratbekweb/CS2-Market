"use client";

import { useState } from "react";
import { Swords, Trophy, Play, Plus, Zap, Star, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BattleRoom {
  id: string;
  creator: string;
  cases: { id: string; name: string; image: string; price: number }[];
  players: number;
  maxPlayers: number;
  totalCost: number;
  status: "waiting" | "active" | "finished";
  mode: "1v1" | "1v1v1" | "2v2";
}

const MOCK_CASES = [
  { id: "case1", name: "Phantom", image: "/cases/phantom.png", price: 4.99 },
  { id: "case2", name: "Dragon", image: "/cases/dragon.png", price: 9.99 },
];

const MOCK_BATTLES: BattleRoom[] = [
  { id: "b1", creator: "LCDreamer", cases: [MOCK_CASES[0], MOCK_CASES[0], MOCK_CASES[1]], players: 1, maxPlayers: 2, totalCost: 19.97, status: "waiting", mode: "1v1" },
  { id: "b2", creator: "ProSniper", cases: [MOCK_CASES[1], MOCK_CASES[1]], players: 2, maxPlayers: 3, totalCost: 19.98, status: "waiting", mode: "1v1v1" },
  { id: "b3", creator: "NinjaX", cases: [MOCK_CASES[0], MOCK_CASES[0], MOCK_CASES[1], MOCK_CASES[1]], players: 2, maxPlayers: 2, totalCost: 29.96, status: "active", mode: "1v1" },
  { id: "b4", creator: "TeamAlpha", cases: [MOCK_CASES[1], MOCK_CASES[1]], players: 3, maxPlayers: 4, totalCost: 19.98, status: "waiting", mode: "2v2" },
];

export default function BattlePage() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row relative z-10">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ff2a5f]/30 bg-[#ff2a5f]/10 px-6 py-2 text-xs font-heading font-bold uppercase tracking-wider text-[#ff2a5f] backdrop-blur-md"
          >
            <Swords className="size-4" /> PvP Arenas
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="font-heading text-6xl uppercase tracking-tighter text-white font-extrabold mb-4"
          >
            CASE <span className="bg-gradient-to-r from-[#ff2a5f] to-[#ffaa00] bg-clip-text text-transparent">BATTLES</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 font-medium max-w-2xl"
          >
            Winner takes all. Team up or go solo in high-stakes case unboxing battles.
          </motion.p>
        </div>

        <motion.button 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="px-8 py-4 bg-gradient-to-r from-[#ff2a5f] to-[#ffaa00] rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white glow-purple flex items-center gap-2"
        >
          <Plus className="size-4" /> Create Battle
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="mb-10 flex gap-4 p-1 bg-[#05050a] border border-[#ffffff]/5 rounded-2xl w-max relative z-10">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-6 py-3 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all ${activeTab === "active" ? 'bg-[#020204] text-white border border-[#ffffff]/5' : 'text-slate-500 hover:text-white'}`}
        >
          Live Battles
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all ${activeTab === "history" ? 'bg-[#020204] text-white border border-[#ffffff]/5' : 'text-slate-500 hover:text-white'}`}
        >
          Past Results
        </button>
      </div>

      {/* Battles List */}
      <div className="space-y-6 relative z-10">
        <AnimatePresence>
          {MOCK_BATTLES.filter((b) => (activeTab === "active" ? b.status !== "finished" : b.status === "finished")).map((battle, index) => (
            <motion.div 
              layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
              key={battle.id} 
              className={`bg-[#05050a] border border-[#ffffff]/5 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center gap-6 group transition-all duration-500 hover:border-[#ff2a5f]/20 ${battle.status === 'active' ? 'border-[#00f0ff]/20 shadow-[0_0_15px_rgba(0,240,255,0.05)]' : ''}`}
            >
              
              {/* Status Indicator */}
              {battle.status === 'active' && (
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00f0ff] glow-cyan" />
              )}

              {/* Player Card Style */}
              <div className="flex w-full items-center justify-between md:w-64 shrink-0 border-b border-[#ffffff]/5 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6 relative z-10">
                 <div className="flex flex-col gap-2">
                   <div className="inline-flex items-center gap-1 text-[10px] font-heading font-bold uppercase tracking-wider text-[#ff2a5f]">
                     <Shield className="size-3" /> {battle.mode}
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#a100ff] to-[#00f0ff] font-heading font-bold text-white shadow-lg">
                       {battle.creator.charAt(0)}
                     </div>
                     <div>
                       <div className="text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors">{battle.creator}</div>
                       <div className="text-[10px] font-heading font-bold text-slate-600 uppercase tracking-wider">{battle.players}/{battle.maxPlayers} Players</div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-1.5">
                   {[...Array(battle.maxPlayers)].map((_, i) => (
                     <div key={i} className={`size-2.5 rounded-full ${i < battle.players ? 'bg-[#ff2a5f] glow-purple' : 'bg-[#020204] border border-[#ffffff]/10'}`} />
                   ))}
                 </div>
              </div>

              {/* Cases Preview */}
              <div className="flex flex-1 items-center gap-3 overflow-x-auto hide-scrollbar relative z-10">
                {battle.cases.map((c, i) => (
                  <motion.div 
                    whileHover={{ y: -5 }}
                    key={i} className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#020204] border border-[#ffffff]/5 group-hover:border-[#ffffff]/10 transition-colors"
                  >
                    <span className="text-2xl drop-shadow-lg">📦</span>
                  </motion.div>
                ))}
                {battle.cases.length > 5 && (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#020204] border border-[#ffffff]/5 text-xs font-heading font-bold text-slate-600">
                    +{battle.cases.length - 5}
                  </div>
                )}
              </div>

              {/* Action / Cost */}
              <div className="flex shrink-0 items-center justify-between gap-6 md:w-64 md:justify-end border-t border-[#ffffff]/5 pt-4 md:border-t-0 md:pt-0 relative z-10">
                 <div className="text-right">
                   <div className="text-[9px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-0.5">Prize Pool</div>
                   <div className="font-heading text-2xl font-bold text-[#ffaa00]">${battle.totalCost.toFixed(2)}</div>
                 </div>
                 
                 {battle.status === "waiting" ? (
                   <button 
                     className="px-6 py-2.5 bg-[#020204] border border-[#ff2a5f]/20 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-[#ff2a5f] hover:bg-[#ff2a5f] hover:text-[#020204] hover:glow-purple transition-all"
                   >
                     Join
                   </button>
                 ) : (
                   <button 
                     className="px-6 py-2.5 bg-[#020204] border border-[#00f0ff]/20 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#020204] hover:glow-cyan transition-all flex items-center gap-1.5"
                   >
                     <Play className="size-3" /> Watch
                   </button>
                 )}
              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {MOCK_BATTLES.filter((b) => (activeTab === "active" ? b.status !== "finished" : b.status === "finished")).length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex h-64 flex-col items-center justify-center rounded-3xl border border-[#ffffff]/5 bg-[#05050a] text-center"
          >
             <Trophy className="mb-4 size-12 text-slate-700 opacity-50" />
             <h3 className="font-heading text-xl font-bold text-white">No battles found</h3>
             <p className="text-slate-500 mt-1 text-sm">There are no {activeTab} battles at the moment.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
