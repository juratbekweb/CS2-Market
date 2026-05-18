"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { localeLabels, useLocale } from "@/components/providers/locale-provider";
import { locales, type Locale } from "@/lib/i18n";
import { Globe, ChevronDown, Check } from "lucide-react";

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (nextLocale: Locale) => {
    setLocale(nextLocale);
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 rounded-full border border-white/10 bg-surface/50 px-3 py-2 text-xs font-medium text-slate-200 transition-all hover:border-glow/40 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(89,242,196,0.15)] focus:outline-none"
      >
        <Globe className="size-3.5 text-muted transition-colors group-hover:text-glow" />
        <span className="hidden sm:inline">{localeLabels[locale]}</span>
        <ChevronDown className={`size-3.5 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-glow' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#161821] p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 z-50">
          {locales.map((item) => (
            <button
              key={item}
              onClick={() => handleSelect(item)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                locale === item 
                  ? "bg-glow/10 text-glow" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {localeLabels[item]}
              {locale === item && <Check className="size-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
