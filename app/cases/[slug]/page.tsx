"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { Shield, Volume2, VolumeX, RotateCcw } from "lucide-react";
import Image from "next/image";

interface SpinnerItem {
  id: string; skinId: string; name: string; image: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY"; dropRate: number; value: number;
}

const RARITY_COLORS: Record<string, string> = {
  COMMON: "#94a3b8", RARE: "#38bdf8", EPIC: "#a855f7", LEGENDARY: "#fbbf24",
};
const RARITY_BORDERS: Record<string, string> = {
  COMMON: "border-slate-400/40", RARE: "border-sky-400/40", EPIC: "border-purple-500/40", LEGENDARY: "border-amber-400/60",
};
const RARITY_BG: Record<string, string> = {
  COMMON: "from-slate-500/10", RARE: "from-sky-500/10", EPIC: "from-purple-500/10", LEGENDARY: "from-amber-500/10",
};

const CASE_NAMES: Record<string, string> = {
  "phantom-collection": "Phantom Collection",
  "neon-rush": "Neon Rush",
  "dragon-lore": "Dragon Lore Collection",
  "budget-blaster": "Budget Blaster",
};
const CASE_PRICES: Record<string, number> = {
  "phantom-collection": 4.99, "neon-rush": 2.49, "dragon-lore": 9.99, "budget-blaster": 0.99,
};

