"use client";

import { useState } from "react";
import { Plus, Tag } from "lucide-react";

interface PromoCode {
  id: string; code: string; amount: number; maxUses: number;
  usedCount: number; isActive: boolean; expiresAt?: string;
}

export default function PromosPage() {
  const [promos, setPromos] = useState<PromoCode[]>([
    { id: "p1", code: "WELCOME10", amount: 1.00, maxUses: 1000, usedCount: 342, isActive: true },
    { id: "p2", code: "NIGHTMARKET", amount: 0.50, maxUses: 5000, usedCount: 1205, isActive: true },
    { id: "p3", code: "VIP50", amount: 5.00, maxUses: 100, usedCount: 98, isActive: false },
  ]);
  const [newCode, setNewCode] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newMaxUses, setNewMaxUses] = useState("");
  const [message, setMessage] = useState("");

  const createPromo = async () => {
    if (!newCode || !newAmount || !newMaxUses) return;
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createPromo",
          code: newCode.toUpperCase(),
          amount: parseFloat(newAmount),
          maxUses: parseInt(newMaxUses),
        }),
      });
      if (res.ok) {
        setPromos(prev => [...prev, {
          id: `p-${Date.now()}`, code: newCode.toUpperCase(),
          amount: parseFloat(newAmount), maxUses: parseInt(newMaxUses),
          usedCount: 0, isActive: true,
        }]);
        setNewCode(""); setNewAmount(""); setNewMaxUses("");
        setMessage("Promo code created!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch { setMessage("Failed to create promo"); }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-flame/30 bg-flame/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-flame">
          <Tag className="size-3" /> Promo Codes
        </div>
        <h1 className="mt-4 font-heading text-3xl uppercase tracking-[0.12em] text-white">Manage Promo Codes</h1>
      </div>

      {message && (
        <div className="rounded-2xl border border-glow/30 bg-glow/10 px-6 py-3 text-sm text-glow">{message}</div>
      )}

      {/* Create New Promo */}
      <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
        <div className="text-xs uppercase tracking-[0.3em] text-glow">Create New Code</div>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <input value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())}
            placeholder="CODE" className="rounded-xl border border-white/10 bg-surface/60 px-4 py-3 text-sm text-white placeholder:text-muted focus:border-glow/40 focus:outline-none" />
          <input value={newAmount} onChange={e => setNewAmount(e.target.value)} type="number" step="0.01"
            placeholder="Amount ($)" className="rounded-xl border border-white/10 bg-surface/60 px-4 py-3 text-sm text-white placeholder:text-muted focus:border-glow/40 focus:outline-none" />
          <input value={newMaxUses} onChange={e => setNewMaxUses(e.target.value)} type="number"
            placeholder="Max Uses" className="rounded-xl border border-white/10 bg-surface/60 px-4 py-3 text-sm text-white placeholder:text-muted focus:border-glow/40 focus:outline-none" />
          <button onClick={createPromo}
            className="flex items-center justify-center gap-2 rounded-xl bg-glow px-4 py-3 text-sm font-bold text-surface transition hover:bg-accent">
            <Plus className="size-4" /> Create
          </button>
        </div>
      </div>

      {/* Existing Promos */}
      <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
        <div className="text-xs uppercase tracking-[0.3em] text-flame">Active Codes</div>
        <div className="mt-5 space-y-3">
          {promos.map(promo => (
            <div key={promo.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-surface/60 p-4">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg px-3 py-1.5 font-mono text-sm font-bold ${promo.isActive ? "bg-glow/10 text-glow" : "bg-red-500/10 text-red-400"}`}>
                  {promo.code}
                </div>
                <div>
                  <div className="text-sm text-white">${promo.amount.toFixed(2)} per redemption</div>
                  <div className="text-xs text-muted">{promo.usedCount} / {promo.maxUses} used</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${promo.isActive ? "bg-glow/10 text-glow" : "bg-red-500/10 text-red-400"}`}>
                  {promo.isActive ? "Active" : "Disabled"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
