"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { useNotify } from "@/components/providers/notification-provider";
import { translateError } from "@/lib/i18n";

type AdminUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  steamId?: string | null;
  isBlocked: boolean;
  role: "USER" | "ADMIN";
};

export function AdminControls({ commissionRate, users }: { commissionRate: number; users: AdminUser[] }) {
  const [rate, setRate] = useState(String(commissionRate * 100));
  const [pending, startTransition] = useTransition();
  const { notify } = useNotify();
  const { t, locale } = useLocale();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr,1.2fr]">
      <form
        className="space-y-4 rounded-[2rem] border border-white/10 bg-card/75 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            const response = await fetch("/api/admin/settings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ commissionRate: Number(rate) / 100 }),
            });
            const payload = await response.json();
            if (!response.ok) {
              notify(payload.error ? translateError(locale, payload.error) : t("admin.commissionFailed"), "error");
              return;
            }
            notify(t("admin.commissionUpdated"));
            window.location.reload();
          });
        }}
      >
        <div className="text-lg font-semibold text-white">{t("admin.commission")}</div>
        <input value={rate} onChange={(event) => setRate(event.target.value)} type="number" min="0" max="30" step="0.1" className="w-full rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white" />
        <button type="submit" disabled={pending} className="rounded-full bg-glow px-5 py-3 text-sm font-semibold text-slate-950">
          {t("admin.saveCommission")}
        </button>
      </form>

      <div className="rounded-[2rem] border border-white/10 bg-card/75 p-6">
        <div className="text-lg font-semibold text-white">{t("admin.userModeration")}</div>
        <div className="mt-5 space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col justify-between gap-3 rounded-3xl border border-white/10 bg-surface/70 p-4 sm:flex-row sm:items-center">
              <div>
                <div className="text-sm font-semibold text-white">{user.name}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted">
                  {user.email} • {user.role} • {user.steamId ? t("header.steamLinked") : t("admin.steamMissing")}
                </div>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const response = await fetch("/api/admin/users", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ userId: user.id }),
                    });
                    const payload = await response.json();
                    if (!response.ok) {
                      notify(payload.error ? translateError(locale, payload.error) : t("admin.userUpdateFailed"), "error");
                      return;
                    }
                    notify(payload.blocked ? t("admin.userBlocked") : t("admin.userUnblocked"));
                    window.location.reload();
                  })
                }
                className={`rounded-full px-4 py-2 text-sm font-medium ${user.isBlocked ? "bg-glow text-slate-950" : "bg-flame text-slate-950"}`}
              >
                {user.isBlocked ? t("admin.unblock") : t("admin.block")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
