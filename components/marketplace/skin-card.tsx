"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, ShieldCheck, Crosshair } from "lucide-react";
import { motion } from "framer-motion";

export interface Skin {
  name: string;
  category: string;
  rarity: string;
  exterior: string;
  wear: number;
  image: string;
  slug: string;
  finishStyle: string;
}

export interface Listing {
  id: string;
  askPrice: number;
  sellerName: string;
  skin: Skin;
}

interface SkinCardProps {
  listing: Listing;
  onBuy?: (id: string) => void;
}

const RARITY_MAP: Record<string, { border: string; glow: string; text: string; bg: string }> = {
  "Covert":           { border: "border-[#FF4040]/60", glow: "hover:shadow-[0_0_20px_rgba(255,64,64,0.3)]", text: "text-[#FF4040]", bg: "bg-[#FF4040]" },
  "Classified":       { border: "border-[#d32ce6]/60", glow: "hover:shadow-[0_0_20px_rgba(211,44,230,0.3)]", text: "text-[#d32ce6]", bg: "bg-[#d32ce6]" },
  "Restricted":       { border: "border-[#8847ff]/60", glow: "hover:shadow-[0_0_20px_rgba(136,71,255,0.3)]", text: "text-[#8847ff]", bg: "bg-[#8847ff]" },
  "Mil-Spec":         { border: "border-[#4b69ff]/60", glow: "hover:shadow-[0_0_20px_rgba(75,105,255,0.3)]", text: "text-[#4b69ff]", bg: "bg-[#4b69ff]" },
  "Industrial Grade": { border: "border-[#b0c3d9]/50", glow: "hover:shadow-[0_0_20px_rgba(176,195,217,0.2)]", text: "text-[#b0c3d9]", bg: "bg-[#b0c3d9]" },
  "Consumer Grade":   { border: "border-white/10",     glow: "hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]", text: "text-slate-400", bg: "bg-slate-400" },
  "Extraordinary":    { border: "border-[#FFD700]/60", glow: "hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]", text: "text-[#FFD700]", bg: "bg-[#FFD700]" },
};

function getWearBadge(exterior: string) {
  const map: Record<string, string> = {
    "Factory New": "FN",
    "Minimal Wear": "MW",
    "Field-Tested": "FT",
    "Well-Worn": "WW",
    "Battle-Scarred": "BS",
  };
  return map[exterior] || exterior;
}

export function SkinCard({ listing, onBuy }: SkinCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const { skin, askPrice, sellerName } = listing;
  const rarityConfig = RARITY_MAP[skin.rarity] || RARITY_MAP["Mil-Spec"];
  
  // Calculate float position (0 to 1) -> 0% to 100%
  const wearPct = `${Math.min(100, Math.max(0, skin.wear * 100))}%`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group flex flex-col rounded-2xl bg-[#05050a] border border-white/5 transition-all duration-300 overflow-hidden relative cursor-pointer ${rarityConfig.glow}`}
    >
      {/* Rarity Left Accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${rarityConfig.bg} opacity-80 z-20`} />

      {/* Top Info Row */}
      <div className="flex items-center justify-between p-3 pb-0 z-10 relative">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-white bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/5">
            {getWearBadge(skin.exterior)}
          </span>
          <span className="text-[10px] font-bold text-slate-400 font-mono">
            {skin.wear.toFixed(4)}
          </span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="text-slate-500 hover:text-[#ff2a5f] transition-colors p-1"
        >
          <Heart className={`size-4 ${isLiked ? 'fill-[#ff2a5f] text-[#ff2a5f]' : ''}`} />
        </button>
      </div>

      {/* Image Area */}
      <div className="relative h-32 w-full flex items-center justify-center p-4">
        {/* Ambient background glow based on rarity */}
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-${rarityConfig.bg.replace('bg-', '')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <motion.div animate={isHovered ? { scale: 1.05, rotate: -2 } : { scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300 }}>
          {skin.image ? (
            <Image
              src={skin.image}
              alt={skin.name}
              width={160}
              height={160}
              unoptimized
              className="max-h-full max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            />
          ) : (
            <div className={`w-20 h-20 rounded-xl ${rarityConfig.bg} opacity-20 flex items-center justify-center`}>
              <Crosshair className="size-8 text-white/50" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Float Visualizer Bar */}
      <div className="px-3">
        <div className="h-1 w-full bg-[#020204] rounded-full overflow-hidden relative">
          {/* Float gradient: FN(green) -> MW(yellow) -> FT(orange) -> WW(red) -> BS(dark red) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff87] via-[#ffaa00] to-[#ff2a5f] opacity-50" />
          {/* Current wear indicator pointer */}
          <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_5px_white]" style={{ left: wearPct }} />
        </div>
      </div>

      {/* Details Area */}
      <div className="p-3 pt-2 flex flex-col flex-1">
        <div className="flex-1">
          <div className={`text-[9px] font-heading font-bold uppercase tracking-widest ${rarityConfig.text} mb-0.5`}>
            {skin.category} • {skin.rarity}
          </div>
          <div className="text-sm font-bold text-white truncate leading-tight group-hover:text-[#00f0ff] transition-colors">
            {skin.name}
          </div>
        </div>
        
        <div className="mt-3 flex items-end justify-between border-t border-white/5 pt-3">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-heading tracking-wider flex items-center gap-1">
              <ShieldCheck className="size-3" /> {sellerName}
            </div>
            <div className="font-heading text-lg font-bold text-[#00ff87]">
              ${askPrice.toFixed(2)}
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onBuy?.(listing.id); }}
            className="px-4 py-2 bg-gradient-to-r from-[#00ff87]/20 to-[#00f0ff]/20 border border-[#00ff87]/30 text-[#00ff87] text-[10px] font-heading font-bold uppercase tracking-wider rounded-lg hover:bg-[#00ff87]/30 transition-all shadow-[0_0_10px_rgba(0,255,135,0.1)]"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
