import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SectionHeading } from "@/components/layout/section-heading";
import { localizeSkin, translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { getInventorySnapshot } from "@/lib/store";
import { InventoryClient } from "@/components/inventory/inventory-client";

export default async function InventoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const items = await getInventorySnapshot(session.user);
  if (!items) redirect("/login");

  const localizedItems = items.map(item => ({
    ...item,
    skin: localizeSkin(locale, item.skin)
  }));

  return (
    <div className="mx-auto max-w-[1600px] space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={translate(locale, "inventory.eyebrow")}
        title={translate(locale, "inventory.title")}
        description={translate(locale, "inventory.description")}
      />

      <InventoryClient items={localizedItems} />
    </div>
  );
}
