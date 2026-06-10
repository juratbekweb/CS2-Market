"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

type Theme = "default" | "gold" | "ruby";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("default");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#05050a] text-slate-400 hover:text-white hover:border-[#a100ff]/50 transition-all duration-300"
        title="Change Theme"
      >
        <Palette className="size-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-36 rounded-xl border border-white/10 bg-[#05050a] p-2 shadow-xl premium-glass">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => changeTheme("default")}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  theme === "default" ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="size-3 rounded-full bg-gradient-to-br from-[#a100ff] to-[#00f0ff]" />
                Neon Cyber
              </button>
              <button
                onClick={() => changeTheme("gold")}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  theme === "gold" ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="size-3 rounded-full bg-gradient-to-br from-[#ffa500] to-[#ffd700]" />
                Gold Luxury
              </button>
              <button
                onClick={() => changeTheme("ruby")}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  theme === "ruby" ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="size-3 rounded-full bg-gradient-to-br from-[#900C3F] to-[#FF3366]" />
                Ruby Crimson
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
