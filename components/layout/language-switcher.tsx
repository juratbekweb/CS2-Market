"use client";

import { useRouter } from "next/navigation";
import { localeLabels, useLocale } from "@/components/providers/locale-provider";
import { locales, type Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale, setLocale, t } = useLocale();

  return (
    <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
      <span className="hidden sm:inline">{t("language.label")}</span>
      <select
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value as Locale;
          setLocale(nextLocale);
          router.refresh();
        }}
        className="bg-transparent outline-none"
        aria-label={t("language.label")}
      >
        {locales.map((item) => (
          <option key={item} value={item} className="bg-slate-950 text-white">
            {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
