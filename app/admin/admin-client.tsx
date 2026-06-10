"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, ShoppingBag, ListOrdered, 
  Package, ArrowUpRight, Settings, Search, TrendingUp,
  AlertCircle, ShieldCheck, CheckCircle2, XCircle, MoreVertical
} from "lucide-react";

type Tab = "dashboard" | "users" | "listings" | "transactions" | "cases" | "withdrawals" | "settings";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  balance: number;
  status: string;
  joined: string;
}

interface AdminWithdrawal {
  id: string;
  user: string;
  amount: number;
  status: string;
  date: string;
}

interface AdminSnapshot {
  stats?: {
    totalRevenue: number;
    activeListings: number;
    totalUsers: number;
    pendingWithdrawals: number;
  };
  users?: AdminUser[];
  withdrawals?: AdminWithdrawal[];
}

export function AdminDashboardClient({ data }: { data: AdminSnapshot | null }) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  // Mock data fallback if DB isn't connected
  const stats = data?.stats || { totalRevenue: 12450.50, activeListings: 842, totalUsers: 3450, pendingWithdrawals: 12 };
  const mockUsers = [
    { id: "u1", name: "DragonSlayer99", email: "dragon@example.com", balance: 1250.00, status: "ACTIVE", joined: "2023-11-01" },
    { id: "u2", name: "ScammerBoii", email: "scam@example.com", balance: 0.00, status: "BLOCKED", joined: "2024-01-15" },
    { id: "u3", name: "SkinTraderX", email: "trader@example.com", balance: 8450.25, status: "ACTIVE", joined: "2023-08-22" },
  ];
  const users = data?.users || mockUsers;

  const mockWithdrawals = [
    { id: "w1", user: "DragonSlayer99", amount: 500.00, status: "PENDING", date: "2024-05-23T12:00:00Z" },
    { id: "w2", user: "SkinTraderX", amount: 1250.00, status: "PENDING", date: "2024-05-23T09:30:00Z" },
    { id: "w3", user: "NoobMaster", amount: 50.00, status: "COMPLETED", date: "2024-05-22T15:45:00Z" },
  ];
  const withdrawals = data?.withdrawals || mockWithdrawals;

  return (
    <div className="flex min-h-screen bg-[#020204]">
      {/* Sidebar */}
      <div className="w-64 bg-[#05050a] border-r border-white/5 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-white/5">
          <div className="font-heading text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="size-6 text-[#ff2a5f]" /> ADMIN
          </div>
          <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-500 mt-1">
            System Management
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "users", label: "Users", icon: Users },
            { id: "listings", label: "Listings", icon: ShoppingBag },
            { id: "transactions", label: "Transactions", icon: ListOrdered },
            { id: "cases", label: "Cases", icon: Package },
            { id: "withdrawals", label: "Withdrawals", icon: ArrowUpRight },
            { id: "settings", label: "Settings", icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#ff2a5f]/20 to-transparent border-l-2 border-[#ff2a5f] text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <tab.icon className={`size-4 ${activeTab === tab.id ? "text-[#ff2a5f]" : ""}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-[#05050a] flex items-center justify-between px-8 sticky top-0 z-20">
          <h1 className="font-heading text-xl font-bold text-white uppercase tracking-wider">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff2a5f] to-[#ffaa00] flex items-center justify-center font-heading font-bold text-white shadow-[0_0_15px_rgba(255,42,95,0.4)]">
              A
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Stats Cards */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 sm:gap-6 mb-8">
                  {[
                    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-[#ffaa00]", bg: "bg-[#ffaa00]/10", border: "border-[#ffaa00]/20" },
                    { label: "Active Listings", value: stats.activeListings, icon: ShoppingBag, color: "text-[#00f0ff]", bg: "bg-[#00f0ff]/10", border: "border-[#00f0ff]/20" },
                    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-[#a100ff]", bg: "bg-[#a100ff]/10", border: "border-[#a100ff]/20" },
                    { label: "Pending Withdrawals", value: stats.pendingWithdrawals, icon: AlertCircle, color: "text-[#ff2a5f]", bg: "bg-[#ff2a5f]/10", border: "border-[#ff2a5f]/20" },
                  ].map((stat, i) => (
                    <div key={i} className={`bg-[#05050a] rounded-2xl p-6 border ${stat.border}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                          <stat.icon className={`size-5 ${stat.color}`} />
                        </div>
                        <div className="text-xs font-heading font-bold uppercase tracking-wider text-slate-500">{stat.label}</div>
                      </div>
                      <div className="font-heading text-3xl font-extrabold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Revenue Chart Placeholder */}
                  <div className="bg-[#05050a] border border-white/5 rounded-3xl p-6">
                     <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-white mb-6">Revenue (Last 7 Days)</h3>
                     <div className="h-64 flex items-end justify-between gap-2">
                       {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                         <div key={i} className="w-full bg-[#020204] rounded-t-lg relative group">
                           <div className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-[#ff2a5f]/20 to-[#ffaa00] transition-all duration-500 group-hover:opacity-80" style={{ height: `${h}%` }} />
                           <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                             ${(h * 12.5).toFixed(0)}
                           </div>
                         </div>
                       ))}
                     </div>
                     <div className="flex justify-between mt-4 text-[10px] font-heading font-bold uppercase text-slate-500">
                       <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                     </div>
                  </div>

                  <div className="bg-[#05050a] border border-white/5 rounded-3xl p-6 flex items-center justify-center">
                     <div className="text-center text-slate-500">
                        <ListOrdered className="size-12 mx-auto mb-3 opacity-20" />
                        <div className="text-sm font-bold uppercase tracking-wider">More widgets coming soon</div>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-[#05050a] border border-white/5 rounded-3xl overflow-hidden">
                  <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                      <input type="text" placeholder="Search users..." className="w-full bg-[#020204] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:border-[#a100ff]/50 focus:outline-none" />
                    </div>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-[#020204] border-b border-white/5">
                        <th className="px-6 py-4 font-heading font-bold uppercase tracking-wider text-[10px] text-slate-500">User</th>
                        <th className="px-6 py-4 font-heading font-bold uppercase tracking-wider text-[10px] text-slate-500">Balance</th>
                        <th className="px-6 py-4 font-heading font-bold uppercase tracking-wider text-[10px] text-slate-500">Joined</th>
                        <th className="px-6 py-4 font-heading font-bold uppercase tracking-wider text-[10px] text-slate-500">Status</th>
                        <th className="px-6 py-4 font-heading font-bold uppercase tracking-wider text-[10px] text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u: AdminUser) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-white">{u.name}</span>
                              <span className="text-xs text-slate-500">{u.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-[#00ff87]">${u.balance.toFixed(2)}</td>
                          <td className="px-6 py-4 text-slate-400">{new Date(u.joined).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            {u.status === "ACTIVE" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00ff87]/10 text-[#00ff87] text-[10px] font-heading font-bold uppercase tracking-wider">
                                <CheckCircle2 className="size-3" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ff2a5f]/10 text-[#ff2a5f] text-[10px] font-heading font-bold uppercase tracking-wider">
                                <XCircle className="size-3" /> Blocked
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 text-slate-500 hover:text-white transition-colors"><MoreVertical className="size-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "withdrawals" && (
              <motion.div key="withdrawals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-[#05050a] border border-white/5 rounded-3xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-[#020204] border-b border-white/5">
                        <th className="px-6 py-4 font-heading font-bold uppercase tracking-wider text-[10px] text-slate-500">ID</th>
                        <th className="px-6 py-4 font-heading font-bold uppercase tracking-wider text-[10px] text-slate-500">User</th>
                        <th className="px-6 py-4 font-heading font-bold uppercase tracking-wider text-[10px] text-slate-500">Amount</th>
                        <th className="px-6 py-4 font-heading font-bold uppercase tracking-wider text-[10px] text-slate-500">Status</th>
                        <th className="px-6 py-4 font-heading font-bold uppercase tracking-wider text-[10px] text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {withdrawals.map((w: AdminWithdrawal) => (
                        <tr key={w.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-slate-500 font-mono text-xs">{w.id}</td>
                          <td className="px-6 py-4 font-bold text-white">{w.user}</td>
                          <td className="px-6 py-4 font-bold text-white">${w.amount.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            {w.status === "PENDING" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffaa00]/10 text-[#ffaa00] text-[10px] font-heading font-bold uppercase tracking-wider">
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00ff87]/10 text-[#00ff87] text-[10px] font-heading font-bold uppercase tracking-wider">
                                Completed
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {w.status === "PENDING" && (
                              <div className="flex items-center justify-end gap-2">
                                <button className="px-3 py-1.5 bg-[#00ff87]/10 text-[#00ff87] rounded hover:bg-[#00ff87]/20 text-[10px] font-bold uppercase">Approve</button>
                                <button className="px-3 py-1.5 bg-[#ff2a5f]/10 text-[#ff2a5f] rounded hover:bg-[#ff2a5f]/20 text-[10px] font-bold uppercase">Deny</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Other tabs placeholders */}
            {["listings", "transactions", "cases", "settings"].includes(activeTab) && (
              <motion.div key="placeholder" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                 <div className="py-20 text-center bg-[#05050a] border border-white/5 rounded-3xl">
                    <Settings className="size-12 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-wider">{activeTab}</h3>
                    <p className="text-slate-500 text-sm">This module is under construction.</p>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#05050a] border-t border-white/5 flex items-center justify-between px-2 pb-safe z-50 overflow-x-auto custom-scrollbar">
        {[
          { id: "dashboard", icon: LayoutDashboard },
          { id: "users", icon: Users },
          { id: "listings", icon: ShoppingBag },
          { id: "transactions", icon: ListOrdered },
          { id: "cases", icon: Package },
          { id: "withdrawals", icon: ArrowUpRight },
          { id: "settings", icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex flex-col items-center gap-1 p-3 min-w-[64px] transition-colors ${
              activeTab === tab.id ? "text-[#ff2a5f]" : "text-slate-500 hover:text-white"
            }`}
          >
            <tab.icon className="size-5" />
            <span className="text-[9px] font-heading font-bold uppercase tracking-wider">{tab.id.slice(0, 3)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
