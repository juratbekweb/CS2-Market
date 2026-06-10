import { auth } from "@/auth";
import { MarketplaceGrid } from "@/components/marketplace/marketplace-grid";
import { getMarketplaceData } from "@/lib/store";
import { getLocale } from "@/lib/locale-server";
import { translate } from "@/lib/i18n";
import { ShoppingCart } from "lucide-react";

export default async function MarketplacePage() {
  const session = await auth();
  const locale = await getLocale();
  const listings = await getMarketplaceData(session?.user);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 text-[#00f0ff] mb-2 font-heading font-bold tracking-wider text-xs">
          <ShoppingCart className="size-4" /> P2P MARKETPLACE
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
          {translate(locale, "marketplace.title")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400 font-medium">
          {translate(locale, "marketplace.description")}
        </p>
      </div>

      <MarketplaceGrid initialListings={listings as any} />
    </div>
  );
}
