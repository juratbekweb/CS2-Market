import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SectionHeading } from "@/components/layout/section-heading";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { getAdminSnapshot } from "@/lib/store";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

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

      <AdminDashboard admin={admin} locale={locale} />
    </div>
  );
}
