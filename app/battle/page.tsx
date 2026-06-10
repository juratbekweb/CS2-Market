"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sword, Plus, Users, Search, ShieldAlert, CheckCircle2, Package, X } from "lucide-react";

interface Case {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
}

interface Battle {
  id: string;
  creator: Player;
  players: Player[];
  maxPlayers: number;
  cases: Case[];
  totalValue: number;
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED";
  winnerId?: string;
  createdAt: string;
}

const MOCK_CASES: Case[] = [
  { id: "c1", name: "Neon Overdrive", image: "", price: 29.99 },
  { id: "c2", name: "Emerald Fury", image: "", price: 49.99 },
  { id: "c3", name: "Golden Heist", image: "", price: 99.99 },
  { id: "c4", name: "Budget Blaster", image: "", price: 5.99 },
  { id: "c5", name: "Phantom Collection", image: "", price: 15.50 },
];

const MOCK_BATTLES: Battle[] = [
  {
    id: "b1",
    creator: { id: "p1", name: "DragonSlayer99", avatar: "D" },
    players: [{ id: "p1", name: "DragonSlayer99", avatar: "D" }],
    maxPlayers: 2,
    cases: [MOCK_CASES[0], MOCK_CASES[1], MOCK_CASES[0]],
    totalValue: 109.97,
    status: "WAITING",
    createdAt: new Date().toISOString(),
  },
  {
    id: "b2",
    creator: { id: "p2", name: "NightHunter", avatar: "N" },
    players: [{ id: "p2", name: "NightHunter", avatar: "N" }, { id: "p3", name: "AWP_Wizard", avatar: "A" }],
    maxPlayers: 4,
    cases: [MOCK_CASES[2], MOCK_CASES[2]],
    totalValue: 199.98,
    status: "WAITING",
    createdAt: new Date(Date.now() - 50000).toISOString(),
  },
  {
    id: "b3",
    creator: { id: "p4", name: "SkinGod", avatar: "S" },
    players: [
      { id: "p4", name: "SkinGod", avatar: "S" },
      { id: "p5", name: "TradeMaster", avatar: "T" },
    ],
    maxPlayers: 2,
    cases: [MOCK_CASES[4], MOCK_CASES[4], MOCK_CASES[4], MOCK_CASES[4], MOCK_CASES[4]],
    totalValue: 77.50,
    status: "IN_PROGRESS",
    createdAt: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: "b4",
    creator: { id: "p6", name: "Lucky7", avatar: "L" },
    players: [
      { id: "p6", name: "Lucky7", avatar: "L" },
      { id: "p7", name: "GamerX", avatar: "G" },
      { id: "p8", name: "SniperPro", avatar: "S" },
      { id: "p9", name: "CrateOpener", avatar: "C" },
    ],
    maxPlayers: 4,
    cases: [MOCK_CASES[3], MOCK_CASES[0], MOCK_CASES[1]],
    totalValue: 85.97,
    status: "COMPLETED",
    winnerId: "p8",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export default function BattlesPage() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");

  const filteredBattles = MOCK_BATTLES.filter(b => {
    if (activeTab === "active" && b.status === "COMPLETED") return false;
    if (activeTab === "history" && b.status !== "COMPLETED") return false;
    if (search && !b.creator.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#ff2a5f] mb-2 font-heading font-bold tracking-wider text-xs">
            <Sword className="size-4" /> BATTLE ARENA
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
            CASE BATTLES
          </h1>
          <p className="mt-2 text-slate-400 font-medium max-w-xl">
            Go head-to-head against other players. The player who unboxes the highest total value takes everything!
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold uppercase tracking-wider text-sm transition-all bg-gradient-to-r from-[#ff2a5f] to-[#ffaa00] text-white hover:scale-105 shadow-[0_0_20px_rgba(255,42,95,0.3)] glow-purple"
        >
          <Plus className="size-5" /> Create Battle
        </button>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex bg-[#05050a] p-1 rounded-2xl border border-white/5 w-full sm:w-auto">
          {(["active", "history"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeTab === tab ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"
              }`}
            >
              {tab === "active" ? "Active Battles" : "History"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <input 
            type="text" placeholder="Search creator..." 
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#05050a] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff2a5f]/30 transition-colors"
          />
        </div>
      </div>

      {/* Battle Grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredBattles.map(battle => (
            <motion.div 
              key={battle.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#05050a] border border-white/5 rounded-2xl p-4 sm:p-6 flex flex-col lg:flex-row items-center gap-6 hover:border-white/10 transition-colors group"
            >
              {/* Creator Info */}
              <div className="flex items-center gap-4 w-full lg:w-48 shrink-0">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-heading font-bold text-lg text-white">
                  {battle.creator.avatar}
                </div>
                <div>
                  <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-0.5">Creator</div>
                  <div className="text-sm font-bold text-white truncate max-w-[120px]">{battle.creator.name}</div>
                </div>
              </div>

              {/* Cases List */}
              <div className="flex-1 flex flex-col w-full">
                <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-2 custom-scrollbar">
                  {battle.cases.slice(0, 8).map((c, i) => (
                    <div key={i} className="w-12 h-12 shrink-0 bg-[#020204] border border-white/5 rounded-lg flex items-center justify-center p-1 group-hover:border-white/20 transition-colors">
                      <Package className="size-6 text-slate-600" />
                    </div>
                  ))}
                  {battle.cases.length > 8 && (
                    <div className="w-12 h-12 shrink-0 bg-[#020204] border border-white/5 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500">
                      +{battle.cases.length - 8}
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {battle.cases.length} Rounds
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center justify-between w-full lg:w-auto gap-6 shrink-0">
                <div className="text-center lg:text-right">
                  <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-0.5">Total Value</div>
                  <div className="text-xl font-heading font-bold text-[#ffaa00]">${battle.totalValue.toFixed(2)}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#020204] border border-white/5 rounded-lg">
                    <Users className="size-3 text-slate-400" />
                    <span className="text-xs font-bold text-white">{battle.players.length}/{battle.maxPlayers}</span>
                  </div>

                  {battle.status === "WAITING" && (
                    <Link href={`/battle/${battle.id}`} className="px-6 py-3 bg-[#ff2a5f]/10 border border-[#ff2a5f]/30 text-[#ff2a5f] rounded-xl text-xs font-heading font-bold uppercase tracking-wider hover:bg-[#ff2a5f]/20 transition-colors text-center w-28">
                      JOIN
                    </Link>
                  )}
                  {battle.status === "IN_PROGRESS" && (
                    <Link href={`/battle/${battle.id}`} className="px-6 py-3 bg-[#00ff87]/10 border border-[#00ff87]/30 text-[#00ff87] rounded-xl text-xs font-heading font-bold uppercase tracking-wider hover:bg-[#00ff87]/20 transition-colors text-center w-28 flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-ping" /> LIVE
                    </Link>
                  )}
                  {battle.status === "COMPLETED" && (
                    <Link href={`/battle/${battle.id}`} className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider hover:bg-white/10 transition-colors text-center w-28">
                      VIEW
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {filteredBattles.length === 0 && (
            <div className="py-20 text-center bg-[#05050a] border border-white/5 rounded-3xl">
              <ShieldAlert className="size-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">No battles found</h3>
              <p className="text-slate-500 text-sm">There are no {activeTab} battles at the moment.</p>
              {activeTab === "active" && (
                <button onClick={() => setShowCreateModal(true)} className="mt-6 px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
                  Create One Now
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust Badge */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#a100ff]/10 border border-[#a100ff]/20 text-xs font-heading font-bold uppercase tracking-wider text-[#a100ff]">
          <CheckCircle2 className="size-4" /> EOS Provably Fair Battles
        </div>
      </motion.div>

      {/* CREATE BATTLE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#020204]/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#05050a] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-heading font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Plus className="size-5 text-[#ff2a5f]" /> Create Battle
                </h2>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-8">
                {/* Mode & Players */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500 mb-3 block">Game Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="py-3 px-4 rounded-xl border border-[#ff2a5f]/50 bg-[#ff2a5f]/10 text-white text-xs font-bold uppercase tracking-wider text-center">
                        Classic (FFA)
                      </button>
                      <button className="py-3 px-4 rounded-xl border border-white/5 bg-[#020204] text-slate-500 text-xs font-bold uppercase tracking-wider text-center opacity-50 cursor-not-allowed">
                        Team (2v2)
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500 mb-3 block">Players</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="py-3 px-4 rounded-xl border border-[#ff2a5f]/50 bg-[#ff2a5f]/10 text-white text-xs font-bold uppercase tracking-wider text-center">
                        2
                      </button>
                      <button className="py-3 px-4 rounded-xl border border-white/5 bg-[#020204] text-slate-500 hover:text-white hover:border-white/20 transition-colors text-xs font-bold uppercase tracking-wider text-center">
                        3
                      </button>
                      <button className="py-3 px-4 rounded-xl border border-white/5 bg-[#020204] text-slate-500 hover:text-white hover:border-white/20 transition-colors text-xs font-bold uppercase tracking-wider text-center">
                        4
                      </button>
                    </div>
                  </div>
                </div>

                {/* Case Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500">Select Cases</label>
                    <span className="text-xs font-bold text-slate-500">0 selected</span>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                    {MOCK_CASES.map(c => (
                      <div key={c.id} className="bg-[#020204] border border-white/5 rounded-xl p-3 text-center cursor-pointer hover:border-white/20 transition-colors group">
                        <div className="h-16 flex items-center justify-center mb-2">
                          <Package className="size-8 text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="text-[10px] font-bold text-white truncate mb-1">{c.name}</div>
                        <div className="text-xs font-heading font-bold text-[#00ff87]">${c.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5 bg-[#020204] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-0.5">Total Cost</div>
                  <div className="text-2xl font-heading font-bold text-white">$0.00</div>
                </div>
                <button className="px-8 py-3 bg-gradient-to-r from-[#ff2a5f] to-[#ffaa00] text-white rounded-xl font-heading font-bold uppercase tracking-wider text-sm opacity-50 cursor-not-allowed">
                  Create Battle
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
