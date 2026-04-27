import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { buildSteamClient } from "@/lib/steam";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  }

  const realm = process.env.STEAM_REALM || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const returnUrl = process.env.STEAM_RETURN_URL || `${realm}/api/steam/callback`;
  const relyingParty = buildSteamClient(returnUrl, realm);

  const redirectUrl = await new Promise<string>((resolve, reject) => {
    relyingParty.authenticate("https://steamcommunity.com/openid", false, (error, url) => {
      if (error || !url) reject(error ?? new Error("Steam authentication URL unavailable"));
      else resolve(url);
    });
  });

  return NextResponse.redirect(redirectUrl);
}
