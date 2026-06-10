"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Box,
  RefreshCw,
  ShieldCheck,
  Trophy,
  ChevronRight,
  Users,
  Sparkles,
  Zap,
  Flame,
  Crown,
  Heart,
  Package,
  ArrowRight,
  Star,
  TrendingUp,
  CheckCircle,
  Swords,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Listing {
  id: string;
  skin: { name: string; category: string };
  askPrice: number | string;
}

interface ClientHomeProps {
  featuredListings: Listing[];
  userCount?: number;
}

// ─────────────────────────────────────────────
// Static Data
// ─────────────────────────────────────────────
const LIVE_DROPS = [
  { user: "ShadowX", skin: "AWP | Dragon Lore", price: "$1,247.00", rarity: "#ffaa00", up: true },
  { user: "NeonViper", skin: "M9 Bayonet | Doppler", price: "$892.50", rarity: "#a100ff", up: true },
  { user: "GhostRifle", skin: "AK-47 | Redline", price: "$34.20", rarity: "#00f0ff", up: false },
  { user: "CryptoKnight", skin: "Karambit | Fade", price: "$1,650.00", rarity: "#ffaa00", up: true },
  { user: "LiquidFlame", skin: "M4A4 | Howl", price: "$3,200.00", rarity: "#ff2a5f", up: true },
  { user: "StrikeForce", skin: "Glock-18 | Fade", price: "$520.00", rarity: "#a100ff", up: false },
  { user: "VortexStar", skin: "AWP | Asiimov", price: "$78.40", rarity: "#00f0ff", up: true },
  { user: "NightHawk", skin: "Desert Eagle | Blaze", price: "$385.00", rarity: "#ffaa00", up: true },
  { user: "CyberWolf", skin: "Butterfly | Fade", price: "$2,100.00", rarity: "#ff2a5f", up: true },
  { user: "TitanSlayer", skin: "AK-47 | Wild Lotus", price: "$980.00", rarity: "#a100ff", up: false },
  { user: "PrismEdge", skin: "M4A1-S | Golden Coil", price: "$145.00", rarity: "#00ff87", up: true },
  { user: "ZeroGhost", skin: "USP-S | Kill Confirmed", price: "$67.80", rarity: "#00f0ff", up: false },
];

const FEATURED_CASES = [
  {
    name: "NEON OVERDRIVE",
    price: 29.99,
    tier: "Tier I",
    gradient: "from-[#a100ff] via-[#5500cc] to-[#00f0ff]",
    glow: "rgba(161,0,255,0.35)",
    glowHex: "#a100ff",
    accentColor: "#a100ff",
    borderColor: "border-[#a100ff]/30",
    hoverBorder: "hover:border-[#a100ff]/60",
    items: ["AWP | Fade", "AK-47 | Neon Revolution", "M4A4 | Cyber Security"],
  },
  {
    name: "EMERALD FURY",
    price: 49.99,
    tier: "Tier II",
    gradient: "from-[#00ff87] via-[#00cc66] to-[#00f0ff]",
    glow: "rgba(0,255,135,0.35)",
    glowHex: "#00ff87",
    accentColor: "#00ff87",
    borderColor: "border-[#00ff87]/30",
    hoverBorder: "hover:border-[#00ff87]/60",
    items: ["Karambit | Emerald Web", "M9 Bayonet | Forest DDPAT", "Glock | Moonrise"],
  },
  {
    name: "GOLDEN HEIST",
    price: 99.99,
    tier: "Tier III",
    gradient: "from-[#ffaa00] via-[#ff6600] to-[#ff2a5f]",
    glow: "rgba(255,170,0,0.35)",
    glowHex: "#ffaa00",
    accentColor: "#ffaa00",
    borderColor: "border-[#ffaa00]/30",
    hoverBorder: "hover:border-[#ffaa00]/60",
    items: ["M4A4 | Howl", "AWP | Dragon Lore", "Butterfly | Gold"],
  },
];

