import { NextResponse } from "next/server";
import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentUserByEmail } from "@/lib/store";
import { buildSteamClient, extractSteamId } from "@/lib/steam";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const intent = searchParams.get("intent") || "login";

  const realm = process.env.STEAM_REALM || process.env.NEXTAUTH_URL || "http://localhost:3000";
  const returnUrl = `${realm}/api/steam/callback?intent=${intent}`;
  const relyingParty = buildSteamClient(returnUrl, realm);

  const result = await new Promise<{ authenticated?: boolean; claimedIdentifier?: string }>((resolve, reject) => {
    relyingParty.verifyAssertion(request.url, (error, verification) => {
      if (error) reject(error);
      else resolve(verification ?? {});
    });
  }).catch(() => null);

  const steamId = extractSteamId(result?.claimedIdentifier);
  if (!result?.authenticated || !steamId) {
    return NextResponse.redirect(new URL("/login?error=SteamAuthFailed", realm));
  }

  // Fetch Steam Profile Data
  let name = "Steam User";
  let avatar = null;
  
  if (process.env.STEAM_API_KEY) {
    try {
      const steamResponse = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`
      );
      const steamData = await steamResponse.json();
      const player = steamData.response?.players?.[0];
      if (player) {
        name = player.personaname;
        avatar = player.avatarfull;
      }
    } catch (err) {
      console.error("Failed to fetch Steam profile:", err);
    }
  }

  if (intent === "login") {
    // Log in with Steam
    try {
      await signIn("steam-login", { steamId, name, avatar, redirect: false });
      return NextResponse.redirect(new URL("/dashboard", realm));
    } catch (err) {
      console.error("Failed to sign in with Steam:", err);
      return NextResponse.redirect(new URL("/login?error=SignInFailed", realm));
    }
  } else if (intent === "connect") {
    // Connect Steam to existing account
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/login", realm));
    }

    if (process.env.DATABASE_URL) {
      const user = await getCurrentUserByEmail(session.user.email);
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            steamId,
            avatar: avatar || user.avatar, // Update avatar if fetched
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

  return NextResponse.redirect(new URL("/dashboard", realm));
}
