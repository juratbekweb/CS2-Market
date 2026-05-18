import { auth } from "@/auth";
import { localizeSkin } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { getMarketplaceData } from "@/lib/store";
import { ClientHome } from "@/components/home/client-home";

export default async function HomePage() {
  const session = await auth();
  const locale = await getLocale();
  const listings = await getMarketplaceData(session?.user);
  const featured = listings.slice(0, 4).map((listing) => ({ 
    ...listing, 
    skin: localizeSkin(locale, listing.skin) 
  }));

  // Get active user count (mocked for now, can be real later)
  const activeUserCount = 14203; 

  return (
    <ClientHome 
      featuredListings={featured} 
      userCount={activeUserCount} 
    />
  );
}
