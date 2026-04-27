import { cookies } from "next/headers";
import { getDefaultLocale, isLocale, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const cookieValue = store.get("site-locale")?.value;
  return cookieValue && isLocale(cookieValue) ? cookieValue : getDefaultLocale();
}
