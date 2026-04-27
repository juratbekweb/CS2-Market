import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BalanceChart } from "@/components/charts/balance-chart";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { SteamConnectCard } from "@/components/login/steam-connect-card";
import {
  getLocaleTag,
  translate,
  translateKpiHelper,
  translateKpiLabel,
  translateNotificationBody,
  translateNotificationTitle,
  translateTransactionDescription,
  translateTransactionType,
} from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { getDashboardSnapshot } from "@/lib/store";
import { currency } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const snapshot = await getDashboardSnapshot(session.user);
  if (!snapshot) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={translate(locale, "dashboard.eyebrow")}
        title={translate(locale, "dashboard.title")}
        description={translate(locale, "dashboard.description")}
      />

      <div className="grid gap-5 lg:grid-cols-4">
        {snapshot.kpis.map((item, index) => (
          <KpiCard
            key={item.label}
            label={translateKpiLabel(locale, item.label)}
            value={item.value}
            helper={translateKpiHelper(locale, item.helper)}
            accent={index % 2 === 0 ? "glow" : "flame"}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-glow">{translate(locale, "dashboard.balanceTrend")}</div>
          <div className="mt-3 text-3xl font-semibold text-white">{currency(Number(snapshot.user.balance))}</div>
          <div className="mt-8">
            <BalanceChart data={snapshot.balanceTrend} />
          </div>
        </div>

        <div className="space-y-6">
          <SteamConnectCard connected={Boolean(snapshot.user.steamId)} />
          <div className="rounded-[2rem] border border-white/10 bg-card/75 p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-flame">{translate(locale, "dashboard.notifications")}</div>
            <div className="mt-5 space-y-4">
              {snapshot.notifications.map((item) => (
                <div key={item.id} className="rounded-3xl border border-white/10 bg-surface/70 p-4">
                  <div className="text-sm font-semibold text-white">{translateNotificationTitle(locale, item.title)}</div>
                  <div className="mt-2 text-sm leading-7 text-muted">{translateNotificationBody(locale, item.body)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
        <div className="text-xs uppercase tracking-[0.3em] text-glow">{translate(locale, "dashboard.transactions")}</div>
        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-muted">
              <tr>
                <th className="px-4 py-4">{translate(locale, "dashboard.table.type")}</th>
                <th className="px-4 py-4">{translate(locale, "dashboard.table.description")}</th>
                <th className="px-4 py-4">{translate(locale, "dashboard.table.amount")}</th>
                <th className="px-4 py-4">{translate(locale, "dashboard.table.date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {snapshot.transactions.map((item) => (
                <tr key={item.id} className="bg-surface/60">
                  <td className="px-4 py-4 text-slate-200">{translateTransactionType(locale, item.type)}</td>
                  <td className="px-4 py-4 text-slate-300">{translateTransactionDescription(locale, item.description)}</td>
                  <td className={`px-4 py-4 font-medium ${Number(item.amount) >= 0 ? "text-glow" : "text-flame"}`}>{currency(Number(item.amount))}</td>
                  <td className="px-4 py-4 text-muted">
                    {new Date(item.createdAt).toLocaleDateString(getLocaleTag(locale), { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
