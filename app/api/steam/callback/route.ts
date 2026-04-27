import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentUserByEmail } from "@/lib/store";
import { buildSteamClient, extractSteamId } from "@/lib/steam";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  }

  const realm = process.env.STEAM_REALM || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const returnUrl = process.env.STEAM_RETURN_URL || `${realm}/api/steam/callback`;
  const relyingParty = buildSteamClient(returnUrl, realm);

  const result = await new Promise<{ authenticated?: boolean; claimedIdentifier?: string }>((resolve, reject) => {
    relyingParty.verifyAssertion(request.url, (error, verification) => {
      if (error) reject(error);
      else resolve(verification ?? {});
    });
  }).catch(() => null);

  const steamId = extractSteamId(result?.claimedIdentifier);
  if (!result?.authenticated || !steamId) {
    return NextResponse.redirect(new URL("/dashboard?steam=failed", realm));
  }

  if (process.env.DATABASE_URL) {
    const user = await getCurrentUserByEmail(session.user.email);
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          steamId,
          notifications: {
            create: {
              title: "Steam connected",
              body: "Trading is now unlocked for your account.",
            },
          },
        },
      });
    }
  }

  return NextResponse.redirect(new URL("/dashboard?steam=connected", realm));
}
