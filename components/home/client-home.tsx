"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Box, RefreshCw, ShieldCheck, Trophy, 
  ChevronRight, Users, Sparkles, Zap, Flame, Crown, 
  Search, Bell, Heart, Menu 
} from "lucide-react";

interface ClientHomeProps {
  featuredListings: any[];
  userCount?: number;
}

export function ClientHome({ featuredListings, userCount = 14203 }: ClientHomeProps) {
  const [mounted, setMounted] = useState(false);
  const [activeCase, setActiveCase] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* 1. MASSIVE CINEMATIC HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Video/Animation Placeholder (using CSS) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(161,0,255,0.1)_0%,transparent_60%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-[#020204] to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            {/* Live Counter Badge */}
            <div className="mb-8 flex items-center gap-3 px-4 py-2 rounded-full bg-[#05050a]/80 border border-[#a100ff]/30 backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff87] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff87]"></span>
              </span>
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-white">
                Live Drops Active • {userCount.toLocaleString()} Battling
              </span>
            </div>

            {/* Giant Title with Mask/Gradient */}
            <h1 className="font-heading text-7xl md:text-9xl font-extrabold uppercase tracking-tighter text-white mb-6 leading-none">
              ELEVATE YOUR <br />
              <span className="bg-gradient-to-r from-[#a100ff] via-[#00f0ff] to-[#00ff87] bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                ARSENAL
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12 font-medium leading-relaxed">
              Experience the next evolution of CS2 trading. Open premium cases, upgrade with provably fair odds, and dominate the marketplace with ultra-low fees.
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/cases" className="group relative px-10 py-4 bg-gradient-to-r from-[#a100ff] to-[#00f0ff] rounded-xl font-heading font-bold uppercase tracking-wider text-white overflow-hidden transition-all duration-500 hover:glow-purple">
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  <Box className="size-5 group-hover:rotate-12 transition-transform" />
                  Explore Cases
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] to-[#a100ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              
              <Link href="/marketplace" className="group relative px-10 py-4 bg-[#05050a] border border-[#a100ff]/30 rounded-xl font-heading font-bold uppercase tracking-wider text-white overflow-hidden transition-all duration-500 hover:border-[#00f0ff]/50">
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  <Sparkles className="size-5 text-[#ffaa00]" />
                  Browse Market
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#a100ff]/10 to-[#00f0ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating 3D-like Elements (Pure CSS/Framer) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] opacity-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-[#a100ff] to-transparent rounded-3xl blur-sm" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[30%] right-[10%] opacity-20"
          >
            <div className="w-40 h-40 bg-gradient-to-tr from-[#00f0ff] to-transparent rounded-full blur-sm" />
          </motion.div>
        </div>
      </section>

      {/* 2. REAL-TIME ACTIVITY FEED / LIVE DROPS */}
      <section className="w-full bg-[#05050a]/80 border-y border-[#ffffff]/5 backdrop-blur-xl py-4 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#020204] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#020204] to-transparent z-10" />
        
        <div className="flex items-center gap-6 animate-[shimmer_30s_linear_infinite] whitespace-nowrap px-4">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-2 rounded-xl bg-[#020204] border border-[#a100ff]/10 hover:border-[#00f0ff]/30 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#a100ff]/20 to-[#00f0ff]/20 flex items-center justify-center border border-[#ffffff]/5 group-hover:glow-blue transition-all">
                <Sparkles className="size-5 text-[#ffaa00]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-medium">User_{9999 - i} unboxed</span>
                <span className="text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors">AWP | Dragon Lore</span>
              </div>
              <div className="text-xs font-heading font-bold text-[#ff2a5f] bg-[#ff2a5f]/10 px-2 py-0.5 rounded-full">
                $1,200.00
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ANIMATED FEATURED CASES SLIDER */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#00f0ff] mb-3 font-heading font-bold tracking-wider text-sm">
              <Zap className="size-4" /> HOT DROPS
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold uppercase text-white tracking-tight">FEATURED CASES</h2>
          </div>
          <Link href="/cases" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase font-heading font-bold text-sm tracking-wider">
            View All Cases <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "NEON OVERDRIVE", price: 29.99, color: "from-[#a100ff] to-[#00f0ff]", glow: "shadow-[0_0_30px_rgba(161,0,255,0.3)]" },
            { name: "EMERALD FURY", price: 49.99, color: "from-[#00ff87] to-[#00f0ff]", glow: "shadow-[0_0_30px_rgba(0,255,135,0.3)]" },
            { name: "GOLDEN HEIST", price: 99.99, color: "from-[#ffaa00] to-[#ff2a5f]", glow: "shadow-[0_0_30px_rgba(255,170,0,0.3)]" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative bg-[#05050a] border border-[#ffffff]/5 rounded-3xl p-8 cursor-pointer group overflow-hidden ${item.glow} transition-all duration-500`}
            >
              {/* Background Glow */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${item.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="mb-8 flex justify-between items-start">
                  <span className="text-xs font-heading font-bold uppercase tracking-widest text-slate-500">Tier {4 - i}</span>
                  <div className="bg-[#020204] rounded-full p-2 border border-[#ffffff]/5 group-hover:border-[#00f0ff]/30 transition-colors">
                    <Crown className="size-5 text-[#ffaa00]" />
                  </div>
                </div>

                {/* Case Box Representation */}
                <div className="w-full h-48 mb-8 flex items-center justify-center relative">
                  <div className={`w-32 h-32 bg-gradient-to-br ${item.color} rounded-2xl opacity-10 group-hover:scale-110 transition-transform duration-500`} />
                  <Box className="size-20 text-white absolute group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />
                </div>

                <h3 className="font-heading text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-slate-400 transition-all">
                  {item.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="font-heading text-xl font-bold text-white">
                    ${item.price.toFixed(2)}
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#05050a] to-[#020204] border border-[#ffffff]/10 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-white group-hover:border-[#00f0ff]/50 transition-colors">
                    Unlock
                  </button>
                </div>
              </div>

              {/* Animated Border on Hover */}
              <div className="absolute inset-0 border border-[#a100ff]/0 group-hover:border-[#a100ff]/50 rounded-3xl transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. UPGRADE SYSTEM PREVIEW (Interactive UI) */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="relative premium-glass rounded-3xl p-12 overflow-hidden border-[#a100ff]/20">
          {/* Background Ambient Light */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,rgba(161,0,255,0.15)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffaa00]/30 bg-[#ffaa00]/10 px-4 py-1 text-xs font-heading font-bold uppercase tracking-wider text-[#ffaa00]">
                <Flame className="size-3" /> High Risk, High Reward
              </div>
              <h2 className="font-heading text-5xl font-extrabold uppercase text-white tracking-tight leading-none">
                SKIN <br />
                <span className="bg-gradient-to-r from-[#ff2a5f] to-[#ffaa00] bg-clip-text text-transparent">UPGRADER</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                Don't like your skins? Roll them for a chance to win something legendary. Set your own odds and let the wheel decide.
              </p>
              
              <div className="pt-4">
                <Link href="/upgrade" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#ff2a5f] to-[#ffaa00] rounded-xl font-heading font-bold uppercase tracking-wider text-white overflow-hidden transition-all hover:glow-gold">
                  <RefreshCw className="size-5 group-hover:rotate-180 transition-transform duration-700" />
                  Try Upgrader
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              {/* Futuristic Upgrade Wheel Mockup */}
              <div className="relative w-72 h-72">
                <div className="absolute inset-0 rounded-full border-4 border-[#05050a] shadow-[0_0_40px_rgba(255,42,95,0.3)]" />
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="144" cy="144" r="140" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                  <circle cx="144" cy="144" r="140" fill="transparent" stroke="#ff2a5f" strokeWidth="12" strokeDasharray="880" strokeDashoffset="550" className="drop-shadow-[0_0_15px_rgba(255,42,95,0.8)]" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-heading font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">37%</span>
                  <span className="text-xs font-heading font-bold text-[#ffaa00] uppercase tracking-widest mt-1">Success Rate</span>
                </div>
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white rounded-full shadow-[0_0_15px_white]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE MARKETPLACE / TRENDING ITEMS */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#00ff87] mb-3 font-heading font-bold tracking-wider text-sm">
              <Crown className="size-4" /> ELITE TIER
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold uppercase text-white tracking-tight">TRENDING SKINS</h2>
          </div>
          <Link href="/marketplace" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase font-heading font-bold text-sm tracking-wider">
            Explore Market <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing, i) => (
            <motion.div
              whileHover={{ y: -8 }}
              key={listing.id || i}
              className="bg-[#05050a] border border-[#ffffff]/5 rounded-2xl p-6 cursor-pointer relative group overflow-hidden"
            >
              {/* Rarity Background Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,95,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-heading font-bold uppercase tracking-wider bg-[#020204] px-2 py-1 rounded border border-[#ffffff]/5 text-[#ffaa00]">
                    FN 0.01
                  </span>
                  <Heart className="size-4 text-slate-600 hover:text-[#ff2a5f] transition-colors" />
                </div>

                {/* Skin Image Mock */}
                <div className="h-32 mb-6 bg-gradient-to-b from-transparent to-[#ffffff]/5 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <div className="w-32 h-8 bg-gradient-to-r from-[#ff2a5f] to-[#a100ff] rounded-full transform -rotate-12 group-hover:-rotate-6 transition-transform shadow-neon-purple" />
                </div>

                <div className="mb-4">
                  <div className="text-sm text-slate-500 font-medium mb-1">{listing.skin.category || "Rifle"}</div>
                  <div className="text-lg font-bold text-white group-hover:text-[#00f0ff] transition-colors truncate">
                    {listing.skin.name || "M4A4 | Neo-Noir"}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-heading font-bold uppercase tracking-widest text-slate-600 mb-0.5">Price</div>
                    <div className="text-xl font-heading font-bold text-[#00ff87]">
                      ${listing.askPrice || "250.00"}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#020204] border border-[#00ff87]/20 rounded-lg text-xs font-heading font-bold uppercase tracking-wider text-[#00ff87] hover:bg-[#00ff87] hover:text-[#020204] hover:glow-emerald transition-all">
                    Buy
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. TRUST & STATS (AAA Game Launcher Quality) */}
      <section className="bg-[#05050a]/50 border-y border-[#ffffff]/5 backdrop-blur-md py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[#a100ff]/10 flex items-center justify-center mb-6 border border-[#a100ff]/20 group-hover:glow-purple transition-all duration-500">
                <ShieldCheck className="size-8 text-[#a100ff]" />
              </div>
              <div className="font-heading text-4xl font-extrabold text-white mb-2">100%</div>
              <div className="text-sm font-heading font-bold uppercase tracking-widest text-slate-500">Provably Fair</div>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 flex items-center justify-center mb-6 border border-[#00f0ff]/20 group-hover:glow-blue transition-all duration-500">
                <Users className="size-8 text-[#00f0ff]" />
              </div>
              <div className="font-heading text-4xl font-extrabold text-white mb-2">2.4M+</div>
              <div className="text-sm font-heading font-bold uppercase tracking-widest text-slate-500">Global Users</div>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-[#ffaa00]/10 flex items-center justify-center mb-6 border border-[#ffaa00]/20 group-hover:glow-gold transition-all duration-500">
                <Trophy className="size-8 text-[#ffaa00]" />
              </div>
              <div className="font-heading text-4xl font-extrabold text-white mb-2">$80M+</div>
              <div className="text-sm font-heading font-bold uppercase tracking-widest text-slate-500">Volume Traded</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
