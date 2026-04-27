"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { useNotify } from "@/components/providers/notification-provider";
import { translateError } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function FavoriteButton({ skinId, initial }: { skinId: string; initial: boolean }) {
  const [favorite, setFavorite] = useState(initial);
  const [pending, startTransition] = useTransition();
  const { notify } = useNotify();
  const { t, locale } = useLocale();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const response = await fetch("/api/user/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skinId }),
          });
          const payload = await response.json();
          if (!response.ok) {
            notify(payload.error ? translateError(locale, payload.error) : t("favorite.failed"), "error");
            return;
          }
          setFavorite(payload.favorite);
          notify(payload.favorite ? t("favorite.added") : t("favorite.removed"));
        })
      }
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] transition",
        favorite ? "border-glow/30 bg-glow/10 text-glow" : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
      )}
    >
      <Heart className={cn("size-4", favorite && "fill-current")} />
      {favorite ? t("favorite.watching") : t("favorite.watch")}
    </button>
  );
}
