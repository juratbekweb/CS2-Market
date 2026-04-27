"use client";

import Image from "next/image";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useLocale } from "@/components/providers/locale-provider";

export function UserMenu({ session }: { session: Session | null }) {
  const { t } = useLocale();

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full border border-glow/30 bg-glow/10 px-4 py-2 text-sm font-medium text-glow transition hover:bg-glow/20"
      >
        <LogIn className="size-4" />
        {t("user.login")}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <div className="text-sm text-white">{session.user.name}</div>
        <div className="text-xs text-muted">{session.user.email}</div>
      </div>
      <Image
        src={session.user.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80"}
        alt={session.user.name || t("user.avatarAlt")}
        width={40}
        height={40}
        className="rounded-full border border-white/20 object-cover"
      />
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
      >
        <LogOut className="size-4" />
        {t("user.logout")}
      </button>
    </div>
  );
}
