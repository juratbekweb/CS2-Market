import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { getLocaleTag } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { LiveActivityFeed } from "@/components/layout/live-activity-feed";
import "./globals.css";

const heading = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const body = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "NightMarket | CS2 Skin Marketplace",
  description: "Production-ready CS2 skin marketplace built with Next.js, Prisma, Google auth, and Steam trading connections.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={getLocaleTag(locale)} className={`${heading.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme && theme !== 'default') {
                  document.documentElement.setAttribute('data-theme', theme);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <AuthSessionProvider>
          <LocaleProvider initialLocale={locale}>
            <NotificationProvider>
              <SocketProvider>
                <div className="relative min-h-screen overflow-x-hidden">
                  {/* Background Effects */}
                  <div className="pointer-events-none absolute inset-0">
                    {/* Neon Glows */}
                    <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(161,0,255,0.15)_0%,transparent_70%)] blur-[80px] animate-float-slow" />
                    <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.15)_0%,transparent_70%)] blur-[80px] animate-float-slow" style={{ animationDelay: '-4s' }} />
                    <div className="absolute top-[30%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(0,255,135,0.08)_0%,transparent_70%)] blur-[60px] animate-float-fast" />
                    
                    {/* Cinematic Fog/Ambient Light */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#a100ff]/5 to-transparent opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f0ff]/5 to-transparent opacity-30" />
                    
                    {/* Grid */}
                    <div className="absolute inset-0 bg-hero-grid opacity-10" />
                  </div>
                  <div className="relative z-10 flex min-h-screen flex-col pt-[104px]">
                    <SiteHeader />
                    <LiveActivityFeed />
                    <main className="flex-1">{children}</main>
                    <SiteFooter />
                  </div>
                </div>
              </SocketProvider>
            </NotificationProvider>
          </LocaleProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
