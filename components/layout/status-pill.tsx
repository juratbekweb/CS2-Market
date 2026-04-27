import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]",
        tone === "success" && "border-glow/30 bg-glow/10 text-glow",
        tone === "warning" && "border-flame/30 bg-flame/10 text-flame",
        tone === "neutral" && "border-white/10 bg-white/5 text-slate-200",
      )}
    >
      {children}
    </span>
  );
}
