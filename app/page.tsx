import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, Wallet } from "lucide-react";
import { auth } from "@/auth";
import { SectionHeading } from "@/components/layout/section-heading";
import { localizeSkin, translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { getMarketplaceData } from "@/lib/store";
import { currency } from "@/lib/utils";

export default async function HomePage() {
  const session = await auth();
  const locale = await getLocale();
  const listings = await getMarketplaceData(session?.user);
  const featured = listings.slice(0, 3).map((listing) => ({ ...listing, skin: localizeSkin(locale, listing.skin) }));

  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr,0.9fr] lg:px-8">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-glow/30 bg-glow/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-glow">
            {translate(locale, "home.badge")}
          </div>
          <div className="space-y-6">
            <h1 className="font-heading text-5xl uppercase leading-[0.95] tracking-[0.12em] text-white sm:text-7xl">
              {translate(locale, "home.title")}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">{translate(locale, "home.description")}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-full bg-glow px-6 py-4 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]">
              {translate(locale, "home.explore")}
              <ArrowRight className="size-4" />
            </Link>
            <Link href={session?.user ? "/dashboard" : "/login"} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10">
              {session?.user ? translate(locale, "home.openDashboard") : translate(locale, "home.loginToTrade")}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-card/70 p-5">
              <ShieldCheck className="size-5 text-glow" />
              <div className="mt-4 text-2xl font-semibold text-white">{translate(locale, "home.googleSteam")}</div>
              <div className="mt-2 text-sm text-muted">{translate(locale, "home.googleSteamDesc")}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-card/70 p-5">
              <Wallet className="size-5 text-flame" />
              <div className="mt-4 text-2xl font-semibold text-white">{translate(locale, "home.walletRails")}</div>
              <div className="mt-2 text-sm text-muted">{translate(locale, "home.walletRailsDesc")}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-card/70 p-5">
              <BarChart3 className="size-5 text-glow" />
              <div className="mt-4 text-2xl font-semibold text-white">{translate(locale, "home.analytics")}</div>
              <div className="mt-2 text-sm text-muted">{translate(locale, "home.analyticsDesc")}</div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-card/75 p-6 shadow-glow">
          <SectionHeading
            eyebrow={translate(locale, "home.marketPulse")}
            title={translate(locale, "home.dealBoard")}
            description={translate(locale, "home.dealBoardDesc")}
          />
          <div className="mt-8 space-y-4">
            {featured.map((listing) => (
              <div key={listing.id} className="rounded-3xl border border-white/10 bg-surface/70 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-white">{listing.skin.name}</div>
                    <div className="text-sm text-muted">{listing.skin.category} • {listing.skin.finishStyle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted">{translate(locale, "home.bestAsk")}</div>
                    <div className="text-xl font-semibold text-white">{currency(listing.askPrice)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-card via-panel to-card p-8">
          <SectionHeading
            eyebrow={translate(locale, "home.why")}
            title={translate(locale, "home.trustTitle")}
            description={translate(locale, "home.trustDesc")}
          />
        </div>
      </section>
    </div>
  );
}
