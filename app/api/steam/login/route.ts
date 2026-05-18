import { NextResponse } from "next/server";
import { buildSteamClient } from "@/lib/steam";

export async function GET() {
  const realm = process.env.STEAM_REALM || process.env.NEXTAUTH_URL || "http://localhost:3000";
  // We use query param to distinguish between login and connect
  const returnUrl = `${realm}/api/steam/callback?intent=login`;
  const relyingParty = buildSteamClient(returnUrl, realm);

  const redirectUrl = await new Promise<string>((resolve, reject) => {
    relyingParty.authenticate("https://steamcommunity.com/openid", false, (error, url) => {
      if (error || !url) reject(error ?? new Error("Steam authentication URL unavailable"));
      else resolve(url);
    });
  });

  return NextResponse.redirect(redirectUrl);
}
