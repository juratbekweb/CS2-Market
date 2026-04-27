import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SectionHeading } from "@/components/layout/section-heading";
import { SellForm } from "@/components/marketplace/sell-form";
import { localizeSkin, translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { getInventorySnapshot } from "@/lib/store";
import { currency } from "@/lib/utils";

export default async function InventoryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const items = await getInventorySnapshot(session.user);
  if (!items) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={translate(locale, "inventory.eyebrow")}
        title={translate(locale, "inventory.title")}
        description={translate(locale, "inventory.description")}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {items.map((item) => {
          const skin = localizeSkin(locale, item.skin);

          return (
            <div key={item.id} className="grid gap-5 rounded-[2rem] border border-white/10 bg-card/75 p-5 md:grid-cols-[220px,1fr]">
              <div className="relative h-56 overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/5 to-glow/10">
                <Image src={item.skin.image} alt={skin.name} fill className="object-contain p-4" />
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{skin.name}</h2>
                  <p className="text-sm text-muted">{skin.exterior} • {item.skin.collection}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-surface/70 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted">{translate(locale, "inventory.costBasis")}</div>
                    <div className="mt-2 text-lg text-white">{currency(Number(item.acquisition))}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-surface/70 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted">{translate(locale, "inventory.currentValue")}</div>
                    <div className="mt-2 text-lg text-white">{currency(Number(item.currentValue))}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-surface/70 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted">{translate(locale, "inventory.pl")}</div>
                    <div className={`mt-2 text-lg ${item.pnl >= 0 ? "text-glow" : "text-flame"}`}>{currency(Number(item.pnl))}</div>
                  </div>
                </div>
                {item.isListed ? (
                  <div className="rounded-2xl border border-glow/20 bg-glow/10 px-4 py-3 text-sm text-glow">
                    {translate(locale, "inventory.listed")}
                  </div>
                ) : (
                  <SellForm skinId={item.skin.id} suggestedPrice={item.currentValue} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
