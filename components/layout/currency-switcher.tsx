"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const currencies = ["USD", "UZS", "RUB"];

export function CurrencySwitcher() {
  const [currency, setCurrency] = useState("USD");
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

  const handleSelect = (cur: string) => {
    setCurrency(cur);
    setIsOpen(false);
    // In a real app, this would update a global context or cookie
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[11px] font-bold text-white bg-white/5 hover:bg-white/10 px-2 py-1.5 rounded border border-white/10 transition-colors uppercase tracking-wider"
      >
        {currency} <ChevronDown className={`size-3 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-glow' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-24 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#161821] p-1 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 z-50">
          {currencies.map((cur) => (
            <button
              key={cur}
              onClick={() => handleSelect(cur)}
              className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-bold transition-colors ${
                currency === cur 
                  ? "bg-glow/10 text-glow" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {cur}
              {currency === cur && <Check className="size-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
