import Link from "next/link";
import { Activity, ShieldCheck, Wallet } from "lucide-react";
import { auth } from "@/auth";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { UserMenu } from "@/components/layout/user-menu";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

const nav = [
  { href: "/marketplace", label: "nav.marketplace" },
  { href: "/dashboard", label: "nav.dashboard" },
  { href: "/inventory", label: "nav.inventory" },
  { href: "/wallet", label: "nav.wallet" },
];

export async function SiteHeader() {
  const session = await auth();
  const locale = await getLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl border border-glow/30 bg-glow/10 p-2 shadow-glow">
            <ShieldCheck className="size-5 text-glow" />
          </div>
          <div>
            <div className="font-heading text-lg uppercase tracking-[0.35em] text-white">NightMarket</div>
            <div className="text-xs text-muted">{translate(locale, "brand.tagline")}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
              {translate(locale, item.label)}
            </Link>
          ))}
          {session?.user.role === "ADMIN" ? (
            <Link href="/admin" className="text-sm text-flame transition hover:text-white">
              {translate(locale, "nav.admin")}
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {session?.user ? (
            <>
              <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 sm:flex">
                <Wallet className="size-4 text-glow" />
                {translate(locale, "header.balance")}: {session.user.balance.toFixed(2)} USD
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 lg:flex">
                <Activity className="size-4 text-flame" />
                {session.user.steamId ? translate(locale, "header.steamLinked") : translate(locale, "header.tradingLocked")}
              </div>
            </>
          ) : null}
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  );
}
