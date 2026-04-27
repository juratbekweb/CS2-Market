"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLocale } from "@/components/providers/locale-provider";

const demoUsers = [
  { email: "ava@nightmarket.gg", tone: "bg-glow text-slate-950", labelKey: "demo.user" },
  { email: "admin@nightmarket.gg", tone: "bg-flame text-slate-950", labelKey: "demo.admin" },
] as const;

export function DemoAccessCard() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";
  const { t } = useLocale();

  return (
    <div className="rounded-[2rem] border border-white/10 bg-surface/40 p-5">
      <div className="text-xs uppercase tracking-[0.3em] text-glow">{t("demo.eyebrow")}</div>
      <div className="mt-3 text-lg font-semibold text-white">{t("demo.title")}</div>
      <p className="mt-2 text-sm leading-7 text-muted">{t("demo.description")}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {demoUsers.map((user) => (
          <button
            key={user.email}
            type="button"
            onClick={() => signIn("demo-access", { email: user.email, callbackUrl })}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition hover:scale-[1.01] ${user.tone}`}
          >
            {t(user.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
