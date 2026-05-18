"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, History, Clock, Search, Filter, Download, CreditCard, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_ORDERS = [
  { id: "ORD-1", type: "deposit", amount: 50.0, date: "2026-05-10T14:30:00Z", status: "completed", method: "Credit Card" },
  { id: "ORD-2", type: "purchase", item: "AK-47 | Redline", amount: 45.5, date: "2026-05-09T10:15:00Z", status: "completed" },
  { id: "ORD-3", type: "withdraw", amount: 120.0, date: "2026-05-08T18:45:00Z", status: "pending", method: "Crypto" },
  { id: "ORD-4", type: "sale", item: "AWP | Neo-Noir", amount: 85.0, date: "2026-05-07T09:20:00Z", status: "completed" },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredOrders = MOCK_ORDERS.filter((o) => {
    const matchesFilter = filter === "all" || o.type === filter;
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                          (o.item && o.item.toLowerCase().includes(search.toLowerCase())) ||
                          (o.method && o.method.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      {/* Header */}
      <div className="mb-12 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-6 py-2 text-xs font-heading font-bold uppercase tracking-wider text-[#00f0ff] backdrop-blur-md"
        >
          <History className="size-4" /> Transactions
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="font-heading text-6xl uppercase tracking-tighter text-white font-extrabold mb-4"
        >
          ORDER <span className="bg-gradient-to-r from-[#00f0ff] to-[#00ff87] bg-clip-text text-transparent">HISTORY</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-slate-400 font-medium"
        >
          View your past transactions, purchases, and sales with real-time status tracking.
        </motion.p>
      </div>

      {/* Statistics Section */}
      <div className="grid gap-6 mb-12 sm:grid-cols-3">
        <div className="bg-[#05050a] border border-[#ffffff]/5 rounded-2xl p-6">
          <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">Total Spent</div>
          <div className="text-2xl font-heading font-bold text-white">$165.50</div>
        </div>
        <div className="bg-[#05050a] border border-[#ffffff]/5 rounded-2xl p-6">
          <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">Total Earned</div>
          <div className="text-2xl font-heading font-bold text-[#00ff87]">$135.00</div>
        </div>
        <div className="bg-[#05050a] border border-[#ffffff]/5 rounded-2xl p-6">
          <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">Pending Orders</div>
          <div className="text-2xl font-heading font-bold text-[#ffaa00]">1</div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
          <input
            type="text"
            placeholder="Search by ID or item..."
            className="w-full bg-[#05050a] border border-[#ffffff]/5 rounded-2xl py-2.5 pl-11 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/30 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 p-1 bg-[#05050a] border border-[#ffffff]/5 rounded-xl w-max">
            {["all", "purchase", "sale", "deposit", "withdraw"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[10px] font-heading font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-[#020204] text-white border border-[#ffffff]/5' : 'text-slate-500 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <button className="px-4 py-2 bg-[#020204] border border-[#ffffff]/5 rounded-lg text-[10px] font-heading font-bold uppercase tracking-wider text-white hover:border-[#ffffff]/20 transition-colors flex items-center gap-1.5">
          <Download className="size-3" /> Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#05050a] border border-[#ffffff]/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-400">
            <thead className="bg-[#020204] text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 border-b border-[#ffffff]/5">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Type / Item</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff]/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-[#ffffff]/2">
                  <td className="px-6 py-4 font-heading font-bold text-white text-[10px]">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[#020204] border border-[#ffffff]/5 ${
                        order.type === 'deposit' || order.type === 'sale' ? 'text-[#00ff87]' :
                        order.type === 'withdraw' || order.type === 'purchase' ? 'text-[#ff2a5f]' : 'text-white'
                      }`}>
                        {order.type === "deposit" || order.type === "sale" ? <ArrowDownLeft className="size-3" /> : <ArrowUpRight className="size-3" />}
                      </div>
                      <div>
                        <div className="font-bold text-white capitalize">{order.type}</div>
                        {(order.item || order.method) && (
                          <div className="text-[10px] text-slate-600 font-heading font-bold uppercase tracking-wider">{order.item || order.method}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-heading font-bold uppercase tracking-wider text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3" />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-heading font-bold uppercase tracking-wider ${
                      order.status === "completed" ? "bg-[#00ff87]/10 text-[#00ff87] border border-[#00ff87]/20" : "bg-[#ffaa00]/10 text-[#ffaa00] border border-[#ffaa00]/20"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-heading font-bold text-sm ${
                    order.type === "deposit" || order.type === "sale" ? "text-[#00ff87]" : "text-white"
                  }`}>
                    {order.type === "deposit" || order.type === "sale" ? "+" : "-"}${order.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center text-center">
               <History className="mb-4 size-12 text-slate-700 opacity-50" />
               <h3 className="font-heading text-xl font-bold text-white">No transactions found</h3>
               <p className="text-slate-500 mt-1 text-sm">You haven't made any {filter !== 'all' ? filter : ''} transactions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
