import { NextResponse } from "next/server";
import { verifyRoll } from "@/lib/provably-fair";

/**
 * POST /api/upgrade/verify
 * Verify a provably fair upgrade result
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serverSeed, serverSeedHash, clientSeed, nonce, expectedRoll } = body;

    if (!serverSeed || !serverSeedHash || !clientSeed || nonce === undefined || expectedRoll === undefined) {
      return NextResponse.json({ error: "All verification parameters are required" }, { status: 400 });
    }

    const isValid = verifyRoll(serverSeed, serverSeedHash, clientSeed, nonce, expectedRoll);

    return NextResponse.json({
      verified: isValid,
      message: isValid ? "Result is provably fair and verified" : "Verification failed — result may have been tampered with",
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
