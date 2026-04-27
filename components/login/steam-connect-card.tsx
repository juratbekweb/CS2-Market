import Link from "next/link";
import { Link2 } from "lucide-react";
import { StatusPill } from "@/components/layout/status-pill";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export async function SteamConnectCard({ connected }: { connected: boolean }) {
  const locale = await getLocale();

  return (
    <div className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-glow">{translate(locale, "steam.access")}</div>
          <div className="mt-2 text-2xl font-semibold text-white">{translate(locale, "steam.title")}</div>
        </div>
        <StatusPill tone={connected ? "success" : "warning"}>{connected ? translate(locale, "steam.connected") : translate(locale, "steam.required")}</StatusPill>
      </div>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted">{translate(locale, "steam.description")}</p>
      {!connected ? (
        <Link href="/api/steam/connect" className="mt-5 inline-flex items-center gap-2 rounded-full border border-glow/30 bg-glow/10 px-4 py-3 text-sm font-medium text-glow transition hover:bg-glow/20">
          <Link2 className="size-4" />
          {translate(locale, "steam.connect")}
        </Link>
      ) : null}
    </div>
  );
}
