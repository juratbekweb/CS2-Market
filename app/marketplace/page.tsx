import { auth } from "@/auth";
import { SectionHeading } from "@/components/layout/section-heading";
import { MarketplaceGrid } from "@/components/marketplace/marketplace-grid";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { getMarketplaceData } from "@/lib/store";

export const revalidate = 300;

export default async function MarketplacePage() {
  const session = await auth();
  const locale = await getLocale();
  const listings = await getMarketplaceData(session?.user);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={translate(locale, "marketplace.eyebrow")}
        title={translate(locale, "marketplace.title")}
        description={translate(locale, "marketplace.description")}
      />
      <div className="mt-10">
        <MarketplaceGrid listings={listings} />
      </div>
    </div>
  );
}
