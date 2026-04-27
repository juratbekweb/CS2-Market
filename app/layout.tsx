import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { getLocaleTag } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";
import "./globals.css";

const heading = Orbitron({ subsets: ["latin"], variable: "--font-heading" });
const body = Rajdhani({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "NightMarket | CS2 Skin Marketplace",
  description: "Production-ready CS2 skin marketplace built with Next.js, Prisma, Google auth, and Steam trading connections.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={getLocaleTag(locale)} className={`${heading.variable} ${body.variable}`}>
      <body>
        <AuthSessionProvider>
          <LocaleProvider initialLocale={locale}>
            <NotificationProvider>
              <div className="relative min-h-screen overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-hero-grid hero-grid opacity-30" />
                <div className="relative z-10 flex min-h-screen flex-col">
                  <SiteHeader />
                  <main className="flex-1">{children}</main>
                  <SiteFooter />
                </div>
              </div>
            </NotificationProvider>
          </LocaleProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
