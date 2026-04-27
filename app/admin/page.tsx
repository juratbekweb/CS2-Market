import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminControls } from "@/components/admin-controls";
import { SectionHeading } from "@/components/layout/section-heading";
import {
  translate,
  translateListingStatus,
  translateTransactionDescription,
  translateTransactionType,
} from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { getAdminSnapshot } from "@/lib/store";
import { currency } from "@/lib/utils";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const locale = await getLocale();
  const admin = await getAdminSnapshot();

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={translate(locale, "admin.eyebrow")}
        title={translate(locale, "admin.title")}
        description={translate(locale, "admin.description")}
      />

      <AdminControls commissionRate={admin.commissionRate} users={admin.users} />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-glow">{translate(locale, "admin.listings")}</div>
          <div className="mt-5 space-y-3">
            {admin.listings.map((listing) => (
              <div key={listing.id} className="flex items-center justify-between rounded-3xl border border-white/10 bg-surface/70 p-4">
                <div>
                  <div className="text-sm font-semibold text-white">{"skinSlug" in listing ? listing.skinSlug : listing.skin.name}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">{translateListingStatus(locale, listing.status)}</div>
                </div>
                <div className="text-sm font-semibold text-white">{currency(Number(listing.askPrice))}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-flame">{translate(locale, "admin.feed")}</div>
          <div className="mt-5 space-y-3">
            {admin.transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between rounded-3xl border border-white/10 bg-surface/70 p-4">
                <div>
                  <div className="text-sm font-semibold text-white">{translateTransactionDescription(locale, transaction.description)}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted">{translateTransactionType(locale, transaction.type)}</div>
                </div>
                <div className={`text-sm font-semibold ${Number(transaction.amount) >= 0 ? "text-glow" : "text-flame"}`}>
                  {currency(Number(transaction.amount))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
