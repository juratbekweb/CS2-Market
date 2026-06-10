"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Flame, TrendingUp, Sword, Package, Zap, Medal } from "lucide-react";

type Period = "weekly" | "monthly" | "alltime";
type Category = "profit" | "battles" | "openings" | "upgrades";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  value: number;
  change: number;
  badge?: string;
  country: string;
}

const MOCK_DATA: Record<Category, LeaderboardEntry[]> = {
  profit: [
    { rank: 1, name: "DragonSlayer99", avatar: "D", value: 124500, change: 12, badge: "LEGEND", country: "🇺🇸" },
    { rank: 2, name: "NightHunter_GG", avatar: "N", value: 98200, change: -3, badge: "ELITE", country: "🇩🇪" },
    { rank: 3, name: "SkinGod420", avatar: "S", value: 87100, change: 5, badge: "PRO", country: "🇷🇺" },
    { rank: 4, name: "TradeMaster_X", avatar: "T", value: 65400, change: 2, country: "🇧🇷" },
    { rank: 5, name: "CsGoKing2024", avatar: "C", value: 52300, change: -1, country: "🇫🇷" },
    { rank: 6, name: "AWP_Wizard", avatar: "A", value: 43100, change: 8, country: "🇸🇪" },
    { rank: 7, name: "MarketWhale_", avatar: "M", value: 38700, change: 0, country: "🇸🇬" },
    { rank: 8, name: "FlipKnifeFTW", avatar: "F", value: 31200, change: 3, country: "🇳🇱" },
    { rank: 9, name: "cs2_investor", avatar: "C", value: 27800, change: -2, country: "🇵🇱" },
    { rank: 10, name: "SteamLord_GG", avatar: "S", value: 19500, change: 1, country: "🇦🇺" },
  ],
  battles: [
    { rank: 1, name: "BattleKing_Pro", avatar: "B", value: 847, change: 4, badge: "LEGEND", country: "🇺🇸" },
    { rank: 2, name: "CaseCrusher", avatar: "C", value: 723, change: 1, badge: "ELITE", country: "🇩🇪" },
    { rank: 3, name: "RollMaster99", avatar: "R", value: 612, change: -2, badge: "PRO", country: "🇷🇺" },
    { rank: 4, name: "Lucky7_CS2", avatar: "L", value: 534, change: 6, country: "🇸🇪" },
    { rank: 5, name: "BattleQueen", avatar: "B", value: 498, change: 0, country: "🇳🇱" },
    { rank: 6, name: "NeonGladiator", avatar: "N", value: 445, change: 2, country: "🇫🇷" },
    { rank: 7, name: "DropBomber_", avatar: "D", value: 398, change: -1, country: "🇧🇷" },
    { rank: 8, name: "CrateSmash_X", avatar: "C", value: 356, change: 3, country: "🇵🇱" },
    { rank: 9, name: "ArenaWolf_GG", avatar: "A", value: 312, change: 5, country: "🇸🇬" },
    { rank: 10, name: "BattleBot9000", avatar: "B", value: 289, change: -1, country: "🇦🇺" },
  ],
  openings: [
    { rank: 1, name: "CaseAddict_", avatar: "C", value: 5240, change: 22, badge: "LEGEND", country: "🇺🇸" },
    { rank: 2, name: "UnboxKing2024", avatar: "U", value: 4891, change: 8, badge: "ELITE", country: "🇩🇪" },
    { rank: 3, name: "DropHunter99", avatar: "D", value: 4102, change: -5, badge: "PRO", country: "🇷🇺" },
    { rank: 4, name: "CS2_Gambler", avatar: "C", value: 3741, change: 3, country: "🇸🇪" },
    { rank: 5, name: "CrateOpener", avatar: "C", value: 3200, change: 0, country: "🇫🇷" },
    { rank: 6, name: "LuckyCharm_GG", avatar: "L", value: 2985, change: 7, country: "🇳🇱" },
    { rank: 7, name: "BoxBreaker_X", avatar: "B", value: 2743, change: -2, country: "🇧🇷" },
    { rank: 8, name: "CaseRaider_", avatar: "C", value: 2512, change: 4, country: "🇵🇱" },
    { rank: 9, name: "RareDrop_Pro", avatar: "R", value: 2198, change: 1, country: "🇸🇬" },
    { rank: 10, name: "UnboxMaster", avatar: "U", value: 1876, change: -3, country: "🇦🇺" },
  ],
  upgrades: [
    { rank: 1, name: "UpgradeGod_", avatar: "U", value: 98.7, change: 2, badge: "LEGEND", country: "🇺🇸" },
    { rank: 2, name: "RiskTaker99", avatar: "R", value: 94.2, change: -1, badge: "ELITE", country: "🇩🇪" },
    { rank: 3, name: "HighRoller_X", avatar: "H", value: 91.5, change: 3, badge: "PRO", country: "🇷🇺" },
    { rank: 4, name: "LuckyWheels", avatar: "L", value: 88.9, change: 0, country: "🇸🇪" },
    { rank: 5, name: "WinnerWinner", avatar: "W", value: 85.4, change: 5, country: "🇫🇷" },
    { rank: 6, name: "UpgradePro_", avatar: "U", value: 82.1, change: -2, country: "🇳🇱" },
    { rank: 7, name: "FeelTheLuck", avatar: "F", value: 79.8, change: 1, country: "🇧🇷" },
    { rank: 8, name: "SpinMaster_", avatar: "S", value: 76.3, change: 4, country: "🇵🇱" },
    { rank: 9, name: "CyberGambler", avatar: "C", value: 72.9, change: -1, country: "🇸🇬" },
    { rank: 10, name: "WheelOfFate", avatar: "W", value: 69.7, change: 2, country: "🇦🇺" },
  ],
};

