"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FavoriteButton } from "@/components/marketplace/favorite-button";
import { BuyButton } from "@/components/marketplace/buy-button";
import { useLocale } from "@/components/providers/locale-provider";
import { currency } from "@/lib/utils";
import type { ListingCard } from "@/types/market";

type SortOption = "featured" | "price-asc" | "price-desc" | "liquidity";

export function MarketplaceGrid({ listings }: { listings: ListingCard[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const { t, localizeSkin } = useLocale();

  const localizedListings = useMemo(
    () => listings.map((listing) => ({ ...listing, skin: localizeSkin(listing.skin) })),
    [listings, localizeSkin],
  );

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    const next = localizedListings.filter((listing) => {
      const matchesQuery =
        listing.skin.name.toLowerCase().includes(normalized) ||
        listing.skin.category.toLowerCase().includes(normalized) ||
        listing.skin.collection.toLowerCase().includes(normalized);
      const matchesCategory = category === "all" || listing.skin.category === category;
      return matchesQuery && matchesCategory;
    });

    return next.sort((a, b) => {
      if (sort === "price-asc") return a.askPrice - b.askPrice;
      if (sort === "price-desc") return b.askPrice - a.askPrice;
      if (sort === "liquidity") return b.skin.liquidityScore - a.skin.liquidityScore;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [category, localizedListings, query, sort]);

  const categories = useMemo(
    () => ["all", ...new Set(localizedListings.map((listing) => listing.skin.category))],
    [localizedListings],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-card/70 p-4 md:grid-cols-[1.4fr,0.7fr,0.7fr]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("marketplace.search")}
          className="rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white outline-none placeholder:text-muted"
        />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white">
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? t("marketplace.allCategories") : item}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="rounded-2xl border border-white/10 bg-surface px-4 py-3 text-white">
          <option value="featured">{t("marketplace.sort.newest")}</option>
          <option value="price-asc">{t("marketplace.sort.priceAsc")}</option>
          <option value="price-desc">{t("marketplace.sort.priceDesc")}</option>
          <option value="liquidity">{t("marketplace.sort.liquidity")}</option>
        </select>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((listing) => (
          <article key={listing.id} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-card/80 shadow-[0_28px_60px_rgba(0,0,0,.25)] transition hover:-translate-y-1 hover:border-glow/30">
            <div className="relative h-64 overflow-hidden border-b border-white/10 bg-gradient-to-br from-white/5 via-transparent to-glow/10">
              <Image src={listing.skin.image} alt={listing.skin.name} fill className="object-contain p-6 transition duration-500 group-hover:scale-105" />
              <div className="absolute left-4 top-4 rounded-full border border-glow/20 bg-surface/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-glow">
                {listing.skin.rarity}
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/marketplace/${listing.skin.slug}`} className="text-lg font-semibold text-white transition hover:text-glow">
                    {listing.skin.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{listing.skin.finishStyle} • {listing.skin.exterior}</p>
                </div>
                <FavoriteButton skinId={listing.skin.id} initial={Boolean(listing.skin.favorite)} />
              </div>

              <p className="text-sm leading-7 text-slate-300">{listing.skin.description}</p>

              <div className="grid grid-cols-3 gap-3 rounded-3xl border border-white/10 bg-surface/70 p-4 text-center text-sm">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">{t("marketplace.wear")}</div>
                  <div className="mt-1 text-white">{listing.skin.wear.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">{t("marketplace.collection")}</div>
                  <div className="mt-1 text-white">{listing.skin.collection}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">{t("marketplace.liquidity")}</div>
                  <div className="mt-1 text-white">{listing.skin.liquidityScore}</div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">{t("marketplace.ask")}</div>
                  <div className="mt-1 text-2xl font-semibold text-white">{currency(listing.askPrice)}</div>
                </div>
                <BuyButton listingId={listing.id} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