const BIG_WINS = [
  { user: "S", username: "ShadowX_99", item: "AWP | Dragon Lore", value: "$1,247.00", ago: "2 min ago", color: "#ffaa00" },
  { user: "N", username: "NeonViper", item: "Karambit | Fade", value: "$1,650.00", ago: "5 min ago", color: "#a100ff" },
  { user: "C", username: "CryptoKnight", item: "M4A4 | Howl", value: "$3,200.00", ago: "8 min ago", color: "#ff2a5f" },
  { user: "L", username: "LiquidFlame", item: "Butterfly | Ruby", value: "$2,100.00", ago: "12 min ago", color: "#00f0ff" },
  { user: "G", username: "GhostRifle", item: "Desert Eagle | Blaze", value: "$385.00", ago: "17 min ago", color: "#00ff87" },
  { user: "T", username: "TitanSlayer", item: "AK-47 | Wild Lotus", value: "$980.00", ago: "23 min ago", color: "#ffaa00" },
];

const HOW_STEPS = [
  {
    num: "01",
    icon: <Users className="size-7" />,
    title: "Connect Steam",
    desc: "Link your Steam account securely in one click. Zero permissions required beyond login.",
    color: "#a100ff",
  },
  {
    num: "02",
    icon: <Swords className="size-7" />,
    title: "List / Browse Skins",
    desc: "List your skins at your price or discover thousands of premium items below market value.",
    color: "#00f0ff",
  },
  {
    num: "03",
    icon: <Zap className="size-7" />,
    title: "Trade Instantly",
    desc: "Trades complete in under 60 seconds. Funds hit your balance instantly. No delays, ever.",
    color: "#00ff87",
  },
];

