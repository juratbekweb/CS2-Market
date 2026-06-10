"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Users, 
  ShoppingCart, Copy, CheckCircle, Clock, AlertCircle,
  DollarSign, BarChart2, Gift, ArrowRight, Shield
} from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string | Date;
}

interface WalletData {
  user: {
    balance: number;
    name: string | null;
    image: string | null;
    steamId: string | null;
  };
  transactions: Transaction[];
  trend: { date: string; value: number }[];
}

interface WalletClientProps {
  data: WalletData | null;
}

const TX_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  DEPOSIT:       { icon: ArrowDownLeft,  color: "text-[#00ff87]", bg: "bg-[#00ff87]/10" },
  WITHDRAWAL:    { icon: ArrowUpRight,   color: "text-[#ff2a5f]", bg: "bg-[#ff2a5f]/10" },
  PURCHASE:      { icon: ShoppingCart,   color: "text-[#ff2a5f]", bg: "bg-[#ff2a5f]/10" },
  SALE:          { icon: TrendingUp,     color: "text-[#00ff87]", bg: "bg-[#00ff87]/10" },
  COMMISSION:    { icon: DollarSign,     color: "text-slate-500",  bg: "bg-slate-500/10" },
  UPGRADE_WIN:   { icon: ArrowUpRight,   color: "text-[#00ff87]", bg: "bg-[#00ff87]/10" },
  UPGRADE_LOSS:  { icon: AlertCircle,    color: "text-[#ff2a5f]", bg: "bg-[#ff2a5f]/10" },
  CASE_OPEN:     { icon: Gift,           color: "text-[#a100ff]", bg: "bg-[#a100ff]/10" },
  CASE_WIN:      { icon: Gift,           color: "text-[#ffaa00]", bg: "bg-[#ffaa00]/10" },
  REFERRAL_BONUS:{ icon: Users,          color: "text-[#00f0ff]", bg: "bg-[#00f0ff]/10" },
  PROMO_REDEEM:  { icon: Gift,           color: "text-[#ffaa00]", bg: "bg-[#ffaa00]/10" },
  DAILY_BONUS:   { icon: Gift,           color: "text-[#ffaa00]", bg: "bg-[#ffaa00]/10" },
};

