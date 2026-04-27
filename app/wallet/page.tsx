import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BalanceChart } from "@/components/charts/balance-chart";
import { SectionHeading } from "@/components/layout/section-heading";
import { WalletForms } from "@/components/wallet-forms";
import { translate, translateTransactionDescription, translateTransactionType } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { getWalletSnapshot } from "@/lib/store";
import { currency } from "@/lib/utils";

export default async function WalletPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const wallet = await getWalletSnapshot(session.user);
  if (!wallet) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={translate(locale, "wallet.eyebrow")}
        title={translate(locale, "wallet.title")}
        description={translate(locale, "wallet.description")}
      />

      <div className="grid gap-6 lg:grid-cols-[0.85fr,1.15fr]">
        <WalletForms balance={Number(wallet.user.balance)} />
        <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-glow">{translate(locale, "wallet.balanceMovement")}</div>
          <div className="mt-3 text-4xl font-semibold text-white">{currency(Number(wallet.user.balance))}</div>
          <div className="mt-8">
            <BalanceChart data={wallet.trend} />
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
        <div className="text-xs uppercase tracking-[0.3em] text-flame">{translate(locale, "wallet.transactionHistory")}</div>
        <div className="mt-5 space-y-3">
          {wallet.transactions.map((item) => (
            <div key={item.id} className="flex flex-col justify-between gap-2 rounded-3xl border border-white/10 bg-surface/70 p-4 sm:flex-row sm:items-center">
              <div>
                <div className="text-sm font-semibold text-white">{translateTransactionDescription(locale, item.description)}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted">{translateTransactionType(locale, item.type)}</div>
              </div>
              <div className={`text-sm font-semibold ${Number(item.amount) >= 0 ? "text-glow" : "text-flame"}`}>
                {currency(Number(item.amount))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
