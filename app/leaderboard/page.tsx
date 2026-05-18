"use client";

import { useState, useEffect } from "react";
import { Trophy, TrendingUp, Crown, Medal } from "lucide-react";

interface LeaderEntry {
  rank: number; name: string; avatar: string | null; volume?: number; profit?: number;
}

export default function LeaderboardPage() {
  const [traders, setTraders] = useState<LeaderEntry[]>([]);
  const [tab, setTab] = useState<"traders" | "upgraders">("traders");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(r => r.json())
      .then(data => {
        setTraders(data.traders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="size-5 text-amber-400" />;
    if (rank === 2) return <Medal className="size-5 text-slate-300" />;
    if (rank === 3) return <Medal className="size-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "border-amber-400/40 bg-gradient-to-r from-amber-500/10 to-transparent";
    if (rank === 2) return "border-slate-300/30 bg-gradient-to-r from-slate-400/10 to-transparent";
    if (rank === 3) return "border-amber-600/30 bg-gradient-to-r from-amber-700/10 to-transparent";
    return "border-white/10 bg-surface/60";
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-400">
          <Trophy className="size-3" /> Leaderboard
        </div>
        <h1 className="font-heading text-4xl uppercase tracking-[0.12em] text-white sm:text-5xl">Top Players</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">The best traders and risk-takers on NightMarket</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex justify-center gap-2">
        {(["traders", "upgraders"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-8 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              tab === t ? "btn-premium-solid" : "btn-premium"
            }`}>
            {t === "traders" ? "Top Traders" : "Top Upgraders"}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card h-24 animate-pulse rounded-[2rem]" />
          ))
        ) : (
          traders.map(entry => (
            <div key={entry.rank} className={`glass-card flex items-center justify-between rounded-[2rem] p-6 transition-transform hover:scale-[1.02] hover:-translate-y-1 ${getRankBg(entry.rank)}`}>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg">
                  {entry.avatar ? "👤" : "👤"}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{entry.name}</div>
                  <div className="text-xs text-muted">Rank #{entry.rank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-lg font-bold text-glow">
                  <TrendingUp className="size-4" />
                  ${(entry.volume ?? entry.profit ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-muted">{tab === "traders" ? "30d volume" : "profit"}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
