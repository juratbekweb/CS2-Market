"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLocale } from "@/components/providers/locale-provider";

export function GoogleLoginCard({ enabled }: { enabled: boolean }) {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";
  const { t } = useLocale();

  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={() => signIn("google", { callbackUrl })}
      className="inline-flex items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {enabled ? t("google.continue") : t("google.disabled")}
    </button>
  );
}