export default function CaseOpenPage() {
  const { slug } = useParams<{ slug: string }>();
  const [reel, setReel] = useState<SpinnerItem[]>([]);
  const [wonItem, setWonItem] = useState<SpinnerItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [clientSeed, setClientSeed] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const reelRef = useRef<HTMLDivElement>(null);

  const [possibleItems, setPossibleItems] = useState<SpinnerItem[]>([]);

  useEffect(() => {
    setClientSeed(Math.random().toString(36).substring(2, 18));
    if (slug) {
      fetch(`/api/cases/${slug}`)
        .then(r => r.json())
        .then(data => { if (data.items) setPossibleItems(data.items); })
        .catch(() => {});
    }
  }, [slug]);

  const openCase = useCallback(async () => {
    if (isSpinning || !slug) return;
    setIsSpinning(true);
    setShowResult(false);
    setWonItem(null);

    try {
      const res = await fetch("/api/cases/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseSlug: slug, clientSeed }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to open case");
        setIsSpinning(false);
        return;
      }

      const data = await res.json();
      setReel(data.reel);
      setWonItem(data.won);
      setBalance(data.newBalance);

      // Start animation - scroll to winning position
      if (reelRef.current) {
        reelRef.current.style.transition = "none";
        reelRef.current.style.transform = "translateX(0)";

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (reelRef.current) {
              // Item width is 128px + 8px gap = 136px. Win position is index 32.
              const offset = 32 * 136 - (window.innerWidth / 2) + 64;
              reelRef.current.style.transition = "transform 4s cubic-bezier(0.15, 0.85, 0.35, 1)";
              reelRef.current.style.transform = `translateX(-${offset}px)`;
            }
          });
        });
      }

      // Show result after animation
      setTimeout(() => {
        setShowResult(true);
        setIsSpinning(false);
      }, 4500);
    } catch {
      setIsSpinning(false);
    }
  }, [slug, clientSeed, isSpinning]);

  const caseName = CASE_NAMES[slug ?? ""] ?? slug;
  const casePrice = CASE_PRICES[slug ?? ""] ?? 2.99;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Case Header */}
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl uppercase tracking-[0.12em] text-white sm:text-4xl">
          {caseName}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Price: <span className="font-bold text-glow">${casePrice.toFixed(2)}</span>
          {balance !== null && <> • Balance: <span className="font-bold text-white">${balance.toFixed(2)}</span></>}
        </p>
      </div>

      {/* Spinner Container */}
      <div className="glass-card relative mb-12 overflow-hidden rounded-[2.5rem]">
        {/* Center indicator */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-0.5 -translate-x-1/2 bg-glow shadow-[0_0_20px_rgba(89,242,196,0.6)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2">
          <div className="h-0 w-0 border-l-[10px] border-r-[10px] border-t-[14px] border-l-transparent border-r-transparent border-t-glow" />
        </div>
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 -translate-x-1/2 rotate-180">
          <div className="h-0 w-0 border-l-[10px] border-r-[10px] border-t-[14px] border-l-transparent border-r-transparent border-t-glow" />
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-card to-transparent" />

        {/* Reel */}
        <div className="overflow-hidden py-8">
          <div ref={reelRef} className="flex gap-2" style={{ willChange: "transform" }}>
            {reel.length > 0 ? reel.map((item, i) => (
              <div key={`${item.id}-${i}`}
                className={`flex h-32 w-32 flex-shrink-0 flex-col items-center justify-center rounded-2xl border bg-gradient-to-b to-transparent p-2 ${RARITY_BORDERS[item.rarity]} ${RARITY_BG[item.rarity]}`}>
                <div className="mb-1 relative h-16 w-full flex items-center justify-center drop-shadow-lg">
                  <Image src={item.image || "/skins/placeholder.png"} alt={item.name} width={80} height={60} className="object-contain" />
                </div>
                <div className="w-full truncate text-center text-[10px] font-medium text-white">{item.name.split("|")[1]?.trim() || item.name}</div>
                <div className="mt-0.5 text-[10px] font-bold" style={{ color: RARITY_COLORS[item.rarity] }}>${item.value.toFixed(2)}</div>
              </div>
            )) : (
              // Placeholder items
              Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-surface/40">
                  <span className="text-2xl opacity-30">❓</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Open Button */}
      <div className="mb-10 text-center">
        <button onClick={openCase} disabled={isSpinning}
          className={`btn-premium-solid group relative rounded-full px-16 py-6 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
            isSpinning
              ? "opacity-50"
              : ""
          }`}>
          {isSpinning ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Opening...
            </span>
          ) : (
            <span>Open for ${casePrice.toFixed(2)}</span>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button onClick={() => setClientSeed(Math.random().toString(36).substring(2, 18))}
            className="flex items-center gap-1.5 text-xs text-muted transition hover:text-white">
            <RotateCcw className="size-3" /> New Seed
          </button>
          <button onClick={() => setMuted(!muted)}
            className="flex items-center gap-1.5 text-xs text-muted transition hover:text-white">
            {muted ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>

      {/* Win Result */}
      {showResult && wonItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md" onClick={() => setShowResult(false)}>
          <div className={`glass-card mx-4 w-full max-w-sm rounded-[2.5rem] border p-10 text-center animate-[scaleIn_0.4s_ease-out] ${RARITY_BORDERS[wonItem.rarity]}`}
            style={{ boxShadow: `0 0 80px ${RARITY_COLORS[wonItem.rarity]}30` }}
            onClick={e => e.stopPropagation()}>

            {wonItem.rarity === "LEGENDARY" && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="absolute animate-ping text-amber-400" style={{
                    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`, animationDuration: `${1 + Math.random() * 2}s`,
                    fontSize: `${8 + Math.random() * 12}px`,
                  }}>✦</div>
                ))}
              </div>
            )}

            <div className="relative">
              <div className="mb-4 flex items-center justify-center h-40">
                <Image src={wonItem.image || "/skins/placeholder.png"} alt={wonItem.name} width={200} height={150} className="object-contain drop-shadow-2xl" />
              </div>
              <div className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: RARITY_COLORS[wonItem.rarity] }}>
                {wonItem.rarity}
              </div>
              <h2 className="font-heading text-xl uppercase text-white">{wonItem.name}</h2>
              <div className="mt-2 text-3xl font-bold" style={{ color: RARITY_COLORS[wonItem.rarity] }}>
                ${wonItem.value.toFixed(2)}
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-surface/60 p-3">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Shield className="size-3" /> Provably Fair Result
                </div>
              </div>

              <button onClick={() => setShowResult(false)}
                className="btn-premium mt-8 w-full rounded-full px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case Contents */}
      <div className="glass-card rounded-[2.5rem] p-10">
        <h3 className="text-xs uppercase tracking-[0.3em] text-glow">Possible Drops</h3>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(possibleItems.length > 0
            ? possibleItems
            : reel.length > 0
            ? [...new Map(reel.map(i => [i.id, i])).values()]
            : []
          ).sort((a, b) => b.value - a.value).map(item => (
            <div key={item.id}
              className={`rounded-2xl border p-4 ${RARITY_BORDERS[item.rarity]} bg-gradient-to-b ${RARITY_BG[item.rarity]} to-transparent`}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: RARITY_COLORS[item.rarity] }}>
                  {item.rarity}
                </div>
                <div className="text-xs text-muted">{(item.dropRate * 100).toFixed(1)}%</div>
              </div>
              <div className="my-4 flex items-center justify-center h-20">
                <Image src={item.image || "/skins/placeholder.png"} alt={item.name} width={100} height={75} className="object-contain drop-shadow-md" />
              </div>
              <div className="mt-2 truncate text-sm font-medium text-white">{item.name}</div>
              <div className="mt-1 text-sm font-bold" style={{ color: RARITY_COLORS[item.rarity] }}>${item.value.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
