"use client";

import { useState } from "react";
import { Users, Store, Activity, BarChart3, Settings, ShieldAlert, Package, CreditCard, Menu, X, ArrowUpRight, ArrowDownRight, Zap, Star } from "lucide-react";
import { AdminControls } from "@/components/admin-controls";
import { currency } from "@/lib/utils";
import { translateListingStatus, translateTransactionDescription, translateTransactionType } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

interface AdminUser {
  id: string;
  name?: string | null;
  email?: string | null;
  steamId?: string | null;
  isBlocked: boolean;
  role: "USER" | "ADMIN";
}

interface Transaction {
  id: string;
  amount: string | number;
  description: string;
  type: string;
}

interface Listing {
  id: string;
  askPrice: string | number;
  status: string;
  skinSlug?: string;
  skin?: {
    name: string;
  };
}

interface AdminData {
  users: AdminUser[];
  listings: Listing[];
  transactions: Transaction[];
  commissionRate: number;
}

type AdminTab = "dashboard" | "users" | "marketplace" | "cases" | "analytics" | "settings";

export function AdminDashboard({ admin, locale }: { admin: AdminData; locale: string }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Activity className="size-4" /> },
    { id: "users", label: "Users & Bans", icon: <Users className="size-4" /> },
    { id: "marketplace", label: "Marketplace", icon: <Store className="size-4" /> },
    { id: "cases", label: "Cases", icon: <Package className="size-4" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="size-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="size-4" /> },
  ];

  const totalRevenue = admin.transactions.filter((t: Transaction) => Number(t.amount) > 0).reduce((acc: number, t: Transaction) => acc + Number(t.amount), 0);
  const totalVolume = admin.transactions.reduce((acc: number, t: Transaction) => acc + Math.abs(Number(t.amount)), 0);

  return (
    <div className="flex flex-col lg:flex-row bg-[#05050a] border border-[#ffffff]/5 rounded-3xl overflow-hidden min-h-[600px]">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-[#ffffff]/5 bg-[#020204] p-4 lg:hidden">
        <div className="flex items-center gap-2 font-heading text-sm font-bold text-white uppercase tracking-wider">
          <ShieldAlert className="size-4 text-[#ff2a5f]" /> Admin Panel
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white">
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? "flex" : "hidden"} w-full flex-col border-b border-[#ffffff]/5 bg-[#020204] lg:flex lg:w-64 lg:border-b-0 lg:border-r`}>
        <div className="hidden items-center gap-3 border-b border-[#ffffff]/5 p-6 lg:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff2a5f]/10 border border-[#ff2a5f]/20 text-[#ff2a5f] glow-purple">
            <ShieldAlert className="size-4" />
          </div>
          <div>
            <div className="font-heading text-sm font-bold text-white uppercase tracking-wider">Admin</div>
            <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600">Command Center</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as AdminTab); setMobileMenuOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? "bg-[#05050a] text-white border border-[#ffffff]/5"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white uppercase tracking-wider">Overview</h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Platform statistics and recent activity.</p>
            </div>
            
            {/* Analytics Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="bg-[#020204] border border-[#ffffff]/5 rounded-2xl p-5">
                <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">Total Users</div>
                <div className="text-xl font-heading font-bold text-white">{admin.users.length}</div>
              </div>
              <div className="bg-[#020204] border border-[#ffffff]/5 rounded-2xl p-5">
                <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">Active Listings</div>
                <div className="text-xl font-heading font-bold text-white">{admin.listings.length}</div>
              </div>
              <div className="bg-[#020204] border border-[#ffffff]/5 rounded-2xl p-5">
                <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">Total Volume</div>
                <div className="text-xl font-heading font-bold text-[#ffaa00]">{currency(totalVolume)}</div>
              </div>
              <div className="bg-[#020204] border border-[#ffffff]/5 rounded-2xl p-5">
                <div className="text-[10px] font-heading font-bold uppercase tracking-wider text-slate-600 mb-1">Revenue</div>
                <div className="text-xl font-heading font-bold text-[#00ff87]">{currency(totalRevenue * admin.commissionRate)}</div>
              </div>
            </div>

            {/* Tables Area */}
            <div className="grid gap-6 xl:grid-cols-2">
              {/* Recent Activity */}
              <div className="bg-[#020204] border border-[#ffffff]/5 rounded-2xl p-5">
                <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {admin.transactions.slice(0, 5).map((transaction: Transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between bg-[#05050a] border border-[#ffffff]/5 rounded-xl p-3">
                      <div>
                        <div className="text-xs font-bold text-white">{translateTransactionDescription(locale as any, transaction.description)}</div>
                        <div className="text-[9px] font-heading font-bold uppercase tracking-wider text-slate-600 mt-0.5">{translateTransactionType(locale as any, transaction.type)}</div>
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-heading font-bold ${Number(transaction.amount) >= 0 ? "text-[#00ff87]" : "text-[#ff2a5f]"}`}>
                        {Number(transaction.amount) >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                        {currency(Math.abs(Number(transaction.amount)))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Market Feed */}
              <div className="bg-[#020204] border border-[#ffffff]/5 rounded-2xl p-5">
                <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-4">Market Feed</h3>
                <div className="space-y-3">
                  {admin.listings.slice(0, 5).map((listing: Listing) => (
                    <div key={listing.id} className="flex items-center justify-between bg-[#05050a] border border-[#ffffff]/5 rounded-xl p-3">
                      <div>
                        <div className="text-xs font-bold text-white">{"skinSlug" in listing ? listing.skinSlug : listing.skin?.name}</div>
                        <div className="text-[9px] font-heading font-bold uppercase tracking-wider text-slate-600 mt-0.5">{translateListingStatus(locale as any, listing.status)}</div>
                      </div>
                      <div className="text-xs font-heading font-bold text-white">{currency(Number(listing.askPrice))}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white uppercase tracking-wider">User Management</h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Manage accounts, roles, and ban status.</p>
            </div>
            <div className="bg-[#020204] border border-[#ffffff]/5 rounded-2xl p-5">
              <AdminControls commissionRate={admin.commissionRate} users={admin.users} />
            </div>
          </div>
        )}

        {activeTab === "marketplace" && (
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white uppercase tracking-wider">Marketplace</h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Monitor all active and past listings.</p>
            </div>
            <div className="bg-[#020204] border border-[#ffffff]/5 rounded-2xl p-5">
              <div className="space-y-3">
                {admin.listings.map((listing: Listing) => (
                  <div key={listing.id} className="flex items-center justify-between bg-[#05050a] border border-[#ffffff]/5 rounded-xl p-4 hover:border-[#ffffff]/10 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-white">{"skinSlug" in listing ? listing.skinSlug : listing.skin?.name}</div>
                      <div className="text-[9px] font-heading font-bold uppercase tracking-wider text-slate-600 mt-0.5">Status: {translateListingStatus(locale as any, listing.status)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-heading font-bold text-white">{currency(Number(listing.askPrice))}</div>
                      <div className="text-[9px] font-heading font-bold uppercase tracking-wider text-[#ff2a5f] mt-0.5">Fee: {currency(Number(listing.askPrice) * admin.commissionRate)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "cases" && (
          <div className="flex h-64 flex-col items-center justify-center text-center">
             <Package className="mb-4 size-10 text-slate-700 opacity-50" />
             <h3 className="font-heading text-xl font-bold text-white">Case Management</h3>
             <p className="text-slate-500 mt-1 text-sm">Module coming soon to adjust odds and content.</p>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="flex h-64 flex-col items-center justify-center text-center">
             <BarChart3 className="mb-4 size-10 text-slate-700 opacity-50" />
             <h3 className="font-heading text-xl font-bold text-white">Advanced Analytics</h3>
             <p className="text-slate-500 mt-1 text-sm">Detailed charts and economy data coming soon.</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white uppercase tracking-wider">System Settings</h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Configure global platform variables.</p>
            </div>
            
            <div className="bg-[#020204] border border-[#ffffff]/5 rounded-2xl p-6 max-w-xl">
               <h3 className="text-sm font-heading font-bold text-white uppercase tracking-wider mb-2">Maintenance Mode</h3>
               <p className="text-xs text-slate-600 mb-4 font-medium">Enable this to lock out all non-admin users from the platform while performing upgrades.</p>
               <button className="px-4 py-2 bg-[#020204] border border-[#ff2a5f]/20 rounded-lg text-[10px] font-heading font-bold uppercase tracking-wider text-[#ff2a5f] hover:bg-[#ff2a5f] hover:text-[#020204] hover:glow-purple transition-all">
                 Enable Maintenance Mode
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
