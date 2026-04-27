"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { useNotify } from "@/components/providers/notification-provider";
import { translateError } from "@/lib/i18n";
import { currency } from "@/lib/utils";

export function WalletForms({ balance }: { balance: number }) {
  const [deposit, setDeposit] = useState("250");
  const [withdraw, setWithdraw] = useState("100");
  const [pending, startTransition] = useTransition();
  const { notify } = useNotify();
  const { t, locale } = useLocale();

  async function submit(url: string, amount: string, success: string) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount) }),
    });
    const payload = await response.json();
    if (!response.ok) {
      notify(payload.error ? translateError(locale, payload.error) : t("wallet.failed"), "error");
      return;
    }
    notify(success);
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-card/75 p-6">
        <div className="text-xs uppercase tracking-[0.3em] text-glow">{t("wallet.availableBalance")}</div>
        <div className="mt-4 text-4xl font-semibold text-white">{currency(balance)}</div>
      </div>

      <form
        className="space-y-4 rounded-[2rem] border border-white/10 bg-card/75 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(() => submit("/api/wallet/deposit", deposit, t("wallet.depositSuccess")));
        }}
      >
        <div className="text-lg font-semibold text-white">{t("wallet.depositFunds")}</div>
        <input value={deposit} onChange={(event) => setDeposit(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white" type="number" min="1" step="0.01" />
        <button type="submit" disabled={pending} className="rounded-full bg-glow px-5 py-3 text-sm font-semibold text-slate-950">
          {t("wallet.deposit")}
        </button>
      </form>

      <form
        className="space-y-4 rounded-[2rem] border border-white/10 bg-card/75 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(() => submit("/api/wallet/withdraw", withdraw, t("wallet.withdrawSuccess")));
        }}
      >
        <div className="text-lg font-semibold text-white">{t("wallet.withdrawFunds")}</div>
        <input value={withdraw} onChange={(event) => setWithdraw(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white" type="number" min="1" step="0.01" />
        <button type="submit" disabled={pending} className="rounded-full bg-flame px-5 py-3 text-sm font-semibold text-slate-950">
          {t("wallet.withdraw")}
        </button>
      </form>
    </div>
  );
}
