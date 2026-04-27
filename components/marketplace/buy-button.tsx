"use client";

import { useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { useNotify } from "@/components/providers/notification-provider";
import { translateError } from "@/lib/i18n";

export function BuyButton({ listingId }: { listingId: string }) {
  const [pending, startTransition] = useTransition();
  const { notify } = useNotify();
  const { t, locale } = useLocale();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const response = await fetch("/api/market/listings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "BUY", listingId }),
          });
          const payload = await response.json();
          if (!response.ok) {
            notify(payload.error ? translateError(locale, payload.error) : t("buy.failed"), "error");
            return;
          }
          notify(t("buy.success"));
          window.location.reload();
        })
      }
      className="inline-flex items-center justify-center rounded-full bg-glow px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-70"
    >
      {pending ? t("buy.processing") : t("buy.instant")}
    </button>
  );
}
