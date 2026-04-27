import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  helper,
  accent = "glow",
}: {
  label: string;
  value: string;
  helper: string;
  accent?: "glow" | "flame";
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_24px_50px_rgba(0,0,0,.22)]">
      <div className={cn("text-xs uppercase tracking-[0.3em]", accent === "glow" ? "text-glow" : "text-flame")}>{label}</div>
      <div className="mt-4 text-3xl font-semibold text-white">{value}</div>
      <div className="mt-2 text-sm text-muted">{helper}</div>
    </div>
  );
}
