"use client";

import React, { useState } from "react";
import { useSocketEvent } from "@/components/providers/socket-provider";
import { motion, AnimatePresence } from "framer-motion";

interface LiveEvent {
  id: string;
  type: "trade" | "case" | "upgrade" | "battle";
  user: string;
  item: string;
  image: string;
  rarity: string;
  value: number;
}

const rarityColors: Record<string, string> = {
  "Covert": "from-red-500/20 to-red-500/5 border-red-500/20",
  "Classified": "from-pink-500/20 to-pink-500/5 border-pink-500/20",
  "Restricted": "from-purple-500/20 to-purple-500/5 border-purple-500/20",
  "Mil-Spec": "from-blue-500/20 to-blue-500/5 border-blue-500/20",
  "Consumer Grade": "from-slate-500/20 to-slate-500/5 border-slate-500/20",
  "Extraordinary": "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20",
};

export function LiveActivityFeed() {
  const [events, setEvents] = useState<LiveEvent[]>([
    { id: "1", type: "case", user: "Alex", item: "AWP | Dragon Lore", image: "", rarity: "Covert", value: 1500 },
    { id: "2", type: "upgrade", user: "Max", item: "M9 Bayonet", image: "", rarity: "Extraordinary", value: 800 },
    { id: "3", type: "trade", user: "Elena", item: "AK-47 | Redline", image: "", rarity: "Classified", value: 50 },
    { id: "4", type: "battle", user: "Kev", item: "Glock-18 | Fade", image: "", rarity: "Covert", value: 400 },
  ]);
  const [onlineUsers, setOnlineUsers] = useState(1);

  useSocketEvent("live_event", (newEvent: LiveEvent) => {
    setEvents((prev) => [newEvent, ...prev.slice(0, 15)]);
  });

  useSocketEvent("online_users", (count: number) => {
    setOnlineUsers(count);
  });

  return (
    <div className="border-b border-white/5 bg-[#020204]/80 backdrop-blur-md">
      <div className="flex items-center gap-4 overflow-x-auto py-2 px-4 scrollbar-none">
        <div className="flex items-center gap-4 text-xs font-bold uppercase whitespace-nowrap">
          <div className="flex items-center gap-2 text-flame">
            <span className="size-2 rounded-full bg-flame animate-pulse" />
            Live Activity
          </div>
          <div className="flex items-center gap-2 text-emerald-500">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            {onlineUsers} Online
          </div>
        </div>
        
        <div className="flex gap-2">
          <AnimatePresence initial={false}>
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`flex items-center gap-3 rounded-lg border bg-[#05050a] p-1.5 pr-3 text-xs min-w-[180px] ${
                  rarityColors[event.rarity] || "from-slate-500/20 to-slate-500/5 border-white/5"
                }`}
              >
                <div className="size-8 rounded-md bg-black/40 flex items-center justify-center overflow-hidden">
                  {event.image ? (
                    <img src={event.image} alt={event.item} className="size-6 object-contain" />
                  ) : (
                    <span className="text-white/30 text-xs">CS2</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{event.item}</div>
                  <div className="text-slate-500 flex items-center justify-between gap-1">
                    <span className="truncate max-w-[80px]">{event.user}</span>
                    <span className="text-emerald-500 font-medium">${event.value}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
