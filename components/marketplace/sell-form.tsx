"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { useNotify } from "@/components/providers/notification-provider";
import { translateError } from "@/lib/i18n";

export function SellForm({ skinId, suggestedPrice }: { skinId: string; suggestedPrice: number }) {
  const [askPrice, setAskPrice] = useState(String(suggestedPrice));
  const [pending, startTransition] = useTransition();
  const { notify } = useNotify();
  const { t, locale } = useLocale();

  return (
    <form
      className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-card/70 p-5"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const response = await fetch("/api/market/listings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "SELL", skinId, askPrice: Number(askPrice) }),
          });
          const payload = await response.json();
          if (!response.ok) {
            notify(payload.error ? translateError(locale, payload.error) : t("sell.failed"), "error");
            return;
          }
          notify(t("sell.success"));
          window.location.reload();
        });
      }}
    >
      <label className="text-sm text-slate-200">{t("sell.label")}</label>
      <input
        value={askPrice}
        onChange={(event) => setAskPrice(event.target.value)}
        type="number"
        min="1"
        step="0.01"
        className="rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white outline-none ring-0"
      />
      <button type="submit" disabled={pending} className="rounded-full bg-flame px-4 py-3 text-sm font-semibold text-slate-950">
        {pending ? t("sell.pending") : t("sell.submit")}
      </button>
    </form>
  );
}