const CATEGORY_CONFIG: Record<Category, { label: string; icon: React.ElementType; color: string; unit: string; prefix: string }> = {
  profit:   { label: "Top Profit",    icon: TrendingUp, color: "#ffaa00", unit: "USD Profit",     prefix: "$" },
  battles:  { label: "Battle Wins",   icon: Sword,      color: "#ff2a5f", unit: "Battles Won",    prefix: "" },
  openings: { label: "Case Openings", icon: Package,    color: "#00f0ff", unit: "Cases Opened",   prefix: "" },
  upgrades: { label: "Win Rate",      icon: Zap,        color: "#a100ff", unit: "Upgrade Success",prefix: "" },
};

const RANK_STYLES = [
  { bg: "bg-[#ffaa00]/10", border: "border-[#ffaa00]/30", icon: Crown,  iconColor: "text-[#ffaa00]", numberColor: "text-[#ffaa00]" },
  { bg: "bg-[#b0c3d9]/10", border: "border-[#b0c3d9]/30", icon: Medal,  iconColor: "text-[#b0c3d9]", numberColor: "text-[#b0c3d9]" },
  { bg: "bg-[#cd7f32]/10", border: "border-[#cd7f32]/30", icon: Trophy, iconColor: "text-[#cd7f32]", numberColor: "text-[#cd7f32]" },
];