// ─────────────────────────────────────────────
// Count-Up Hook
// ─────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─────────────────────────────────────────────
// Animated Stat
// ─────────────────────────────────────────────
function AnimatedStat({
  value,
  label,
  prefix = "",
  suffix = "",
  start,
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  start: boolean;
}) {
  const count = useCountUp(value, 2200, start);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="font-heading text-3xl md:text-4xl font-extrabold text-white tabular-nums">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-xs font-heading font-bold uppercase tracking-widest text-slate-500">{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Floating Orb
// ─────────────────────────────────────────────
function FloatingOrb({
  color,
  size,
  top,
  left,
  duration,
  delay,
}: {
  color: string;
  size: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top, left, width: size, height: size }}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.05, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${color}60 0%, ${color}20 40%, transparent 70%)`,
          filter: `blur(${size / 3}px)`,
        }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Skin Silhouette
// ─────────────────────────────────────────────
function SkinSilhouette({
  top,
  right,
  left,
  width,
  height,
  gradient,
  duration,
  delay,
  rotate,
}: {
  top?: string;
  right?: string;
  left?: string;
  width: number;
  height: number;
  gradient: string;
  duration: number;
  delay: number;
  rotate: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none opacity-15"
      style={{ top, right, left, rotate: `${rotate}deg` }}
      animate={{ y: [0, -18, 0], rotate: [rotate, rotate + 5, rotate] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        style={{
          width,
          height,
          background: gradient,
          borderRadius: height / 2,
          filter: "blur(2px)",
        }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export function ClientHome({ featuredListings, userCount = 14203 }: ClientHomeProps) {
  const [mounted, setMounted] = useState(false);
  const [statsStarted, setStatsStarted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true });
  const platformRef = useRef<HTMLDivElement>(null);
  const platformInView = useInView(platformRef, { once: true, margin: "-100px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (statsInView) setStatsStarted(true);
  }, [statsInView]);

  if (!mounted) return null;

  // Duplicate live drops for seamless marquee
  const marqueeItems = [...LIVE_DROPS, ...LIVE_DROPS];

  return (
    <div className="flex flex-col pb-32 overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          1. MEGA HERO SECTION
      ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
      >
        {/* Background Ambient Orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <FloatingOrb color="#a100ff" size={600} top="5%" left="-10%" duration={12} delay={0} />
          <FloatingOrb color="#00f0ff" size={500} top="20%" left="65%" duration={14} delay={2} />
          <FloatingOrb color="#00ff87" size={400} top="55%" left="30%" duration={10} delay={4} />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Bottom vignette */}
          <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-[#020204] via-[#020204]/60 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-[20vh] bg-gradient-to-b from-[#020204] to-transparent" />
        </div>

        {/* Floating Skin Silhouettes */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <SkinSilhouette
            top="18%" left="5%" width={140} height={14}
            gradient="linear-gradient(90deg, #a100ff, #00f0ff)"
            duration={9} delay={0} rotate={-8}
          />
          <SkinSilhouette
            top="35%" right="6%" width={180} height={16}
            gradient="linear-gradient(90deg, #00ff87, #00f0ff)"
            duration={11} delay={1.5} rotate={10}
          />
          <SkinSilhouette
            top="60%" left="8%" width={110} height={12}
            gradient="linear-gradient(90deg, #ffaa00, #ff2a5f)"
            duration={13} delay={3} rotate={-5}
          />
          <SkinSilhouette
            top="70%" right="10%" width={160} height={14}
            gradient="linear-gradient(90deg, #a100ff, #ff2a5f)"
            duration={10} delay={0.5} rotate={6}
          />
          <SkinSilhouette
            top="25%" left="80%" width={90} height={10}
            gradient="linear-gradient(90deg, #00f0ff, #a100ff)"
            duration={8} delay={2} rotate={-12}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 text-center flex flex-col items-center">

          {/* Live Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-10 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#05050a]/80 border border-[#00ff87]/30 backdrop-blur-md"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff87] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ff87]" />
            </span>
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-white/90">
              Live Drops Active&nbsp;&nbsp;•&nbsp;&nbsp;
              <span className="text-[#00ff87]">{userCount.toLocaleString()}</span> Online
            </span>
          </motion.div>

          {/* Giant Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="font-heading text-[clamp(3rem,11vw,9rem)] font-extrabold uppercase tracking-tighter leading-[0.9] text-white mb-6 select-none"
          >
            ELEVATE YOUR
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #a100ff 0%, #00f0ff 50%, #00ff87 100%)",
                filter: "drop-shadow(0 0 40px rgba(0,240,255,0.4))",
              }}
            >
              ARSENAL
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mb-14 font-medium leading-relaxed"
          >
            Experience the next evolution of CS2 trading. Open premium cases,
            upgrade with provably fair odds, and dominate the marketplace with
            ultra-low fees.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-5 justify-center mb-20"
          >
            <Link
              href="/cases"
              className="group relative px-10 py-4 rounded-xl font-heading font-bold uppercase tracking-wider text-white overflow-hidden transition-all duration-500"
              style={{ background: "linear-gradient(135deg, #a100ff, #00f0ff)" }}
            >
              <span className="relative z-10 flex items-center gap-3 justify-center">
                <Box className="size-5 group-hover:rotate-12 transition-transform duration-300" />
                Explore Cases
              </span>
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "linear-gradient(135deg, #00f0ff, #a100ff)" }}
              />
            </Link>

            <Link
              href="/marketplace"
              className="group relative px-10 py-4 bg-white/5 border border-white/15 hover:border-[#00f0ff]/50 rounded-xl font-heading font-bold uppercase tracking-wider text-white overflow-hidden transition-all duration-500 backdrop-blur-sm"
            >
              <span className="relative z-10 flex items-center gap-3 justify-center">
                <Sparkles className="size-5 text-[#ffaa00] group-hover:scale-110 transition-transform" />
                Browse Market
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#a100ff]/10 to-[#00f0ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </motion.div>

          {/* Hero Stats Row */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="w-full max-w-3xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
              {[
                { value: 50000, label: "Items Listed", suffix: "+", prefix: "" },
                { value: 24, label: "24/7 Trading", suffix: "/7", prefix: "" },
                { value: 80, label: "Volume (USD)", suffix: "M+", prefix: "$" },
                { value: 2400000, label: "Users", suffix: "+", prefix: "" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-[#05050a]/80 backdrop-blur-md p-6 flex flex-col items-center gap-1 hover:bg-white/[0.03] transition-colors"
                >
                  <AnimatedStat
                    value={stat.value}
                    label={stat.label}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                    start={statsStarted}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. LIVE DROPS MARQUEE TICKER
      ═══════════════════════════════════════════ */}
      <section className="relative w-full bg-[#05050a]/90 border-y border-white/5 backdrop-blur-xl py-4 overflow-hidden">
        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#05050a] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#05050a] to-transparent z-10 pointer-events-none" />

        {/* Marquee */}
        <div
          className="flex items-center gap-4 whitespace-nowrap"
          style={{
            animation: "nightmarket-marquee 40s linear infinite",
            willChange: "transform",
          }}
        >
          {marqueeItems.map((drop, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-[#020204] border border-white/5 hover:border-[#a100ff]/30 transition-colors cursor-pointer group flex-shrink-0"
            >
              {/* Rarity dot */}
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: drop.rarity, boxShadow: `0 0 8px ${drop.rarity}` }}
              />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-600 font-medium">{drop.user} unboxed</span>
                <span className="text-sm font-bold text-white group-hover:text-[#00f0ff] transition-colors">
                  {drop.skin}
                </span>
              </div>
              <span
                className={`text-xs font-heading font-bold px-2.5 py-1 rounded-full ${
                  drop.up
                    ? "bg-[#00ff87]/10 text-[#00ff87]"
                    : "bg-[#ff2a5f]/10 text-[#ff2a5f]"
                }`}
              >
                {drop.up ? "▲" : "▼"} {drop.price}
              </span>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes nightmarket-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════════
          3. FEATURED CASES SECTION
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-6 w-full pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-end justify-between mb-14 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-[#00f0ff] mb-3 font-heading font-bold tracking-wider text-sm">
              <Zap className="size-4" />
              HOT DROPS
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-extrabold uppercase text-white tracking-tight">
              FEATURED CASES
            </h2>
          </div>
          <Link
            href="/cases"
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase font-heading font-bold text-sm tracking-wider"
          >
            View All Cases
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8">
          {FEATURED_CASES.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className={`relative bg-[#05050a] border ${item.borderColor} ${item.hoverBorder} rounded-3xl p-8 cursor-pointer group overflow-hidden transition-all duration-500`}
              style={{
                boxShadow: `0 0 0 rgba(0,0,0,0)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${item.glow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 rgba(0,0,0,0)`;
              }}
            >
              {/* Animated BG Glow */}
              <div
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${item.glowHex}80, transparent 70%)`,
                  filter: "blur(20px)",
                }}
              />

              {/* Tier Badge + Crown */}
              <div className="relative z-10 flex justify-between items-start mb-6">
                <span
                  className="text-xs font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ color: item.accentColor, background: `${item.glowHex}18`, border: `1px solid ${item.glowHex}30` }}
                >
                  {item.tier}
                </span>
                <div className="bg-[#020204] rounded-full p-2 border border-white/5 group-hover:border-white/15 transition-colors">
                  <Crown className="size-5" style={{ color: item.accentColor }} />
                </div>
              </div>

              {/* Floating Package Icon + Visual */}
              <div className="relative z-10 w-full h-44 mb-8 flex items-center justify-center">
                <div
                  className="absolute w-36 h-36 rounded-2xl opacity-15 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700"
                  style={{ background: `linear-gradient(135deg, ${item.glowHex}, transparent)` }}
                />
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Package
                    className="size-24 group-hover:scale-110 transition-transform duration-500"
                    style={{ color: item.accentColor, filter: `drop-shadow(0 0 20px ${item.glowHex}90)` }}
                  />
                </motion.div>
              </div>

              {/* Case Name */}
              <div className="relative z-10">
                <h3 className="font-heading text-2xl font-extrabold text-white mb-1 tracking-tight">
                  {item.name}
                </h3>
                {/* Rarity gradient bar */}
                <div className={`h-0.5 w-16 rounded-full bg-gradient-to-r ${item.gradient} mb-4`} />

                {/* Possible items preview */}
                <div className="space-y-1 mb-6">
                  {item.items.map((skinName, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-slate-500">
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: item.accentColor }}
                      />
                      {skinName}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-heading text-2xl font-extrabold text-white">
                    ${item.price.toFixed(2)}
                  </div>
                  <button
                    className="px-5 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${item.glowHex}30, ${item.glowHex}10)`,
                      border: `1px solid ${item.glowHex}50`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = `linear-gradient(135deg, ${item.glowHex}, ${item.glowHex}80)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = `linear-gradient(135deg, ${item.glowHex}30, ${item.glowHex}10)`;
                    }}
                  >
                    Unlock
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. UPGRADE SYSTEM PREVIEW
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-6 w-full pt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="relative premium-glass rounded-3xl p-10 md:p-16 overflow-hidden border border-[#a100ff]/10"
        >
          {/* Background ambiance */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,42,95,0.12)_0%,transparent_65%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-[radial-gradient(circle_at_30%_70%,rgba(255,170,0,0.08)_0%,transparent_60%)] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center relative z-10">
            {/* Left: Text */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffaa00]/30 bg-[#ffaa00]/10 px-4 py-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[#ffaa00]">
                <Flame className="size-3" />
                High Risk, High Reward
              </div>
              <h2 className="font-heading text-5xl md:text-6xl font-extrabold uppercase text-white tracking-tight leading-none">
                SKIN
                <br />
                <span className="bg-gradient-to-r from-[#ff2a5f] to-[#ffaa00] bg-clip-text text-transparent">
                  UPGRADER
                </span>
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                Don&apos;t settle for your current loadout. Risk your skins for a
                chance to win something legendary. Set your own odds and let the
                wheel decide your fate.
              </p>
              <ul className="space-y-3">
                {["Provably fair algorithm", "Instant win delivery", "Set your own risk level"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                    <CheckCircle className="size-4 text-[#00ff87] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link
                  href="/upgrade"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-heading font-bold uppercase tracking-wider text-white overflow-hidden transition-all duration-500"
                  style={{ background: "linear-gradient(135deg, #ff2a5f, #ffaa00)" }}
                >
                  <RefreshCw className="size-5 group-hover:rotate-180 transition-transform duration-700" />
                  Try Upgrader
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(135deg, #ffaa00, #ff2a5f)" }}
                  />
                </Link>
              </div>
            </div>

            {/* Right: SVG Circular Gauge */}
            <div className="flex justify-center">
              <div className="relative w-72 h-72">
                {/* Outer glow ring */}
                <div
                  className="absolute inset-2 rounded-full"
                  style={{ boxShadow: "0 0 60px rgba(255,42,95,0.25), inset 0 0 40px rgba(255,170,0,0.05)" }}
                />

                {/* Static background circle */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 288 288">
                  <circle
                    cx="144" cy="144" r="124"
                    fill="none"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="16"
                  />
                  {/* Progress arc — 37% of circumference = 0.37 × 2π × 124 ≈ 288 */}
                  <motion.circle
                    cx="144" cy="144" r="124"
                    fill="none"
                    stroke="url(#upgradeGrad)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray="779.3"
                    initial={{ strokeDashoffset: 779.3 }}
                    whileInView={{ strokeDashoffset: 491 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                    transform="rotate(-90 144 144)"
                    style={{ filter: "drop-shadow(0 0 12px rgba(255,42,95,0.8))" }}
                  />
                  <defs>
                    <linearGradient id="upgradeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff2a5f" />
                      <stop offset="100%" stopColor="#ffaa00" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Rotating dashes outer ring */}
                <motion.svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 288 288"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i / 24) * 360;
                    const rad = (angle * Math.PI) / 180;
                    const r = 144;
                    const x1 = 144 + (r - 8) * Math.cos(rad);
                    const y1 = 144 + (r - 8) * Math.sin(rad);
                    const x2 = 144 + (r + 4) * Math.cos(rad);
                    const y2 = 144 + (r + 4) * Math.sin(rad);
                    return (
                      <line
                        key={i}
                        x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={i % 3 === 0 ? "#ff2a5f" : "rgba(255,255,255,0.1)"}
                        strokeWidth={i % 3 === 0 ? 2 : 1}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </motion.svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-6xl font-heading font-extrabold text-white"
                    style={{ textShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                  >
                    37%
                  </motion.span>
                  <span className="text-xs font-heading font-bold text-[#ffaa00] uppercase tracking-widest mt-1">
                    Success Rate
                  </span>
                  <div className="mt-3 flex items-center gap-1.5">
                    <TrendingUp className="size-3 text-[#00ff87]" />
                    <span className="text-[10px] text-[#00ff87] font-bold">Live</span>
                  </div>
                </div>

                {/* Top pointer */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-6 rounded-full"
                  style={{ background: "white", boxShadow: "0 0 12px white, 0 0 24px rgba(255,255,255,0.5)" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          5. TRENDING SKINS
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-6 w-full pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-end justify-between mb-14 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-[#00ff87] mb-3 font-heading font-bold tracking-wider text-sm">
              <Crown className="size-4" />
              ELITE TIER
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-extrabold uppercase text-white tracking-tight">
              TRENDING SKINS
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase font-heading font-bold text-sm tracking-wider"
          >
            Explore Market
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {featuredListings.map((listing, i) => {
            const gradients = [
              "from-[#a100ff] via-[#5500cc] to-[#00f0ff]",
              "from-[#ff2a5f] via-[#cc0033] to-[#ffaa00]",
              "from-[#00ff87] via-[#00cc66] to-[#00f0ff]",
              "from-[#ffaa00] via-[#ff6600] to-[#ff2a5f]",
            ];
            const glows = ["rgba(161,0,255,0.4)", "rgba(255,42,95,0.4)", "rgba(0,255,135,0.4)", "rgba(255,170,0,0.4)"];
            const g = gradients[i % 4];
            const glow = glows[i % 4];
            return (
              <motion.div
                key={listing.id || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
                whileHover={{ y: -8 }}
                className="relative bg-[#05050a] border border-white/5 hover:border-white/15 rounded-2xl p-6 cursor-pointer group overflow-hidden transition-all duration-300"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${glow}18, transparent 70%)` }}
                />

                <div className="relative z-10">
                  {/* Top bar */}
                  <div className="flex justify-between items-start mb-5">
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider bg-[#020204] px-2.5 py-1 rounded-lg border border-white/5 text-[#ffaa00]">
                      FN 0.01
                    </span>
                    <button className="group/heart">
                      <Heart className="size-4 text-slate-600 group-hover/heart:text-[#ff2a5f] group-hover/heart:fill-[#ff2a5f] transition-all duration-200" />
                    </button>
                  </div>

                  {/* Skin image placeholder */}
                  <div className="h-36 mb-6 relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-transparent to-white/[0.02]">
                    {/* Gradient "skin" bar */}
                    <motion.div
                      className={`w-32 h-10 bg-gradient-to-r ${g} rounded-full`}
                      style={{ filter: `drop-shadow(0 0 12px ${glow})` }}
                      animate={{ rotate: [-10, -6, -10] }}
                      transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Second bar */}
                    <motion.div
                      className={`absolute w-20 h-6 bg-gradient-to-r ${g} rounded-full opacity-50`}
                      style={{ top: "60%", left: "30%" }}
                      animate={{ rotate: [-8, -4, -8], x: [0, 4, 0] }}
                      transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>

                  {/* Skin info */}
                  <div className="mb-5">
                    <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                      {listing.skin.category || "Rifle"}
                    </div>
                    <div className="text-base font-bold text-white group-hover:text-[#00f0ff] transition-colors truncate">
                      {listing.skin.name || "M4A4 | Neo-Noir"}
                    </div>
                  </div>

                  {/* Price + Buy */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[9px] font-heading font-bold uppercase tracking-widest text-slate-600 mb-0.5">
                        Price
                      </div>
                      <div className="text-xl font-heading font-bold text-[#00ff87]">
                        ${listing.askPrice || "250.00"}
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#020204] border border-[#00ff87]/20 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-[#00ff87] hover:bg-[#00ff87] hover:text-[#020204] transition-all duration-200">
                      Buy
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. PLATFORM STATS
      ═══════════════════════════════════════════ */}
      <section
        ref={platformRef}
        className="mt-24 bg-[#05050a]/60 border-y border-white/5 backdrop-blur-md py-20"
      >
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <ShieldCheck className="size-8" />,
                color: "#a100ff",
                glow: "rgba(161,0,255,0.3)",
                stat: "100%",
                label: "Provably Fair",
                desc: "Every case opening and upgrade uses a cryptographically verified algorithm.",
              },
              {
                icon: <Users className="size-8" />,
                color: "#00f0ff",
                glow: "rgba(0,240,255,0.3)",
                stat: "2.4M+",
                label: "Global Users",
                desc: "Join millions of traders worldwide in the most trusted CS2 marketplace.",
              },
              {
                icon: <Trophy className="size-8" />,
                color: "#ffaa00",
                glow: "rgba(255,170,0,0.3)",
                stat: "$80M+",
                label: "Volume Traded",
                desc: "Over $80 million in skins exchanged with near-zero fees and instant payouts.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={platformInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="flex flex-col items-center text-center group cursor-default"
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500"
                  style={{
                    backgroundColor: `${item.color}12`,
                    borderColor: `${item.color}25`,
                    color: item.color,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${item.glow}`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${item.color}60`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.borderColor = `${item.color}25`;
                  }}
                >
                  {item.icon}
                </div>
                <div className="font-heading text-5xl font-extrabold text-white mb-2">{item.stat}</div>
                <div
                  className="text-sm font-heading font-bold uppercase tracking-widest mb-4"
                  style={{ color: item.color }}
                >
                  {item.label}
                </div>
                <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-6 w-full pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-[#a100ff] mb-4 font-heading font-bold tracking-wider text-sm">
            <Star className="size-4" />
            SIMPLE PROCESS
          </div>
          <h2 className="font-heading text-4xl md:text-6xl font-extrabold uppercase text-white tracking-tight">
            HOW IT WORKS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting gradient line (desktop) */}
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px"
            style={{ background: "linear-gradient(90deg, #a100ff, #00f0ff, #00ff87)" }}
          />

          {HOW_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="flex flex-col items-center text-center relative"
            >
              {/* Number badge */}
              <div
                className="relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center mb-8 border-2 bg-[#05050a]"
                style={{ borderColor: step.color, boxShadow: `0 0 20px ${step.color}40` }}
              >
                <div style={{ color: step.color }}>{step.icon}</div>
                <div
                  className="text-xs font-heading font-extrabold mt-1"
                  style={{ color: step.color }}
                >
                  {step.num}
                </div>
              </div>
              <h3 className="font-heading text-xl font-extrabold text-white uppercase tracking-tight mb-3">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. RECENT BIG WINS
      ═══════════════════════════════════════════ */}
      <section className="max-w-[1600px] mx-auto px-6 w-full pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-end justify-between mb-14 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-[#ff2a5f] mb-3 font-heading font-bold tracking-wider text-sm">
              <Flame className="size-4" />
              HALL OF FAME
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-extrabold uppercase text-white tracking-tight">
              RECENT BIG WINS
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BIG_WINS.map((win, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="relative bg-[#05050a] border border-white/5 hover:border-white/10 rounded-2xl p-6 group overflow-hidden transition-all duration-300 cursor-pointer"
            >
              {/* BG accent */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${win.color}20, transparent 70%)`,
                  transform: "translate(30%, -30%)",
                }}
              />

              <div className="relative z-10 flex items-start gap-4">
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-heading font-extrabold text-lg text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${win.color}60, ${win.color}20)`, border: `1px solid ${win.color}40` }}
                >
                  {win.user}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white truncate">{win.username}</span>
                    <span className="text-[10px] text-slate-600 font-medium ml-2 flex-shrink-0">{win.ago}</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-2 truncate">won</div>
                  <div className="text-sm font-bold text-slate-300 truncate mb-2">{win.item}</div>
                  <div
                    className="text-lg font-heading font-extrabold"
                    style={{ color: "#00ff87" }}
                  >
                    {win.value}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
