import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { PriceHistoryChart } from "@/components/charts/price-history-chart";
import { SectionHeading } from "@/components/layout/section-heading";
import { StatusPill } from "@/components/layout/status-pill";
import { BuyButton } from "@/components/marketplace/buy-button";
import { FavoriteButton } from "@/components/marketplace/favorite-button";
import { localizeSkin, translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { getSkinBySlug } from "@/lib/store";
import { currency } from "@/lib/utils";

export default async function SkinDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  const locale = await getLocale();
  const { slug } = await params;
  const skin = await getSkinBySlug(slug, session?.user);

  if (!skin) notFound();

  const localizedSkin = localizeSkin(locale, skin);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
          <div className="relative h-[420px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/5 to-glow/10">
            <Image src={skin.image} alt={localizedSkin.name} fill className="object-contain p-10" />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-surface/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted">{translate(locale, "detail.collection")}</div>
              <div className="mt-2 text-lg font-semibold text-white">{skin.collection}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-surface/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted">{translate(locale, "detail.wear")}</div>
              <div className="mt-2 text-lg font-semibold text-white">{skin.wear.toFixed(2)}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-surface/70 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted">{translate(locale, "detail.liquidityScore")}</div>
              <div className="mt-2 text-lg font-semibold text-white">{skin.liquidityScore}/100</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone="success">{localizedSkin.rarity}</StatusPill>
              <StatusPill>{localizedSkin.category}</StatusPill>
              <StatusPill>{localizedSkin.exterior}</StatusPill>
            </div>
            <h1 className="mt-5 font-heading text-4xl uppercase tracking-[0.12em] text-white">{localizedSkin.name}</h1>
            <p className="mt-4 text-base leading-8 text-slate-300">{localizedSkin.description}</p>
            <div className="mt-8 flex items-end justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-muted">{translate(locale, "detail.lowestAsk")}</div>
                <div className="mt-2 text-4xl font-semibold text-white">{currency(skin.activeAskPrice)}</div>
              </div>
              <div className="flex flex-wrap gap-3">
                <FavoriteButton skinId={skin.id} initial={skin.favorite} />
                {skin.activeListingId ? <BuyButton listingId={skin.activeListingId} /> : null}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
            <SectionHeading
              eyebrow={translate(locale, "detail.priceHistory")}
              title={translate(locale, "detail.sevenDay")}
              description={translate(locale, "detail.priceHistoryDesc")}
            />
            <div className="mt-8">
              <PriceHistoryChart data={skin.history} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