function AnimatedBalance({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = 0;
    const end = value;
    const duration = 1500;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>${display.toFixed(2)}</span>;
}

export function WalletClient({ data }: WalletClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "deposits" | "sales" | "purchases">("all");
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw" | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [tradeUrl, setTradeUrl] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const balance = data?.user.balance ?? 0;
  const transactions = data?.transactions ?? [];

  const filteredTx = transactions.filter(tx => {
    if (activeTab === "deposits") return tx.type === "DEPOSIT";
    if (activeTab === "sales") return tx.type === "SALE";
    if (activeTab === "purchases") return tx.type === "PURCHASE";
    return true;
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) return showToast("Enter a valid amount", "error");
    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const result = await res.json();
      if (!res.ok) return showToast(result.error || "Failed", "error");
      showToast(`$${amount.toFixed(2)} added to your balance!`, "success");
      setDepositAmount("");
      setActiveAction(null);
    } catch {
      showToast("Network error", "error");
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) return showToast("Enter a valid amount", "error");
    if (!tradeUrl.includes("steamcommunity.com/tradeoffer")) return showToast("Invalid Steam trade URL", "error");
    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, tradeUrl }),
      });
      const result = await res.json();
      if (!res.ok) return showToast(result.error || "Failed", "error");
      showToast("Withdrawal request submitted! Processing within 24h.", "success");
      setWithdrawAmount("");
      setTradeUrl("");
      setActiveAction(null);
    } catch {
      showToast("Network error", "error");
    }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://nightmarket.gg/ref/${data?.user.name?.toLowerCase().replace(" ", "") ?? "user"}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-16 space-y-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 z-50 px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow-xl ${
              toast.type === "success" ? "bg-[#00ff87]/20 border border-[#00ff87]/40 text-[#00ff87]" : "bg-[#ff2a5f]/20 border border-[#ff2a5f]/40 text-[#ff2a5f]"
            }`}
          >
            {toast.type === "success" ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-[#ffaa00] mb-2 font-heading font-bold tracking-wider text-xs">
          <Wallet className="size-4" /> MY WALLET
        </div>
        <h1 className="font-heading text-4xl font-extrabold uppercase text-white tracking-tight">Balance & Transactions</h1>
      </div>

      {/* Balance Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0512 0%, #05050a 50%, #020204 100%)" }}
      >
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-hero-grid opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(161,0,255,0.15)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[radial-gradient(circle,rgba(0,240,255,0.1)_0%,transparent_70%)] blur-3xl" />
        
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-heading font-bold uppercase tracking-widest text-slate-500 mb-2">Available Balance</div>
              <div className="font-heading text-6xl md:text-7xl font-extrabold text-white mb-3">
                <AnimatedBalance value={balance} />
              </div>
              <div className="flex items-center gap-2 text-[#00ff87] text-sm font-medium">
                <TrendingUp className="size-4" />
                <span>+12.4% from last week</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveAction(activeAction === "deposit" ? null : "deposit")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold uppercase tracking-wider text-sm transition-all ${
                  activeAction === "deposit"
                    ? "bg-[#00ff87] text-[#020204]"
                    : "bg-gradient-to-r from-[#00ff87]/20 to-[#00f0ff]/20 border border-[#00ff87]/30 text-[#00ff87] hover:bg-[#00ff87]/30"
                }`}
              >
                <ArrowDownLeft className="size-4" /> Deposit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveAction(activeAction === "withdraw" ? null : "withdraw")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold uppercase tracking-wider text-sm transition-all ${
                  activeAction === "withdraw"
                    ? "bg-[#ff2a5f] text-white"
                    : "bg-gradient-to-r from-[#ff2a5f]/20 to-[#a100ff]/20 border border-[#ff2a5f]/30 text-[#ff2a5f] hover:bg-[#ff2a5f]/30"
                }`}
              >
                <ArrowUpRight className="size-4" /> Withdraw
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Action Panels */}
      <AnimatePresence>
        {activeAction === "deposit" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#05050a] border border-[#00ff87]/20 rounded-3xl p-6">
              <h3 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ArrowDownLeft className="size-5 text-[#00ff87]" /> Deposit Funds
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500 mb-2 block">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number" placeholder="0.00" value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      className="w-full bg-[#020204] border border-[#00ff87]/20 rounded-xl py-3 pl-8 pr-4 text-white font-bold focus:outline-none focus:border-[#00ff87]/50 transition-colors"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    {[10, 25, 50, 100].map(amt => (
                      <button key={amt} onClick={() => setDepositAmount(String(amt))}
                        className="flex-1 py-1.5 rounded-lg bg-[#00ff87]/10 border border-[#00ff87]/20 text-[#00ff87] text-xs font-bold hover:bg-[#00ff87]/20 transition-colors">
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="px-4 py-3 rounded-xl bg-[#00ff87]/5 border border-[#00ff87]/10 flex items-center gap-3">
                    <Shield className="size-4 text-[#00ff87] shrink-0" />
                    <span className="text-xs text-slate-400">Funds are added instantly to your wallet. No fees on internal deposits.</span>
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-[#ffaa00]/5 border border-[#ffaa00]/10">
                    <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#ffaa00] mb-1">Crypto Payment</div>
                    <div className="text-xs text-slate-500">USDT/TRC20 support coming soon</div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleDeposit}
                    className="py-3 bg-[#00ff87] text-[#020204] rounded-xl font-heading font-bold uppercase tracking-wider text-sm hover:bg-[#00ff87]/90 transition-colors"
                  >
                    Add ${depositAmount || "0.00"} to Balance
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeAction === "withdraw" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#05050a] border border-[#ff2a5f]/20 rounded-3xl p-6">
              <h3 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ArrowUpRight className="size-5 text-[#ff2a5f]" /> Withdraw Funds
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500 mb-2 block">Steam Trade URL</label>
                    <input
                      type="text" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..."
                      value={tradeUrl} onChange={e => setTradeUrl(e.target.value)}
                      className="w-full bg-[#020204] border border-[#ff2a5f]/20 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[#ff2a5f]/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500 mb-2 block">Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number" placeholder="0.00" value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        className="w-full bg-[#020204] border border-[#ff2a5f]/20 rounded-xl py-3 pl-8 pr-4 text-white font-bold focus:outline-none focus:border-[#ff2a5f]/50 transition-colors"
                      />
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Available: <span className="text-white font-bold">${balance.toFixed(2)}</span></div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="px-4 py-3 rounded-xl bg-[#ff2a5f]/5 border border-[#ff2a5f]/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="size-3 text-[#ffaa00]" />
                      <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#ffaa00]">Processing Time</span>
                    </div>
                    <div className="text-xs text-slate-400">Withdrawals are processed within 24 hours. You&apos;ll receive a Steam trade offer.</div>
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-[#05050a] border border-white/5">
                    <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mb-1">Min/Max</div>
                    <div className="text-xs text-white">Min: $5.00 — Max: $10,000.00 per request</div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleWithdraw}
                    className="py-3 bg-gradient-to-r from-[#ff2a5f] to-[#a100ff] text-white rounded-xl font-heading font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity"
                  >
                    Request Withdrawal
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {[
          { label: "Marketplace", icon: ShoppingCart, color: "text-[#00f0ff]", bg: "bg-[#00f0ff]/10", border: "border-[#00f0ff]/20", href: "/marketplace" },
          { label: "My Inventory", icon: BarChart2, color: "text-[#a100ff]", bg: "bg-[#a100ff]/10", border: "border-[#a100ff]/20", href: "/inventory" },
          { label: "Trade History", icon: TrendingUp, color: "text-[#ffaa00]", bg: "bg-[#ffaa00]/10", border: "border-[#ffaa00]/20", href: "/orders" },
          { label: "Dashboard", icon: Users, color: "text-[#00ff87]", bg: "bg-[#00ff87]/10", border: "border-[#00ff87]/20", href: "/dashboard" },
        ].map(action => (
          <Link key={action.label} href={action.href}>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className={`bg-[#05050a] border ${action.border} rounded-2xl p-4 text-center cursor-pointer transition-all group`}
            >
              <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className={`size-5 ${action.color}`} />
              </div>
              <div className="text-xs font-heading font-bold text-white uppercase tracking-wider">{action.label}</div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Referral Card */}
      <div className="bg-[#05050a] border border-[#a100ff]/20 rounded-3xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-heading font-bold uppercase tracking-wider text-[#a100ff] mb-1 flex items-center gap-2">
              <Gift className="size-3" /> REFERRAL PROGRAM
            </div>
            <div className="font-heading text-xl font-bold text-white">Earn 5% commission on referrals</div>
            <div className="text-sm text-slate-400 mt-1">Share your link and earn when your friends trade</div>
          </div>
          <button
            onClick={copyReferral}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a100ff]/20 border border-[#a100ff]/30 text-[#a100ff] text-xs font-heading font-bold uppercase tracking-wider hover:bg-[#a100ff]/30 transition-colors shrink-0"
          >
            {copied ? <CheckCircle className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied!" : "Copy Referral Link"}
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[#05050a] border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-bold text-white uppercase tracking-wider">Transaction History</h2>
            <div className="flex bg-[#020204] p-1 rounded-xl border border-white/5">
              {(["all", "deposits", "sales", "purchases"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-heading font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab ? "bg-gradient-to-r from-[#a100ff] to-[#00f0ff] text-white" : "text-slate-500 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredTx.length === 0 ? (
            <div className="p-12 text-center">
              <BarChart2 className="size-12 text-slate-700 mx-auto mb-3" />
              <div className="text-sm font-bold text-slate-500">No transactions found</div>
            </div>
          ) : (
            filteredTx.map(tx => {
              const meta = TX_ICONS[tx.type] || { icon: DollarSign, color: "text-slate-400", bg: "bg-slate-500/10" };
              const isPositive = tx.amount >= 0;
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}>
                    <meta.icon className={`size-5 ${meta.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{tx.description}</div>
                    <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mt-0.5">{tx.type.replace(/_/g, " ")}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-heading font-bold ${isPositive ? "text-[#00ff87]" : "text-[#ff2a5f]"}`}>
                      {isPositive ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-600">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {filteredTx.length > 0 && (
          <div className="p-4 border-t border-white/5 text-center">
            <Link href="/orders" className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2">
              View All Transactions <ArrowRight className="size-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