const BADGE_COLORS: Record<string, string> = {
  LEGEND: "bg-[#ffaa00]/20 border-[#ffaa00]/40 text-[#ffaa00]",
  ELITE:  "bg-[#a100ff]/20 border-[#a100ff]/40 text-[#a100ff]",
  PRO:    "bg-[#00f0ff]/20 border-[#00f0ff]/40 text-[#00f0ff]",
};

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("weekly");
  const [category, setCategory] = useState<Category>("profit");

  const entries = MOCK_DATA[category];
  const config = CATEGORY_CONFIG[category];
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffaa00]/30 bg-[#ffaa00]/10 px-6 py-2 text-xs font-heading font-bold uppercase tracking-wider text-[#ffaa00]"
        >
          <Trophy className="size-4" /> Hall of Fame
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl uppercase tracking-tighter text-white font-extrabold mb-4"
        >
          LEADER<span className="bg-gradient-to-r from-[#ffaa00] to-[#ff2a5f] bg-clip-text text-transparent">BOARD</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="mx-auto max-w-xl text-base sm:text-lg text-slate-400 font-medium"
        >
          The elite traders, battle warriors, and lucky unboxers of NightMarket
        </motion.p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10 justify-between items-center w-full">
        {/* Category */}
        <div className="flex bg-[#05050a] p-1 rounded-2xl border border-white/5 w-full overflow-x-auto custom-scrollbar">
          {(Object.keys(CATEGORY_CONFIG) as Category[]).map(cat => {
            const cfg = CATEGORY_CONFIG[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-[10px] font-heading font-bold uppercase tracking-wider transition-all ${
                  category === cat
                    ? "text-white shadow-lg"
                    : "text-slate-500 hover:text-white"
                }`}
                style={category === cat ? { background: `linear-gradient(135deg, ${cfg.color}30, ${cfg.color}15)`, borderColor: `${cfg.color}40`, border: `1px solid` } : {}}
              >
                <cfg.icon className="size-3" style={category === cat ? { color: cfg.color } : {}} />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>
        {/* Period */}
        <div className="flex bg-[#05050a] p-1 rounded-2xl border border-white/5 shrink-0">
          {(["weekly", "monthly", "alltime"] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-heading font-bold uppercase tracking-wider transition-all ${
                period === p ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"
              }`}
            >
              {p === "alltime" ? "All Time" : p}
            </button>
          ))}
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
        {/* 2nd Place */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className={`bg-[#05050a] border ${RANK_STYLES[1].border} ${RANK_STYLES[1].bg} rounded-3xl p-5 text-center`}
        >
          <div className={`w-12 h-12 rounded-full ${RANK_STYLES[1].bg} border ${RANK_STYLES[1].border} flex items-center justify-center mx-auto mb-3`}>
            <span className="font-heading text-2xl font-bold text-[#b0c3d9]">{top3[1].avatar}</span>
          </div>
          <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-0.5">{top3[1].country}</div>
          <div className="text-sm font-bold text-white truncate">{top3[1].name}</div>
          {top3[1].badge && (
            <div className={`inline-block text-[8px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1 ${BADGE_COLORS[top3[1].badge]}`}>
              {top3[1].badge}
            </div>
          )}
          <div className="mt-3 font-heading text-lg font-bold" style={{ color: config.color }}>
            {config.prefix}{top3[1].value.toLocaleString()}{category === "upgrades" ? "%" : ""}
          </div>
          <div className="text-[10px] text-slate-600">{config.unit}</div>
          <div className="mt-3 text-2xl">🥈</div>
        </motion.div>

        {/* 1st Place - elevated */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`bg-[#05050a] border ${RANK_STYLES[0].border} ${RANK_STYLES[0].bg} rounded-3xl p-6 text-center relative shadow-[0_0_40px_rgba(255,170,0,0.2)]`}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="bg-gradient-to-r from-[#ffaa00] to-[#ff2a5f] text-white text-[8px] font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              #1 Champion
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ffaa00] to-[#ff2a5f] p-[2px] mx-auto mb-3">
            <div className="w-full h-full rounded-full bg-[#05050a] flex items-center justify-center">
              <span className="font-heading text-3xl font-bold text-[#ffaa00]">{top3[0].avatar}</span>
            </div>
          </div>
          <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-0.5">{top3[0].country}</div>
          <div className="text-base font-bold text-white truncate">{top3[0].name}</div>
          {top3[0].badge && (
            <div className={`inline-block text-[8px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1 ${BADGE_COLORS[top3[0].badge]}`}>
              {top3[0].badge}
            </div>
          )}
          <div className="mt-3 font-heading text-2xl font-bold" style={{ color: config.color }}>
            {config.prefix}{top3[0].value.toLocaleString()}{category === "upgrades" ? "%" : ""}
          </div>
          <div className="text-[10px] text-slate-600">{config.unit}</div>
          <div className="mt-3 text-3xl">👑</div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`bg-[#05050a] border ${RANK_STYLES[2].border} ${RANK_STYLES[2].bg} rounded-3xl p-5 text-center`}
        >
          <div className={`w-12 h-12 rounded-full ${RANK_STYLES[2].bg} border ${RANK_STYLES[2].border} flex items-center justify-center mx-auto mb-3`}>
            <span className="font-heading text-2xl font-bold text-[#cd7f32]">{top3[2].avatar}</span>
          </div>
          <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-0.5">{top3[2].country}</div>
          <div className="text-sm font-bold text-white truncate">{top3[2].name}</div>
          {top3[2].badge && (
            <div className={`inline-block text-[8px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1 ${BADGE_COLORS[top3[2].badge]}`}>
              {top3[2].badge}
            </div>
          )}
          <div className="mt-3 font-heading text-lg font-bold" style={{ color: config.color }}>
            {config.prefix}{top3[2].value.toLocaleString()}{category === "upgrades" ? "%" : ""}
          </div>
          <div className="text-[10px] text-slate-600">{config.unit}</div>
          <div className="mt-3 text-2xl">🥉</div>
        </motion.div>
      </div>

      {/* Ranks 4-10 */}
      <div className="bg-[#05050a] border border-white/5 rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-400">Rankings</span>
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-slate-600">{config.unit}</span>
        </div>
        <div className="divide-y divide-white/5">
          {rest.map((entry, idx) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors"
            >
              <div className="w-8 text-center font-heading text-lg font-bold text-slate-600">
                {entry.rank}
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-heading font-bold text-white">
                {entry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{entry.name}</span>
                  <span className="text-xs">{entry.country}</span>
                  {entry.badge && (
                    <span className={`text-[8px] font-heading font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${BADGE_COLORS[entry.badge]}`}>
                      {entry.badge}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1 text-[10px] font-bold ${entry.change > 0 ? "text-[#00ff87]" : entry.change < 0 ? "text-[#ff2a5f]" : "text-slate-600"}`}>
                  <Flame className="size-3" />
                  {entry.change > 0 ? "+" : ""}{entry.change}
                </div>
                <div className="font-heading text-base font-bold" style={{ color: config.color }}>
                  {config.prefix}{entry.value.toLocaleString()}{category === "upgrades" ? "%" : ""}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Footer */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="mt-8 premium-glass rounded-2xl p-6 text-center border-[#ffaa00]/10"
      >
        <div className="text-xs font-heading font-bold uppercase tracking-wider text-[#ffaa00] mb-2 flex items-center justify-center gap-2">
          <Trophy className="size-3" /> Leaderboard Updates
        </div>
        <p className="text-sm text-slate-500">Rankings update every hour. Weekly reset occurs every Monday at 00:00 UTC. Monthly at the 1st of each month.</p>
      </motion.div>
    </div>
  );
}
