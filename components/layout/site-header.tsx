import Link from "next/link";
import { ShieldCheck, Wallet, Heart, Search } from "lucide-react";
import { auth } from "@/auth";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { CurrencySwitcher } from "@/components/layout/currency-switcher";
import { UserMenu } from "@/components/layout/user-menu";
import { NotificationDropdown } from "@/components/layout/notification-dropdown";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";

const nav = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Browse" },
  { href: "/cases", label: "Cases" },
  { href: "/upgrade", label: "Upgrade" },
  { href: "/contracts", label: "Contracts" },
  { href: "/battle", label: "Battle" },
  { href: "/inventory", label: "Inventory" },
  { href: "/orders", label: "Orders" },
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <div className="fixed top-2 left-2 right-2 sm:top-6 sm:left-6 sm:right-6 z-50 max-w-[1600px] mx-auto">
      <header className="premium-glass rounded-2xl reflective-glow">
        <div className="flex items-center justify-between gap-4 px-8 py-4">
          
          {/* Logo & Live Counter */}
          <div className="flex items-center gap-4 xl:gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="rounded-xl bg-gradient-to-br from-[#a100ff] to-[#00f0ff] p-[1px] group-hover:glow-purple transition-all duration-500">
                <div className="bg-[#020204] rounded-xl p-2">
                  <ShieldCheck className="size-6 text-[#00f0ff] group-hover:text-[#a100ff] transition-colors duration-500" />
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="font-heading text-xl uppercase tracking-[0.2em] font-bold bg-gradient-to-r from-[#a100ff] to-[#00f0ff] bg-clip-text text-transparent">NightMarket</div>
              </div>
            </Link>
            
            {/* Live Online Counter */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#05050a] border border-[#a100ff]/20 text-xs font-medium text-[#00ff87]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff87] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff87]"></span>
              </span>
              <span className="text-[#00ff87] glow-emerald">1,432 Online</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center gap-10 xl:flex flex-1 justify-center">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="group relative text-base font-semibold tracking-wider text-slate-400 transition-colors hover:text-white">
                {item.label}
                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-gradient-to-r from-[#a100ff] to-[#00f0ff] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            {session?.user.role === "ADMIN" ? (
              <Link href="/admin" className="group relative text-base font-semibold tracking-wider text-[#ff2a5f] transition-colors hover:text-white">
                Admin
                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#ff2a5f] transition-all duration-300 group-hover:w-full" />
              </Link>
            ) : null}
          </nav>

          {/* Search Bar & User Actions */}
          <div className="flex items-center gap-4 xl:gap-6">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center relative">
              <input 
                type="text" 
                placeholder="Search skins..." 
                className="bg-[#05050a] border border-[#ffaa00]/10 rounded-full px-5 py-2 pl-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#ffaa00]/30 focus:shadow-[0_0_15px_rgba(255,170,0,0.1)] transition-all duration-300 w-[200px] focus:w-[250px]"
              />
              <Search className="size-4 text-slate-600 absolute left-4 pointer-events-none" />
            </div>

            <div className="hidden md:flex items-center gap-4 border-r border-white/5 pr-4">
               <button className="text-slate-400 hover:text-white transition-colors relative">
                 <Heart className="size-5" />
                 <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff2a5f] text-[8px] font-bold text-white">2</span>
               </button>
               <NotificationDropdown />
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>

            {session?.user ? (
              <div className="hidden items-center gap-3 rounded-full border border-[#00f0ff]/20 bg-[#05050a] px-5 py-2 text-sm font-bold text-white sm:flex shadow-[0_0_10px_rgba(0,240,255,0.05)]">
                <Wallet className="size-4 text-[#00f0ff] glow-blue" />
                {session.user.balance.toFixed(2)}
                <button className="ml-3 bg-gradient-to-r from-[#a100ff] to-[#00f0ff] text-white rounded-full text-[10px] px-3 py-1 uppercase tracking-wider hover:glow-purple transition-all duration-300">Add</button>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block px-6 py-2 rounded-full bg-gradient-to-r from-[#a100ff] to-[#00f0ff] text-white text-xs font-bold uppercase tracking-wider hover:glow-purple transition-all duration-300">
                Login
              </Link>
            )}
            
            <UserMenu session={session} />

            <MobileNav nav={nav} session={session} />
          </div>
        </div>
      </header>
    </div>
  );
}
