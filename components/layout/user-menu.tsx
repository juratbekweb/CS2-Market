"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useLocale } from "@/components/providers/locale-provider";

export function UserMenu({ session }: { session: Session | null }) {
  const { t } = useLocale();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pr-1 pl-4 py-1">
      <div className="hidden text-right sm:block mr-1">
        <div className="text-[13px] font-bold text-white leading-tight">{session.user.name}</div>
        <div className="text-[10px] text-muted leading-tight">{session.user.email}</div>
      </div>
      <Link href="/dashboard" className="transition-transform hover:scale-105">
        <Image
          src={session.user.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80"}
          alt={session.user.name || t("user.avatarAlt")}
          width={36}
          height={36}
          className="rounded-full border border-white/20 object-cover"
        />
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
        title={t("user.logout")}
      >
        <LogOut className="size-4" />
      </button>
    </div>
  );
}
