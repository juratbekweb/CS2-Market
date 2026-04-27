import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export async function SiteFooter() {
  const locale = await getLocale();

  return (
    <footer className="border-t border-white/10 bg-surface/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>{translate(locale, "footer.about")}</p>
        <p>{translate(locale, "footer.rules")}</p>
      </div>
    </footer>
  );
}
