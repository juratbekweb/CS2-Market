import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/layout/section-heading";
import { currency } from "@/lib/utils";

async function getAnalytics() {
  const useMock = !process.env.DATABASE_URL;
  if (useMock) {
    return {
      totalUsers: 156, activeToday: 43,
      totalRevenue: 12450.89, dailyRevenue: 890.50,
      totalTrades: 1847, totalUpgrades: 523,
      totalCaseOpens: 2890,
      upgradeProfit: 3200.00, caseProfit: 4500.00, commissionProfit: 4750.89,
      topSkins: [
        { name: "AWP | Dragon Lore", trades: 12, volume: 15599.88 },
        { name: "Karambit | Doppler", trades: 28, volume: 9800.00 },
        { name: "AK-47 | Fire Serpent", trades: 45, volume: 5400.00 },
      ],
      recentDays: [
        { date: "Apr 25", revenue: 650, users: 38 },
        { date: "Apr 26", revenue: 780, users: 42 },
        { date: "Apr 27", revenue: 920, users: 45 },
        { date: "Apr 28", revenue: 850, users: 41 },
        { date: "Apr 29", revenue: 890, users: 43 },
      ],
    };
  }

  const now = new Date();
  void new Date(now.getFullYear(), now.getMonth(), now.getDate()); // todayStart unused in current impl

  const [totalUsers, transactions, upgrades, caseOpenings] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.findMany({ orderBy: { createdAt: "desc" }, take: 10000 }),
    prisma.upgrade.findMany(),
    prisma.caseOpening.findMany(),
  ]);

  const commissionTxns = transactions.filter(t => t.type === "COMMISSION");
  const commissionProfit = commissionTxns.reduce((s, t) => s + Math.abs(Number(t.amount)), 0);

  const upgradeLosses = upgrades.filter(u => u.result === "LOSE");
  const upgradeProfit = upgradeLosses.reduce((s, u) => s + Number(u.inputValue), 0);

  void caseOpenings.reduce((s) => s + 0, 0); // caseCost: would need case price lookup
  void caseOpenings.reduce((s, c) => s + Number(c.wonValue), 0); // caseWinValue unused

  return {
    totalUsers,
    activeToday: 0,
    totalRevenue: commissionProfit + upgradeProfit,
    dailyRevenue: 0,
    totalTrades: transactions.filter(t => ["PURCHASE","SALE"].includes(t.type)).length,
    totalUpgrades: upgrades.length,
    totalCaseOpens: caseOpenings.length,
    upgradeProfit: Math.round(upgradeProfit * 100) / 100,
    caseProfit: 0,
    commissionProfit: Math.round(commissionProfit * 100) / 100,
    topSkins: [],
    recentDays: [],
  };
}

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const stats = await getAnalytics();
  const totalProfit = stats.commissionProfit + stats.upgradeProfit + stats.caseProfit;

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Admin" title="Analytics Dashboard" description="Platform performance and profit tracking" />

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Profit", value: currency(totalProfit), accent: "text-glow", bg: "border-glow/30" },
          { label: "Total Users", value: String(stats.totalUsers), accent: "text-sky-400", bg: "border-sky-400/30" },
          { label: "Total Trades", value: String(stats.totalTrades), accent: "text-flame", bg: "border-flame/30" },
          { label: "Case Opens", value: String(stats.totalCaseOpens), accent: "text-purple-400", bg: "border-purple-400/30" },
        ].map(kpi => (
          <div key={kpi.label} className={`glass-card rounded-[2.5rem] border ${kpi.bg} p-8 hover:-translate-y-1 transition-transform`}>
            <div className="text-xs uppercase tracking-[0.3em] text-muted">{kpi.label}</div>
            <div className={`mt-2 text-3xl font-bold ${kpi.accent}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue Breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-[2.5rem] p-8 hover:border-glow/30">
          <div className="text-xs uppercase tracking-[0.3em] text-glow">Commission Revenue</div>
          <div className="mt-3 text-3xl font-bold text-white">{currency(stats.commissionProfit)}</div>
          <div className="mt-2 text-sm text-muted">From marketplace trades (5-10%)</div>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-glow" style={{ width: `${(stats.commissionProfit / totalProfit * 100) || 33}%` }} />
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 hover:border-flame/30">
          <div className="text-xs uppercase tracking-[0.3em] text-flame">Upgrade Profit</div>
          <div className="mt-3 text-3xl font-bold text-white">{currency(stats.upgradeProfit)}</div>
          <div className="mt-2 text-sm text-muted">From lost upgrades (house edge)</div>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-flame" style={{ width: `${(stats.upgradeProfit / totalProfit * 100) || 33}%` }} />
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-8 hover:border-purple-400/30">
          <div className="text-xs uppercase tracking-[0.3em] text-purple-400">Case Profit</div>
          <div className="mt-3 text-3xl font-bold text-white">{currency(stats.caseProfit)}</div>
          <div className="mt-2 text-sm text-muted">EV difference on case opens</div>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-purple-400" style={{ width: `${(stats.caseProfit / totalProfit * 100) || 33}%` }} />
          </div>
        </div>
      </div>

      {/* Activity Chart (mock) */}
      <div className="glass-card rounded-[2.5rem] p-10">
        <div className="text-xs uppercase tracking-[0.3em] text-glow">Daily Revenue (Last 5 Days)</div>
        <div className="mt-8 flex items-end gap-4" style={{ height: 200 }}>
          {stats.recentDays.map((day) => {
            const maxRev = Math.max(...stats.recentDays.map(d => d.revenue), 1);
            const height = (day.revenue / maxRev) * 100;
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                <div className="text-xs font-bold text-glow">{currency(day.revenue)}</div>
                <div className="w-full rounded-t-xl bg-gradient-to-t from-glow/20 to-glow/60 transition-all" style={{ height: `${height}%` }} />
                <div className="text-xs text-muted">{day.date}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Skins */}
      {stats.topSkins.length > 0 && (
        <div className="glass-card rounded-[2.5rem] p-10">
          <div className="text-xs uppercase tracking-[0.3em] text-flame">Top Traded Skins</div>
          <div className="mt-5 space-y-3">
            {stats.topSkins.map((skin, i) => (
              <div key={skin.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-surface/60 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{skin.name}</div>
                    <div className="text-xs text-muted">{skin.trades} trades</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-glow">{currency(skin.volume)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
