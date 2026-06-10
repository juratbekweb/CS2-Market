"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sword, Package, Trophy, AlertCircle, RefreshCcw, Swords } from "lucide-react";

interface BattleItem {
  id: string;
  name: string;
  value: number;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  isReady: boolean;
  totalWon: number;
  items: BattleItem[];
}

export default function BattleRoomPage() {
  const params = useParams();
  const id = params.id as string;

  const [status, setStatus] = useState<"WAITING" | "STARTING" | "IN_PROGRESS" | "COMPLETED">("WAITING");
  const [countdown, setCountdown] = useState(3);
  const [currentRound, setCurrentRound] = useState(0);
  
  // Mock data
  const totalRounds = 5;
  const cases = [
    { name: "Neon Overdrive", price: 29.99, image: "📦" },
    { name: "Emerald Fury", price: 49.99, image: "📦" },
    { name: "Golden Heist", price: 99.99, image: "📦" },
    { name: "Neon Overdrive", price: 29.99, image: "📦" },
    { name: "Emerald Fury", price: 49.99, image: "📦" },
  ];

  const [players, setPlayers] = useState<Player[]>([
    { id: "p1", name: "DragonSlayer99", avatar: "D", isReady: true, totalWon: 0, items: [] },
    { id: "p2", name: "NightHunter", avatar: "N", isReady: false, totalWon: 0, items: [] },
  ]);

  // Simulate battle flow
  useEffect(() => {
    if (status === "STARTING") {
      const timer = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(timer);
            setStatus("IN_PROGRESS");
            setCurrentRound(1);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  useEffect(() => {
    if (status === "IN_PROGRESS" && currentRound <= totalRounds) {
      const timer = setTimeout(() => {
        setPlayers(prev => prev.map(p => {
          const wonValue = Math.floor(Math.random() * 100) + 10;
          return {
            ...p,
            totalWon: p.totalWon + wonValue,
            items: [...p.items, {
              id: `${p.id}-round-${currentRound}`,
              name: `Round ${currentRound}`,
              value: wonValue,
            }]
          };
        }));

        if (currentRound < totalRounds) {
          setCurrentRound(c => c + 1);
        } else {
          setStatus("COMPLETED");
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status, currentRound, totalRounds]);

  const handleStartSim = () => {
    setPlayers(p => [p[0], { ...p[1], isReady: true }]);
    setStatus("STARTING");
  };

  const winner = status === "COMPLETED" 
    ? [...players].sort((a, b) => b.totalWon - a.totalWon)[0]
    : null;

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-80px)] flex flex-col relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-0">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-[#ff2a5f]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-[#00f0ff]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 shrink-0 relative z-10 w-full">
        <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
          <Link href="/battle" className="shrink-0 p-3 sm:p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all shadow-lg">
            <ArrowLeft className="size-5 sm:size-6 text-white" />
          </Link>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs font-heading font-bold uppercase tracking-widest text-slate-400 mb-1">Battle #{id.substring(0, 8)}</div>
            <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 flex items-center gap-2 sm:gap-3">
              <Sword className="size-5 sm:size-6 lg:size-8 text-[#ff2a5f] shrink-0" /> 
              <span className="truncate">{players.length} PLAYER BATTLE</span>
            </h1>
          </div>
        </div>
        
        {/* Cases timeline (Hidden on very small mobile, scrolls on medium, full on desktop) */}
        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 sm:p-2 overflow-x-auto max-w-full custom-scrollbar">
          {cases.map((c, i) => (
            <div key={i} className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border transition-all duration-500 ${
              currentRound > i + 1 ? "bg-white/5 border-white/10 opacity-50 grayscale" :
              currentRound === i + 1 ? "bg-gradient-to-br from-[#00f0ff]/20 to-[#00f0ff]/5 border-[#00f0ff]/50 shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-110" :
              "bg-[#020204]/80 border-white/5 hover:border-white/20"
            }`}>
              <Package className={`size-4 sm:size-5 ${currentRound === i + 1 ? "text-[#00f0ff]" : "text-slate-500"}`} />
            </div>
          ))}
        </div>

        <div className="flex justify-between md:block w-full md:w-auto text-left md:text-right bg-white/5 md:bg-transparent p-3 md:p-0 rounded-2xl md:rounded-none border border-white/10 md:border-none backdrop-blur-md md:backdrop-blur-none">
          <div className="text-[10px] sm:text-xs font-heading font-bold uppercase tracking-widest text-slate-400 mb-0.5 md:mb-1">Total Value</div>
          <div className="font-heading text-lg sm:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-[#ffea00] drop-shadow-[0_0_10px_rgba(255,170,0,0.3)]">
            ${cases.reduce((sum, c) => sum + c.price, 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Main Battle Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 relative z-10 w-full">
        {/* VS Badge (Desktop only, absolutely positioned in center) */}
        <div className="hidden lg:flex absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 items-center justify-center pointer-events-none">
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-r from-[#ff2a5f] to-[#00f0ff] rounded-full blur-[20px] opacity-30 animate-pulse" />
             <div className="w-16 h-16 rounded-full bg-[#05050a] border-2 border-white/10 flex items-center justify-center font-heading font-black text-2xl italic text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 shadow-2xl relative z-10 backdrop-blur-xl">
               VS
             </div>
          </div>
        </div>

        {players.map((player) => {
          const isWinner = winner?.id === player.id;
          const isLoser = status === "COMPLETED" && !isWinner;
          
          return (
            <div key={player.id} className="relative flex-1 bg-[#05050a]/60 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col overflow-hidden w-full transition-all duration-700 shadow-2xl">
              
              {/* Winner Glow Background */}
              {isWinner && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#ffaa00]/10 to-transparent pointer-events-none z-0" />
              )}

              {/* Player Header */}
              <div className={`p-4 sm:p-5 lg:p-6 border-b flex items-center justify-between z-10 bg-white/5 backdrop-blur-md transition-all duration-500 ${
                isWinner ? "border-[#ffaa00]/50 shadow-[0_10px_30px_rgba(255,170,0,0.15)]" : "border-white/10"
              }`}>
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden pr-2">
                  <div className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center font-heading font-bold text-xl sm:text-2xl shadow-inner ${
                    isWinner ? "bg-gradient-to-br from-[#ffaa00] to-[#ff2a5f] text-white shadow-[0_0_20px_rgba(255,170,0,0.4)]" : "bg-gradient-to-br from-white/10 to-white/5 text-white/90 border border-white/10"
                  }`}>
                    {player.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className={`font-bold text-sm sm:text-base lg:text-lg truncate tracking-wide ${isWinner ? "text-white" : "text-slate-200"}`}>{player.name}</div>
                    <div className={`text-[10px] sm:text-xs font-heading font-bold uppercase tracking-widest mt-0.5 sm:mt-1 flex items-center gap-1.5 ${
                      status === "WAITING" ? (player.isReady ? "text-[#00ff87]" : "text-[#ff2a5f]") : "text-[#00f0ff]"
                    }`}>
                      {status === "WAITING" ? (
                        <>
                          <div className={`w-1.5 h-1.5 rounded-full ${player.isReady ? "bg-[#00ff87] animate-pulse" : "bg-[#ff2a5f]"}`} />
                          {player.isReady ? "READY" : "WAITING"}
                        </>
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
                          PLAYING
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <div className="text-[10px] sm:text-xs font-heading font-bold uppercase tracking-widest text-slate-400 mb-0.5 sm:mb-1">Total Won</div>
                  <div className={`font-heading text-lg sm:text-xl lg:text-3xl font-extrabold tracking-tight ${
                    isWinner ? "text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-[#ffea00]" : "text-transparent bg-clip-text bg-gradient-to-r from-[#00ff87] to-[#00f0ff]"
                  }`}>
                    ${player.totalWon.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Case Opening Area */}
              <div className="flex-1 relative flex flex-col p-4 sm:p-5 lg:p-6 min-h-[300px] lg:min-h-[400px]">
                {status === "WAITING" && !player.isReady && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-[#020204]/60 backdrop-blur-sm z-20"
                  >
                     <div className="text-center">
                       <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-[spin_3s_linear_infinite]">
                         <RefreshCcw className="size-6 sm:size-8 text-slate-500" />
                       </div>
                       <div className="text-xs sm:text-sm font-heading font-bold uppercase tracking-widest text-slate-400">Waiting for opponent...</div>
                     </div>
                  </motion.div>
                )}

                {/* Current Round Animation Box */}
                {status === "IN_PROGRESS" && (
                  <div className="h-40 sm:h-48 lg:h-56 border border-white/10 rounded-2xl bg-gradient-to-b from-white/5 to-transparent mb-4 sm:mb-6 flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-inner">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)]" />
                    
                    {/* Fake roulette animation */}
                    <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
                      <motion.div 
                        key={`round-${currentRound}`}
                        initial={{ scale: 0.8, opacity: 0, y: -10 }}
                        animate={{ scale: [0.8, 1.1, 1], opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="text-[#00f0ff] font-heading font-black text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                      >
                        ROUND {currentRound}
                      </motion.div>
                      
                      <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-b from-[#05050a] to-[#020204] border border-[#00f0ff]/30 flex items-center justify-center overflow-hidden relative shadow-[0_0_30px_rgba(0,240,255,0.15)]">
                         <div className="absolute inset-0 bg-white/5 z-0" />
                         <motion.div 
                           animate={{ y: [150, 0] }}
                           transition={{ duration: 3, ease: "easeOut" }}
                           className="text-4xl sm:text-5xl lg:text-6xl relative z-10 filter drop-shadow-lg"
                         >
                           {cases[currentRound - 1]?.image || "🎁"}
                         </motion.div>
                         <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-[#020204] to-transparent z-20 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Won Items Grid */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pb-2">
                  <div className="grid grid-cols-2 min-[400px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    <AnimatePresence>
                      {player.items.map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                          className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-3 sm:p-4 text-center hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-lg group"
                        >
                          <div className="h-16 sm:h-20 flex items-center justify-center bg-[#020204]/80 rounded-xl mb-3 text-2xl sm:text-3xl border border-white/5 group-hover:border-white/10 transition-colors shadow-inner">
                            🔫
                          </div>
                          <div className="text-[10px] sm:text-xs font-bold text-slate-300 truncate mb-1">Item {idx + 1}</div>
                          <div className="text-xs sm:text-sm font-heading font-extrabold text-[#00ff87] tracking-wide">${item.value.toFixed(2)}</div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Winner Overlay */}
                <AnimatePresence>
                  {isWinner && (
                    <motion.div 
                      initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
                      animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                      className="absolute inset-0 bg-[#ffaa00]/10 flex flex-col items-center justify-center z-30 border border-[#ffaa00]/50 rounded-b-3xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,170,0,0.2)_0%,transparent_70%)]" />
                      <motion.div 
                        initial={{ scale: 0.5, y: 50, opacity: 0 }} 
                        animate={{ scale: 1, y: 0, opacity: 1 }} 
                        transition={{ type: "spring", damping: 15, delay: 0.2 }}
                        className="text-center relative z-10"
                      >
                        <motion.div
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                          <Trophy className="size-24 sm:size-32 text-[#ffea00] mx-auto mb-6 drop-shadow-[0_0_40px_rgba(255,170,0,0.8)]" />
                        </motion.div>
                        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#ffaa00] uppercase tracking-widest mb-3 drop-shadow-xl">Winner!</h2>
                        <div className="text-lg sm:text-xl lg:text-2xl text-[#ffea00] font-heading font-bold tracking-widest bg-black/40 px-6 py-2 rounded-full border border-[#ffaa00]/30 inline-block">Takes everything</div>
                      </motion.div>
                    </motion.div>
                  )}
                  {isLoser && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-[#020204]/80 backdrop-blur-sm flex items-center justify-center z-30 rounded-b-3xl"
                    >
                       <div className="text-center opacity-60">
                         <AlertCircle className="size-16 sm:size-20 text-slate-600 mx-auto mb-4" />
                         <div className="text-base sm:text-lg font-heading font-bold text-slate-500 uppercase tracking-widest">Defeated</div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center Overlays */}
      <AnimatePresence>
        {status === "STARTING" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-[#020204]/80 backdrop-blur-lg"
          >
            <div className="text-center">
              <div className="text-sm sm:text-base font-heading font-bold uppercase tracking-widest text-[#ff2a5f] mb-4 sm:mb-6 animate-pulse">Battle Starting In</div>
              <motion.div 
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                className="font-heading text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-[#ff2a5f] drop-shadow-[0_0_60px_rgba(255,42,95,0.8)]"
              >
                {countdown}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls */}
      <div className="mt-8 sm:mt-10 flex justify-center shrink-0 relative z-10 w-full px-4">
        {status === "WAITING" && (
          <button 
            onClick={handleStartSim}
            className="w-full sm:w-auto px-8 sm:px-16 py-4 sm:py-5 bg-gradient-to-r from-[#ff2a5f] via-[#ff2a5f] to-[#ffaa00] bg-[length:200%_auto] animate-gradient text-white rounded-2xl font-heading font-black uppercase tracking-widest text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_rgba(255,42,95,0.4)] hover:shadow-[0_0_60px_rgba(255,42,95,0.6)] flex items-center justify-center gap-3"
          >
            <Swords className="size-5 sm:size-6" /> Simulate Start (Demo)
          </button>
        )}
        {status === "COMPLETED" && (
          <Link 
            href="/battle"
            className="w-full sm:w-auto px-8 sm:px-16 py-4 sm:py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-heading font-bold uppercase tracking-widest text-sm sm:text-base hover:bg-white/10 hover:border-white/20 transition-all text-center flex items-center justify-center gap-3 shadow-lg"
          >
            <ArrowLeft className="size-5 sm:size-6" /> Return to Arena
          </Link>
        )}
      </div>
    </div>
  );
}
